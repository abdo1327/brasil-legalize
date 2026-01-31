<?php
/**
 * Admin Logout Endpoint
 * POST /api/admin/auth/logout.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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
    // Get session from cookie or header
    $sessionId = $_COOKIE['admin_session'] ?? null;
    
    if (!$sessionId) {
        // Try Authorization header
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(.+)/', $authHeader, $matches)) {
            $sessionId = $matches[1];
        }
    }
    
    if (!$sessionId) {
        http_response_code(401);
        echo json_encode(['error' => 'No session found']);
        exit;
    }
    
    $db = Database::getConnection();
    $authService = new AdminAuthService($db);
    
    // Validate session to get admin ID
    $session = $authService->validateSession($sessionId);
    
    if (!$session) {
        // Session already invalid, clear cookie anyway
        setcookie('admin_session', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => true,
            'secure' => isset($_SERVER['HTTPS']),
            'samesite' => 'Lax',
        ]);
        
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Already logged out']);
        exit;
    }
    
    // Get client info
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    // Logout
    $authService->logout($sessionId, $session['admin']['id'], $ip, $userAgent);
    
    // Clear cookie
    setcookie('admin_session', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'httponly' => true,
        'secure' => isset($_SERVER['HTTPS']),
        'samesite' => 'Lax',
    ]);
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    
} catch (Exception $e) {
    error_log('Admin logout error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
