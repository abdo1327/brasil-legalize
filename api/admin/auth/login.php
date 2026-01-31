<?php
/**
 * Admin Login Endpoint
 * POST /api/admin/auth/login.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/../../lib/Database.php';
require_once __DIR__ . '/../../lib/AdminAuthService.php';

use BrasilLegalize\Api\Lib\Database;
use BrasilLegalize\Api\Lib\AdminAuthService;

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        exit;
    }
    
    // Validate required fields
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $rememberMe = (bool)($input['rememberMe'] ?? false);
    
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        exit;
    }
    
    // Get client info
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    // Attempt login
    $db = Database::getConnection();
    $authService = new AdminAuthService($db);
    $result = $authService->login($email, $password, $rememberMe, $ip, $userAgent);
    
    if ($result['success']) {
        // Set session cookie
        $expires = $rememberMe ? time() + (7 * 24 * 60 * 60) : 0;
        setcookie('admin_session', $result['session_id'], [
            'expires' => $expires,
            'path' => '/',
            'httponly' => true,
            'secure' => isset($_SERVER['HTTPS']),
            'samesite' => 'Lax',
        ]);
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'admin' => $result['admin'],
            'permissions' => $result['permissions'],
            'expiresAt' => $result['expires_at'],
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => $result['error'],
            'message' => $result['message'],
            'requiresCaptcha' => $result['requires_captcha'] ?? false,
            'lockoutMinutes' => $result['lockout_minutes'] ?? 0,
        ]);
    }
} catch (Exception $e) {
    error_log('Admin login error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
