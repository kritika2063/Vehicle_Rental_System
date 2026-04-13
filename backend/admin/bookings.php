<?php
/**
 * Bookings CRUD API (Admin)
 *
 * GET    /api/admin/bookings.php            - List all bookings (supports ?status=, ?user_id=)
 * GET    /api/admin/bookings.php?id=1       - Get single booking
 * POST   /api/admin/bookings.php            - Create a booking
 * PUT    /api/admin/bookings.php            - Update a booking
 * DELETE /api/admin/bookings.php?id=1       - Delete a booking
 *
 * Requires: X-Admin-Id header
 */

require_once __DIR__ . '/../middleware/admin_auth.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ─── LIST / GET SINGLE ───────────────────────────────
    case 'GET':
        if (!empty($_GET['id'])) {
            $stmt = $pdo->prepare("
                SELECT b.*, u.username as user_name, u.email as user_email,
                       v.name as vehicle_name, v.plate_number, v.daily_rate
                FROM bookings b
                LEFT JOIN users u ON b.user_id = u.id
                LEFT JOIN vehicles v ON b.vehicle_id = v.id
                WHERE b.id = ?
            ");
            $stmt->execute([$_GET['id']]);
            $booking = $stmt->fetch();

            if (!$booking) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Booking not found"]);
                exit;
            }
            echo json_encode(["success" => true, "data" => $booking]);
        } else {
            $conditions = [];
            $params = [];

            if (!empty($_GET['status'])) {
                $conditions[] = "b.status = ?";
                $params[] = $_GET['status'];
            }
            if (!empty($_GET['user_id'])) {
                $conditions[] = "b.user_id = ?";
                $params[] = $_GET['user_id'];
            }
            if (!empty($_GET['vehicle_id'])) {
                $conditions[] = "b.vehicle_id = ?";
                $params[] = $_GET['vehicle_id'];
            }

            $sql = "
                SELECT b.*, u.username as user_name, u.email as user_email,
                       v.name as vehicle_name, v.plate_number
                FROM bookings b
                LEFT JOIN users u ON b.user_id = u.id
                LEFT JOIN vehicles v ON b.vehicle_id = v.id
            ";
            if ($conditions) {
                $sql .= " WHERE " . implode(' AND ', $conditions);
            }
            $sql .= " ORDER BY b.created_at DESC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $bookings = $stmt->fetchAll();

            echo json_encode(["success" => true, "data" => $bookings]);
        }
        break;

    // ─── CREATE ──────────────────────────────────────────
    case 'POST':
        $body = json_decode(file_get_contents("php://input"), true);

        // Validate required fields
        $required = ['user_id', 'vehicle_id', 'start_date', 'end_date'];
        $missing = [];
        foreach ($required as $field) {
            if (empty($body[$field])) {
                $missing[] = $field;
            }
        }
        if ($missing) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Missing required fields: " . implode(', ', $missing)]);
            exit;
        }

        // Validate user exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->execute([$body['user_id']]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "User not found"]);
            exit;
        }

        // Validate vehicle exists and is available
        $stmt = $pdo->prepare("SELECT id, daily_rate, status FROM vehicles WHERE id = ?");
        $stmt->execute([$body['vehicle_id']]);
        $vehicle = $stmt->fetch();
        if (!$vehicle) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Vehicle not found"]);
            exit;
        }
        if ($vehicle['status'] !== 'available') {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Vehicle is not available for booking"]);
            exit;
        }

        // Validate dates
        $start = strtotime($body['start_date']);
        $end = strtotime($body['end_date']);
        if (!$start || !$end) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid date format. Use YYYY-MM-DD"]);
            exit;
        }
        if ($end <= $start) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "End date must be after start date"]);
            exit;
        }

        // Calculate total amount (number of days * daily_rate)
        $days = (int) ceil(($end - $start) / 86400);
        $total_amount = $body['total_amount'] ?? ($days * (float) $vehicle['daily_rate']);

        $stmt = $pdo->prepare("
            INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_amount, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            (int) $body['user_id'],
            (int) $body['vehicle_id'],
            $body['start_date'],
            $body['end_date'],
            (float) $total_amount,
            $body['status'] ?? 'pending',
            trim($body['notes'] ?? ''),
        ]);

        // Mark vehicle as rented
        $pdo->prepare("UPDATE vehicles SET status = 'rented' WHERE id = ?")->execute([$body['vehicle_id']]);

        $new_id = $pdo->lastInsertId();
        echo json_encode([
            "success" => true,
            "message" => "Booking created successfully",
            "id" => (int) $new_id,
            "total_amount" => (float) $total_amount,
            "days" => $days
        ]);
        break;

    // ─── UPDATE ──────────────────────────────────────────
    case 'PUT':
        $body = json_decode(file_get_contents("php://input"), true);
        $id = $body['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Booking ID is required"]);
            exit;
        }

        // Check booking exists
        $stmt = $pdo->prepare("SELECT * FROM bookings WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch();
        if (!$existing) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Booking not found"]);
            exit;
        }

        // Validate status if provided
        if (isset($body['status'])) {
            $valid_statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
            if (!in_array($body['status'], $valid_statuses)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Invalid status. Allowed: " . implode(', ', $valid_statuses)]);
                exit;
            }

            // If booking is completed or cancelled, make the vehicle available again
            if (in_array($body['status'], ['completed', 'cancelled']) && !in_array($existing['status'], ['completed', 'cancelled'])) {
                $pdo->prepare("UPDATE vehicles SET status = 'available' WHERE id = ?")->execute([$existing['vehicle_id']]);
            }
        }

        $allowed = ['start_date', 'end_date', 'total_amount', 'status', 'notes'];
        $fields = [];
        $values = [];
        foreach ($allowed as $field) {
            if (isset($body[$field])) {
                $fields[] = "$field = ?";
                $values[] = $body[$field];
            }
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "No valid fields to update"]);
            exit;
        }

        $values[] = $id;
        $sql = "UPDATE bookings SET " . implode(', ', $fields) . " WHERE id = ?";
        $pdo->prepare($sql)->execute($values);

        echo json_encode(["success" => true, "message" => "Booking updated successfully"]);
        break;

    // ─── DELETE ──────────────────────────────────────────
    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Booking ID is required"]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM bookings WHERE id = ?");
        $stmt->execute([$id]);
        $booking = $stmt->fetch();
        if (!$booking) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Booking not found"]);
            exit;
        }

        // Release the vehicle if booking was active
        if (in_array($booking['status'], ['pending', 'confirmed'])) {
            $pdo->prepare("UPDATE vehicles SET status = 'available' WHERE id = ?")->execute([$booking['vehicle_id']]);
        }

        $pdo->prepare("DELETE FROM bookings WHERE id = ?")->execute([$id]);
        echo json_encode(["success" => true, "message" => "Booking deleted successfully"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
