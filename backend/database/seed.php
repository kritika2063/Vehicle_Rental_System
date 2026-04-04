<?php

require_once __DIR__ . '/../config/db.php';

$username = "admin";
$plainPassword = "Admin@VRS2026";
$hashedPassword = password_hash($plainPassword, PASSWORD_BCRYPT);

$stmt = $pdo->prepare(
   "INSERT IGNORE INTO admin (username, password) VALUES (?, ?)"
);
$stmt->execute([$username, $hashedPassword]);

echo "ADMIN account created successfully.\n";
