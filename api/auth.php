<?php
require_once __DIR__ . '/bootstrap.php';

session_start();

$body = get_json_body();
$email = $body['email'] ?? '';
$password = $body['password'] ?? '';

// REQUIRED: Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH environment variables
// Generate hash with: php -r "echo password_hash('your_password', PASSWORD_ARGON2ID);"
$adminEmail = getenv('ADMIN_EMAIL');
$adminPasswordHash = getenv('ADMIN_PASSWORD_HASH');

if (!$adminEmail || !$adminPasswordHash) {
  error_log('SECURITY: Admin credentials not configured in environment variables');
  respond(500, ['message' => 'Server configuration error']);
}

if ($email === $adminEmail && password_verify($password, $adminPasswordHash)) {
  // Generate secure session token
  $sessionToken = bin2hex(random_bytes(32));
  $_SESSION['admin_authenticated'] = true;
  $_SESSION['admin_email'] = $email;
  $_SESSION['admin_token'] = $sessionToken;
  $_SESSION['admin_login_time'] = time();
  
  audit_log('admin_login', ['email' => $email]);
  respond(200, [
    'message' => 'Login success',
    'token' => $sessionToken
  ]);
}

audit_log('admin_login_failed', ['email' => $email]);
respond(401, ['message' => 'Invalid credentials']);
