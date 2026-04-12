<?php
/**
 * Vehicles CRUD API (Admin)
 *
 * GET    /api/admin/vehicles.php            - List all vehicles (supports ?search=, ?status=)
 * GET    /api/admin/vehicles.php?id=1       - Get single vehicle
 * POST   /api/admin/vehicles.php            - Create a vehicle
 * PUT    /api/admin/vehicles.php            - Update a vehicle
 * DELETE /api/admin/vehicles.php?id=1       - Delete a vehicle
 *
 * Requires: X-Admin-Id header
 */

require_once __DIR__ . '/../middleware/admin_auth.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ─── LIST / GET SINGLE ───────────────────────────────
    case 'GET':
        if (!empty($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM vehicles WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $vehicle = $stmt->fetch();

            if (!$vehicle) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Vehicle not found"]);
                exit;
            }
            echo json_encode(["success" => true, "data" => $vehicle]);
        } else {
            $conditions = [];
            $params = [];

            // Filter by status
            if (!empty($_GET['status'])) {
                $conditions[] = "status = ?";
                $params[] = $_GET['status'];
            }

            // Search by name, brand, model, plate_number
            if (!empty($_GET['search'])) {
                $like = "%" . trim($_GET['search']) . "%";
                $conditions[] = "(name LIKE ? OR brand LIKE ? OR model LIKE ? OR plate_number LIKE ?)";
                $params = array_merge($params, [$like, $like, $like, $like]);
            }

            $sql = "SELECT * FROM vehicles";
            if ($conditions) {
                $sql .= " WHERE " . implode(' AND ', $conditions);
            }
            $sql .= " ORDER BY created_at DESC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $vehicles = $stmt->fetchAll();

            echo json_encode(["success" => true, "data" => $vehicles]);
        }
        break;

    // ─── CREATE ──────────────────────────────────────────
    case 'POST':
        $body = json_decode(file_get_contents("php://input"), true);

        // Validate required fields
        $required = ['name', 'type', 'brand', 'model', 'year', 'plate_number', 'daily_rate'];
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

        // Validate type
        $valid_types = ['car', 'bike', 'scooter', 'suv', 'van'];
        if (!in_array($body['type'], $valid_types)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid vehicle type. Allowed: " . implode(', ', $valid_types)]);
            exit;
        }

        // Validate daily_rate is positive
        if ((float) $body['daily_rate'] <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Daily rate must be a positive number"]);
            exit;
        }

        // Check plate_number uniqueness
        $stmt = $pdo->prepare("SELECT id FROM vehicles WHERE plate_number = ?");
        $stmt->execute([trim($body['plate_number'])]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(["success" => false, "message" => "A vehicle with this plate number already exists"]);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO vehicles (name, type, brand, model, year, color, plate_number, daily_rate, status, image_url, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            trim($body['name']),
            $body['type'],
            trim($body['brand']),
            trim($body['model']),
            (int) $body['year'],
            trim($body['color'] ?? ''),
            trim($body['plate_number']),
            (float) $body['daily_rate'],
            $body['status'] ?? 'available',
            trim($body['image_url'] ?? ''),
            trim($body['description'] ?? ''),
        ]);

        $new_id = $pdo->lastInsertId();
        echo json_encode(["success" => true, "message" => "Vehicle created successfully", "id" => (int) $new_id]);
        break;

    // ─── UPDATE ──────────────────────────────────────────
    case 'PUT':
        $body = json_decode(file_get_contents("php://input"), true);
        $id = $body['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Vehicle ID is required"]);
            exit;
        }

        // Check vehicle exists
        $stmt = $pdo->prepare("SELECT id FROM vehicles WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Vehicle not found"]);
            exit;
        }

        // Validate type if provided
        if (isset($body['type'])) {
            $valid_types = ['car', 'bike', 'scooter', 'suv', 'van'];
            if (!in_array($body['type'], $valid_types)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Invalid vehicle type. Allowed: " . implode(', ', $valid_types)]);
                exit;
            }
        }

        // Validate daily_rate if provided
        if (isset($body['daily_rate']) && (float) $body['daily_rate'] <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Daily rate must be a positive number"]);
            exit;
        }

        // Check plate uniqueness if changing
        if (!empty($body['plate_number'])) {
            $stmt = $pdo->prepare("SELECT id FROM vehicles WHERE plate_number = ? AND id != ?");
            $stmt->execute([trim($body['plate_number']), $id]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(["success" => false, "message" => "Another vehicle already has this plate number"]);
                exit;
            }
        }

        $allowed = ['name', 'type', 'brand', 'model', 'year', 'color', 'plate_number', 'daily_rate', 'status', 'image_url', 'description'];
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
        $sql = "UPDATE vehicles SET " . implode(', ', $fields) . " WHERE id = ?";
        $pdo->prepare($sql)->execute($values);

        echo json_encode(["success" => true, "message" => "Vehicle updated successfully"]);
        break;

    // ─── DELETE ──────────────────────────────────────────
    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Vehicle ID is required"]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id FROM vehicles WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Vehicle not found"]);
            exit;
        }

        $pdo->prepare("DELETE FROM vehicles WHERE id = ?")->execute([$id]);
        echo json_encode(["success" => true, "message" => "Vehicle deleted successfully"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
