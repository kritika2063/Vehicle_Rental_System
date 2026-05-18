<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(["success" => false, "message" => "Method not allowed"]));
}

require_once __DIR__ . '/../config/db.php';

$body    = json_decode(file_get_contents("php://input"), true);
$email   = trim($body['email']   ?? '');
$otp     = trim($body['otp']     ?? '');
$purpose = trim($body['purpose'] ?? 'signin');

if (empty($email) || empty($otp)) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Email and OTP required"]));
}

// ── Find valid unused unexpired OTP ──────────────────────────────────────────
$stmt = $pdo->prepare("
    SELECT * FROM otp_codes
    WHERE email = ?
    AND otp_code = ?
    AND purpose = ?
    AND is_used = 0
    AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
");
$stmt->execute([$email, $otp, $purpose]);
$record = $stmt->fetch();

if (!$record) {
    http_response_code(401);
    die(json_encode([
        "success" => false,
        "message" => "Invalid or expired OTP. Please request a new one."
    ]));
}

// ── Mark OTP as used ─────────────────────────────────────────────────────────
$pdo->prepare("UPDATE otp_codes SET is_used = 1 WHERE id = ?")
    ->execute([$record['id']]);

echo json_encode([
    "success" => true,
    "message" => "OTP verified successfully.",
    "email"   => $email,
    "purpose" => $purpose
]);