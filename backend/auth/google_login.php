<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(["success" => false, "message" => "Method not allowed"]));
}

$raw  = file_get_contents("php://input");
$body = json_decode($raw, true);

if (!$body) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Invalid JSON body", "raw" => $raw]));
}

$google_id      = trim($body['sub']          ?? '');
$email          = trim($body['email']        ?? '');
$username       = trim($body['name']         ?? '');
$given_name     = trim($body['given_name']   ?? '');
$family_name    = trim($body['family_name']  ?? '');
$picture        = trim($body['picture']      ?? '');
$email_verified = !empty($body['email_verified']) ? 1 : 0;

if (empty($google_id) || empty($email)) {
    http_response_code(400);
    die(json_encode([
        "success" => false,
        "message" => "Missing google_id or email",
        "received_keys" => array_keys($body)
    ]));
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE google_id = ?");
    $stmt->execute([$google_id]);
    $existing = $stmt->fetch();

    if ($existing) {
        $pdo->prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP, picture = ? WHERE google_id = ?")
            ->execute([$picture, $google_id]);
        $is_new = false;
        $message = "Welcome back, {$existing['given_name']}!";
    } else {
        $pdo->prepare("
            INSERT INTO users (google_id, email, username, given_name, family_name, picture, email_verified)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ")->execute([$google_id, $email, $username, $given_name, $family_name, $picture, $email_verified]);
        $is_new = true;
        $message = "Account created. Welcome, {$given_name}!";
    }

    echo json_encode([
        "success"     => true,
        "is_new_user" => $is_new,
        "message"     => $message,
        "user" => [
            "google_id"  => $google_id,
            "email"      => $email,
            "username"   => $username,
            "given_name" => $given_name,
            "picture"    => $picture,
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
