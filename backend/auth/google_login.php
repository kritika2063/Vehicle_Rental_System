<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(["success" => false, "message" => "Method not allowed"]));
}

$body = json_decode(file_get_contents("php://input"), true);

// Fields come from jwtDecode() on the frontend
$google_id      = trim($body['sub']          ?? '');
$email          = trim($body['email']        ?? '');
$username       = trim($body['name']         ?? '');
$given_name     = trim($body['given_name']   ?? '');
$family_name    = trim($body['family_name']  ?? '');
$picture        = trim($body['picture']      ?? '');
$email_verified = !empty($body['email_verified']) ? 1 : 0;

if (empty($google_id) || empty($email)) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Invalid user data"]));
}

// Check if this user has logged in before
$stmt = $pdo->prepare("SELECT * FROM users WHERE google_id = ?");
$stmt->execute([$google_id]);
$existing_user = $stmt->fetch();

if ($existing_user) {
    // Returning user — update their last_login and picture (may have changed)
    $pdo->prepare("
        UPDATE users SET last_login = CURRENT_TIMESTAMP, picture = ?
        WHERE google_id = ?
    ")->execute([$picture, $google_id]);

    $is_new_user = false;
    $message = "Welcome back, " . $existing_user['given_name'] . "!";
} else {
    // New user — create their account
    $pdo->prepare("
        INSERT INTO users (google_id, email, username, given_name, family_name, picture, email_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ")->execute([$google_id, $email, $username, $given_name, $family_name, $picture, $email_verified]);

    $is_new_user = true;
    $message = "Account created. Welcome, " . $given_name . "!";
}

// Send back the user data so the frontend can store it
echo json_encode([
    "success"     => true,
    "is_new_user" => $is_new_user,
    "message"     => $message,
    "user" => [
        "google_id"  => $google_id,
        "email"      => $email,
        "username"   => $username,
        "given_name" => $given_name,
        "picture"    => $picture,
    ]
]);
