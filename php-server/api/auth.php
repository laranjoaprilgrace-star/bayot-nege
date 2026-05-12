<?php
// ============================================================
//  api/auth.php — POST /api/auth/login  |  POST /api/auth/register
// ============================================================

function handleAuth(string $method, string $action): void {
    $db   = getDB();
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    // POST /api/auth/login
    if ($method === 'POST' && $action === 'login') {
        $email    = trim($body['email']    ?? '');
        $password = trim($body['password'] ?? '');

        $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
            return;
        }

        $passMatches = password_verify($password, $user['password']);

        if (!$passMatches) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
            return;
        }

        if ($user['role'] === 'customer' && $user['status'] === 'pending') {
            http_response_code(403);
            echo json_encode(['error' => 'PENDING_APPROVAL']);
            return;
        }

        if ($user['role'] === 'customer' && $user['status'] === 'rejected') {
            http_response_code(403);
            echo json_encode(['error' => 'ACCOUNT_REJECTED']);
            return;
        }

        $token = jwtEncode([
            'id'     => $user['id'],
            'email'  => $user['email'],
            'role'   => $user['role'],
            'status' => $user['status'],
        ]);

        unset($user['password']);
        echo json_encode(['token' => $token, 'user' => $user]);
        return;
    }

    // POST /api/auth/register
    if ($method === 'POST' && $action === 'register') {
        $name     = trim($body['name']     ?? '');
        $email    = trim($body['email']    ?? '');
        $password = trim($body['password'] ?? '');
        $phone    = trim($body['phone']    ?? '');
        $birthday = trim($body['birthday'] ?? '');
        $address  = trim($body['address']  ?? '');
        $avatar   = trim($body['avatar']   ?? "https://i.pravatar.cc/150?u={$name}");
        $idPhoto  = trim($body['id_photo'] ?? '');

        $hash = password_hash($password, PASSWORD_BCRYPT);

        try {
            $stmt = $db->prepare('INSERT INTO users (name,email,password,phone,birthday,address,status,avatar,id_photo) VALUES (?,?,?,?,?,?,?,?,?)');
            $stmt->execute([$name, $email, $hash, $phone, $birthday, $address, 'pending', $avatar, $idPhoto]);
            echo json_encode(['message' => 'Registration successful. Pending approval.']);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        return;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Auth route not found']);
}
