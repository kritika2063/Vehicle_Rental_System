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
$purpose = trim($body['purpose'] ?? 'signin');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Valid email required"]));
}

$allowed_purposes = ['signin', 'signup', 'forgot'];
if (!in_array($purpose, $allowed_purposes)) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Invalid purpose"]));
}

// ── Rate limit: max 3 OTPs per 10 minutes per email ──────────────────────────
$stmt = $pdo->prepare("
    SELECT COUNT(*) as total 
    FROM otp_codes 
    WHERE email = ? 
    AND created_at >= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
");
$stmt->execute([$email]);
$row = $stmt->fetch();

if ((int)$row['total'] >= 3) {
    http_response_code(429);
    die(json_encode([
        "success" => false,
        "message" => "Too many OTP requests. Please wait 10 minutes before trying again."
    ]));
}

// ── Generate 6-digit OTP ──────────────────────────────────────────────────────
$otp        = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
$expires_at = date('Y-m-d H:i:s', strtotime('+10 minutes'));

// ── Store OTP ─────────────────────────────────────────────────────────────────
$pdo->prepare("
    INSERT INTO otp_codes (email, otp_code, purpose, expires_at)
    VALUES (?, ?, ?, ?)
")->execute([$email, $otp, $purpose, $expires_at]);

// ── Send OTP (log to file as fallback for local dev) ─────────────────────────
$log_dir  = __DIR__ . '/../../logs';
if (!is_dir($log_dir)) mkdir($log_dir, 0755, true);
file_put_contents(
    $log_dir . '/otp.log',
    date('Y-m-d H:i:s') . " | $email | $purpose | OTP: $otp\n",
    FILE_APPEND
);

// Try sending email
$subject = "Your Mero Gadi OTP Code";
$message = "Your OTP code is: $otp\n\nThis code expires in 10 minutes.\nDo not share this code with anyone.";
$headers = "From: noreply@merogadi.com\r\nContent-Type: text/plain; charset=UTF-8";
@mail($email, $subject, $message, $headers);

echo json_encode([
    "success" => true,
    "message" => "OTP sent to $email. Valid for 10 minutes.",
    "debug_otp" => $otp  // REMOVE THIS IN PRODUCTION
]);