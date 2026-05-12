<?php
// ============================================================
//  api/bookings.php
//  GET    /api/bookings
//  POST   /api/bookings
//  PATCH  /api/bookings/:id
//  POST   /api/bookings/:id/verify-payment
// ============================================================

function handleBookings(string $method, array $segments): void {
    $db   = getDB();
    $user = requireAuth();
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    // GET /api/bookings
    if ($method === 'GET' && empty($segments)) {
        if ($user['role'] === 'admin') {
            $rows = $db->query('SELECT * FROM bookings')->fetchAll();
        } else {
            $stmt = $db->prepare('SELECT * FROM bookings WHERE userId = ?');
            $stmt->execute([$user['id']]);
            $rows = $stmt->fetchAll();
        }
        $result = array_map(fn($b) => [
            ...$b,
            'addons' => $b['addons'] ? explode(',', $b['addons']) : [],
        ], $rows);
        echo json_encode($result);
        return;
    }

    // POST /api/bookings — create booking
    if ($method === 'POST' && empty($segments)) {
        $cottageId     = (int)   ($body['cottageId']     ?? 0);
        $date          = trim(    $body['date']           ?? '');
        $addons        =          $body['addons']         ?? [];
        $total         = (int)   ($body['total']          ?? 0);
        $paymentMethod = trim(    $body['paymentMethod']  ?? '');
        $gcashRef      = trim(    $body['gcashRef']       ?? '');

        // Conflict check — only block if already CONFIRMED
        $conflict = $db->prepare('SELECT id FROM bookings WHERE cottageId = ? AND date = ? AND status = ?');
        $conflict->execute([$cottageId, $date, 'Confirmed']);
        if ($conflict->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'Cottage is already booked/confirmed for this date']);
            return;
        }

        $id = 'TRX-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 7));
        $stmt = $db->prepare('INSERT INTO bookings (id,userId,cottageId,date,addons,total,paymentMethod,gcashRef) VALUES (?,?,?,?,?,?,?,?)');
        $stmt->execute([$id, $user['id'], $cottageId, $date, implode(',', $addons), $total, $paymentMethod, $gcashRef ?: null]);
        echo json_encode(['id' => $id, 'status' => 'Pending']);
        return;
    }

    // POST /api/bookings/:id/verify-payment
    if ($method === 'POST' && count($segments) === 2 && $segments[1] === 'verify-payment') {
        $id      = $segments[0];
        $booking = $db->prepare('SELECT * FROM bookings WHERE id = ?');
        $booking->execute([$id]);
        $booking = $booking->fetch();

        if (!$booking || $booking['userId'] != $user['id']) {
            http_response_code(404);
            echo json_encode(['error' => 'Booking not found']);
            return;
        }

        // Final conflict check before confirming
        $conflict = $db->prepare('SELECT id FROM bookings WHERE cottageId = ? AND date = ? AND status = ? AND id != ?');
        $conflict->execute([$booking['cottageId'], $booking['date'], 'Confirmed', $id]);
        if ($conflict->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'Sorry, this cottage was just confirmed by someone else. Please contact support for a refund.']);
            return;
        }

        $db->prepare('UPDATE bookings SET status = ? WHERE id = ?')->execute(['Confirmed', $id]);
        echo json_encode(['success' => true, 'status' => 'Confirmed']);
        return;
    }

    // PATCH /api/bookings/:id — update status
    if ($method === 'PATCH' && count($segments) === 1) {
        $id     = $segments[0];
        $status = trim($body['status'] ?? '');

        $booking = $db->prepare('SELECT * FROM bookings WHERE id = ?');
        $booking->execute([$id]);
        $booking = $booking->fetch();

        if (!$booking) {
            http_response_code(404);
            echo json_encode(['error' => 'Booking not found']);
            return;
        }

        // Admin can change to anything; customer can only cancel their own
        if ($user['role'] === 'admin') {
            $db->prepare('UPDATE bookings SET status = ? WHERE id = ?')->execute([$status, $id]);
            echo json_encode(['success' => true, 'message' => "Status updated to {$status}"]);
            return;
        }

        if ($booking['userId'] == $user['id'] && $status === 'Cancelled') {
            $db->prepare('UPDATE bookings SET status = ? WHERE id = ?')->execute(['Cancelled', $id]);
            echo json_encode(['success' => true, 'message' => 'Booking cancelled']);
            return;
        }

        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized status change']);
        return;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Booking route not found']);
}
