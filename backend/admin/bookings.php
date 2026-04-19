<?php
require_once __DIR__ . '/admin_auth.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        $conditions = []; $params = [];
        if (!empty($_GET['status'])) { $conditions[] = "b.status = ?"; $params[] = $_GET['status']; }

        $sql = "
            SELECT b.id, b.start_date, b.end_date, b.total_price, b.status, b.created_at,
                   u.username as user_name, u.email as user_email,
                   v.name as vehicle_name
            FROM bookings b
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN vehicles v ON b.vehicle_id = v.id
        ";
        if ($conditions) $sql .= " WHERE " . implode(' AND ', $conditions);
        $sql .= " ORDER BY b.created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
        break;

    case 'PUT':
        // Admin can update booking status
        $body = json_decode(file_get_contents("php://input"), true);
        $id = $body['id'] ?? null;
        $status = $body['status'] ?? null;

        if (!$id || !$status) { http_response_code(400); echo json_encode(["success" => false, "message" => "ID and status required"]); exit; }

        $valid = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!in_array($status, $valid)) { http_response_code(400); echo json_encode(["success" => false, "message" => "Invalid status"]); exit; }

        $pdo->prepare("UPDATE bookings SET status = ? WHERE id = ?")->execute([$status, $id]);
        echo json_encode(["success" => true, "message" => "Booking updated"]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) { http_response_code(400); echo json_encode(["success" => false, "message" => "ID required"]); exit; }
        $pdo->prepare("DELETE FROM bookings WHERE id = ?")->execute([$id]);
        echo json_encode(["success" => true, "message" => "Booking deleted"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
