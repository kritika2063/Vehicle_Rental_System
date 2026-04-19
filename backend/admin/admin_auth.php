<?php
/**
 * Admin auth middleware — include at top of every admin endpoint.
 * Checks X-Admin-Id header and verifies admin exists in DB.
 * Sets $pdo and $admin for use in the calling file.
 */

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Admin-Id");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';

$admin_id = $_SERVER['HTTP_X_ADMIN_ID'] ?? '';

if (empty($admin_id)) {
    http_response_code(401);
    die(json_encode(["success" => false, "message" => "Unauthorized: Admin ID required"]));
}

$stmt = $pdo->prepare("SELECT id, username FROM admin WHERE id = ?");
$stmt->execute([$admin_id]);
$admin = $stmt->fetch();

if (!$admin) {
    http_response_code(401);
    die(json_encode(["success" => false, "message" => "Unauthorized: Invalid admin"]));
}
