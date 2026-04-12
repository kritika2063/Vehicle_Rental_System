<?php
/**
 * Admin Authentication Middleware
 *
 * Include this file at the top of any admin-only endpoint.
 * It checks for a valid admin ID in the X-Admin-Id header,
 * verifies the admin exists in the database, and sets $admin.
 */

require_once __DIR__ . '/../config/db.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Admin-Id");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check for admin header
$admin_id = $_SERVER['HTTP_X_ADMIN_ID'] ?? '';

if (empty($admin_id)) {
    http_response_code(401);
    die(json_encode([
        "success" => false,
        "message" => "Unauthorized: Admin authentication required"
    ]));
}

// Verify admin exists in database
$stmt = $pdo->prepare("SELECT id, username FROM admin WHERE id = ?");
$stmt->execute([$admin_id]);
$admin = $stmt->fetch();

if (!$admin) {
    http_response_code(401);
    die(json_encode([
        "success" => false,
        "message" => "Unauthorized: Invalid admin credentials"
    ]));
}
