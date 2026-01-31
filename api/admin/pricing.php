<?php
/**
 * Admin Pricing Management Endpoint
 * GET /api/admin/pricing.php - Get all pricing
 * PUT /api/admin/pricing.php - Update package or service
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../lib/Database.php';
require_once __DIR__ . '/../lib/AdminAuthService.php';
require_once __DIR__ . '/../lib/PricingService.php';

use BrasilLegalize\Api\Lib\Database;
use BrasilLegalize\Api\Lib\AdminAuthService;
use BrasilLegalize\Api\Lib\PricingService;

/**
 * Validate admin session and permissions
 */
function validateAdminAccess(string $requiredPermission): ?array
{
    // Get session from cookie or header
    $sessionId = $_COOKIE['admin_session'] ?? null;
    
    if (!$sessionId) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(.+)/', $authHeader, $matches)) {
            $sessionId = $matches[1];
        }
    }
    
    if (!$sessionId) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        return null;
    }
    
    $db = Database::getConnection();
    $authService = new AdminAuthService($db);
    
    $session = $authService->validateSession($sessionId);
    
    if (!$session) {
        http_response_code(401);
        echo json_encode(['error' => 'Session expired or invalid']);
        return null;
    }
    
    // Check permission
    if (!$authService->hasPermission($session['admin']['role'], $requiredPermission)) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied']);
        return null;
    }
    
    return $session;
}

try {
    $db = Database::getConnection();
    $pricingService = new PricingService($db);
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Require pricing.view permission
        $session = validateAdminAccess('pricing.view');
        if (!$session) exit;
        
        // Get all pricing data
        $packages = $pricingService->getAllPackages(false); // Include inactive
        $services = $pricingService->getAllServices(false); // Include inactive
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'packages' => $packages,
            'services' => $services,
        ]);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Require pricing.update permission
        $session = validateAdminAccess('pricing.update');
        if (!$session) exit;
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON input']);
            exit;
        }
        
        $type = $input['type'] ?? ''; // 'package' or 'service'
        $id = (int)($input['id'] ?? 0);
        $data = $input['data'] ?? [];
        
        if (!$type || !$id || empty($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing type, id, or data']);
            exit;
        }
        
        $adminId = $session['admin']['id'];
        $authService = new AdminAuthService($db);
        
        // Get client info for audit
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
        
        if ($type === 'package') {
            $result = $pricingService->updatePackage($id, $data, $adminId);
            
            // Log audit
            $authService->logAudit($adminId, 'update', 'pricing', $id, $ip, $userAgent, [
                'type' => 'package',
                'changes' => $data,
            ]);
            
        } elseif ($type === 'service') {
            $result = $pricingService->updateService($id, $data, $adminId);
            
            // Log audit
            $authService->logAudit($adminId, 'update', 'service_pricing', $id, $ip, $userAgent, [
                'type' => 'service',
                'changes' => $data,
            ]);
            
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid type. Use "package" or "service"']);
            exit;
        }
        
        if ($result) {
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Updated successfully']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Update failed']);
        }
        
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
    
} catch (Exception $e) {
    error_log('Admin pricing error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
