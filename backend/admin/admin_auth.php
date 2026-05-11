<?php
/**
<<<<<<< HEAD
 * Admin Authentication Middleware
 *
 * Include this file at the top of any admin-only endpoint.
 * It checks for a valid admin ID in the X-Admin-Id header,
 * verifies the admin exists in the database, and sets $admin.
 */

require_once __DIR__ . '/../config/db.php';

=======
 * Admin auth middleware — include at top of every admin endpoint.
 * Checks X-Admin-Id header and verifies admin exists in DB.
 * Sets $pdo and $admin for use in the calling file.
 */

>>>>>>> e22d01df274e8c916f164f497ff063cc0fecb21d
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Admin-Id");

<<<<<<< HEAD
// Handle preflight OPTIONS requests
=======
>>>>>>> e22d01df274e8c916f164f497ff063cc0fecb21d
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

<<<<<<< HEAD
// Check for admin header
=======
require_once __DIR__ . '/../config/db.php';

>>>>>>> e22d01df274e8c916f164f497ff063cc0fecb21d
$admin_id = $_SERVER['HTTP_X_ADMIN_ID'] ?? '';

if (empty($admin_id)) {
    http_response_code(401);
<<<<<<< HEAD
    die(json_encode([
        "success" => false,
        "message" => "Unauthorized: Admin authentication required"
    ]));
}

// Verify admin exists in database
=======
    die(json_encode(["success" => false, "message" => "Unauthorized: Admin ID required"]));
}

>>>>>>> e22d01df274e8c916f164f497ff063cc0fecb21d
$stmt = $pdo->prepare("SELECT id, username FROM admin WHERE id = ?");
$stmt->execute([$admin_id]);
$admin = $stmt->fetch();

if (!$admin) {
    http_response_code(401);
<<<<<<< HEAD
    die(json_encode([
        "success" => false,
        "message" => "Unauthorized: Invalid admin credentials"
    ]));
=======
    die(json_encode(["success" => false, "message" => "Unauthorized: Invalid admin"]));
>>>>>>> e22d01df274e8c916f164f497ff063cc0fecb21d
}
