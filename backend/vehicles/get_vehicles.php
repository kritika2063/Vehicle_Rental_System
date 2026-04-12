<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . '/../config/db.php';

$stmt = $pdo->query("SELECT * FROM vehicles WHERE available = 1 ORDER BY type, price_per_day");
$vehicles = $stmt->fetchAll();

echo json_encode(["success" => true, "vehicles" => $vehicles]);
