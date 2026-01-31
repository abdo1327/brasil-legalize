<?php
/**
 * Public Pricing Endpoint
 * GET /api/pricing.php?locale=en - Get pricing for public display
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/lib/Database.php';
require_once __DIR__ . '/lib/PricingService.php';

use BrasilLegalize\Api\Lib\Database;
use BrasilLegalize\Api\Lib\PricingService;

try {
    $locale = $_GET['locale'] ?? 'en';
    $validLocales = ['en', 'ar', 'es', 'pt'];
    
    if (!in_array($locale, $validLocales)) {
        $locale = 'en';
    }
    
    $db = Database::getConnection();
    $pricingService = new PricingService($db);
    
    $pricing = $pricingService->getPublicPricing($locale);
    
    // Cache for 5 minutes
    header('Cache-Control: public, max-age=300');
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'locale' => $locale,
        'data' => $pricing,
    ]);
    
} catch (Exception $e) {
    error_log('Public pricing error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
