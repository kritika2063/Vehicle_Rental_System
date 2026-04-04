<?php
$host = "localhost";
$dbname = "vehicle_rental";
$dbuser = "root";
$dbpass = "root";

try {
    $pdo = new PDO(
      "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
      $dbuser,
      $dbpass
    );
   $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        "success" => false,
        "message" => "Connection failed"
  ]));
}
