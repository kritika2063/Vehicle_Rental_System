<?php
/**
 * Admin Dashboard Statistics API
 *
 * GET /api/admin/dashboard.php
 * Returns counts and recent data for users, vehicles, bookings, payments.
 * Requires: X-Admin-Id header
 */

require_once __DIR__ . '/../middleware/admin_auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    die(json_encode(["success" => false, "message" => "Method not allowed"]));
}

// Total counts
$total_users    = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
$total_vehicles = $pdo->query("SELECT COUNT(*) FROM vehicles")->fetchColumn();
$total_bookings = $pdo->query("SELECT COUNT(*) FROM bookings")->fetchColumn();
$total_payments = $pdo->query("SELECT COUNT(*) FROM payments")->fetchColumn();

// Vehicle status breakdown
$vehicle_stats = $pdo->query("
    SELECT status, COUNT(*) as count
    FROM vehicles
    GROUP BY status
")->fetchAll();

// Booking status breakdown
$booking_stats = $pdo->query("
    SELECT status, COUNT(*) as count
    FROM bookings
    GROUP BY status
")->fetchAll();

// Payment status breakdown
$payment_stats = $pdo->query("
    SELECT status, COUNT(*) as count
    FROM payments
    GROUP BY status
")->fetchAll();

// Total revenue (completed payments)
$total_revenue = $pdo->query("
    SELECT COALESCE(SUM(amount), 0)
    FROM payments
    WHERE status = 'completed'
")->fetchColumn();

// Recent 5 bookings
$recent_bookings = $pdo->query("
    SELECT b.*, u.username as user_name, u.email as user_email, v.name as vehicle_name
    FROM bookings b
    LEFT JOIN users u ON b.user_id = u.id
    LEFT JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.created_at DESC
    LIMIT 5
")->fetchAll();

// Recent 5 payments
$recent_payments = $pdo->query("
    SELECT p.*, u.username as user_name, b.id as booking_id
    FROM payments p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN bookings b ON p.booking_id = b.id
    ORDER BY p.created_at DESC
    LIMIT 5
")->fetchAll();

echo json_encode([
    "success" => true,
    "data" => [
        "counts" => [
            "users"    => (int) $total_users,
            "vehicles" => (int) $total_vehicles,
            "bookings" => (int) $total_bookings,
            "payments" => (int) $total_payments,
        ],
        "revenue" => (float) $total_revenue,
        "vehicle_stats"  => $vehicle_stats,
        "booking_stats"  => $booking_stats,
        "payment_stats"  => $payment_stats,
        "recent_bookings" => $recent_bookings,
        "recent_payments" => $recent_payments,
    ]
]);
