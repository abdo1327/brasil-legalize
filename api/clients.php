<?php
/**
 * Brasil Legalize - Client Management API
 * Handles CRUD operations for clients
 */

require_once __DIR__ . '/bootstrap.php';

// Handle CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Data file paths
$clientsFile = __DIR__ . '/../storage/data/clients.json';
$applicationsFile = __DIR__ . '/../storage/data/applications.json';
$leadsFile = __DIR__ . '/../storage/data/leads.json';

// Load data helpers
function loadJson($file) {
    if (!file_exists($file)) {
        return [];
    }
    $content = file_get_contents($file);
    return json_decode($content, true) ?: [];
}

function saveJson($file, $data) {
    $dir = dirname($file);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

// Generate unique client ID
function generateClientId() {
    $year = date('Y');
    $clients = loadJson($GLOBALS['clientsFile']);
    $count = count($clients) + 1;
    return sprintf("CLT-%s-%05d", $year, $count);
}

// Get client by ID
function getClientById($clients, $id) {
    foreach ($clients as $client) {
        if ($client['id'] === $id) {
            return $client;
        }
    }
    return null;
}

// Get client by email
function getClientByEmail($clients, $email) {
    foreach ($clients as $client) {
        if (strtolower($client['email']) === strtolower($email)) {
            return $client;
        }
    }
    return null;
}

// Get all cases for a client
function getClientCases($clientId) {
    $applications = loadJson($GLOBALS['applicationsFile']);
    $clients = loadJson($GLOBALS['clientsFile']);
    $client = getClientById($clients, $clientId);
    
    if (!$client) {
        return [];
    }
    
    $cases = [];
    foreach ($applications as $app) {
        if (in_array($app['id'], $client['cases'] ?? []) || 
            $app['email'] === $client['email'] ||
            ($app['lead_id'] ?? null) === ($client['lead_id'] ?? null)) {
            $cases[] = $app;
        }
    }
    return $cases;
}

// Get client's full profile with all related data
function getClientProfile($clientId) {
    $clients = loadJson($GLOBALS['clientsFile']);
    $client = getClientById($clients, $clientId);
    
    if (!$client) {
        return null;
    }
    
    // Get all cases
    $client['cases_data'] = getClientCases($clientId);
    
    // Get lead data if exists
    if (!empty($client['lead_id'])) {
        $leads = loadJson($GLOBALS['leadsFile']);
        foreach ($leads as $lead) {
            if ($lead['id'] === $client['lead_id']) {
                $client['lead_data'] = $lead;
                break;
            }
        }
    }
    
    return $client;
}

// Handle requests
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Get client ID from URL if present
$clientId = $_GET['id'] ?? null;
$action = $_GET['action'] ?? null;

try {
    switch ($method) {
        case 'GET':
            if ($clientId) {
                if ($action === 'profile') {
                    // Get full client profile
                    $client = getClientProfile($clientId);
                    if ($client) {
                        echo json_encode(['success' => true, 'client' => $client]);
                    } else {
                        http_response_code(404);
                        echo json_encode(['success' => false, 'error' => 'Client not found']);
                    }
                } elseif ($action === 'cases') {
                    // Get client's cases
                    $cases = getClientCases($clientId);
                    echo json_encode(['success' => true, 'cases' => $cases]);
                } else {
                    // Get basic client info
                    $clients = loadJson($clientsFile);
                    $client = getClientById($clients, $clientId);
                    if ($client) {
                        echo json_encode(['success' => true, 'client' => $client]);
                    } else {
                        http_response_code(404);
                        echo json_encode(['success' => false, 'error' => 'Client not found']);
                    }
                }
            } else {
                // List all clients with optional filters
                $clients = loadJson($clientsFile);
                
                // Apply filters
                $search = $_GET['search'] ?? null;
                $status = $_GET['status'] ?? null;
                $source = $_GET['source'] ?? null;
                $isHistorical = isset($_GET['historical']) ? $_GET['historical'] === 'true' : null;
                
                if ($search) {
                    $search = strtolower($search);
                    $clients = array_filter($clients, function($c) use ($search) {
                        return strpos(strtolower($c['name'] ?? ''), $search) !== false ||
                               strpos(strtolower($c['email'] ?? ''), $search) !== false ||
                               strpos(strtolower($c['phone'] ?? ''), $search) !== false ||
                               strpos(strtolower($c['id'] ?? ''), $search) !== false;
                    });
                }
                
                if ($source) {
                    $clients = array_filter($clients, function($c) use ($source) {
                        return ($c['source'] ?? '') === $source;
                    });
                }
                
                if ($isHistorical !== null) {
                    $clients = array_filter($clients, function($c) use ($isHistorical) {
                        return ($c['is_historical'] ?? false) === $isHistorical;
                    });
                }
                
                // Sort by created date (newest first)
                usort($clients, function($a, $b) {
                    return strtotime($b['created_at'] ?? 0) - strtotime($a['created_at'] ?? 0);
                });
                
                echo json_encode([
                    'success' => true, 
                    'clients' => array_values($clients),
                    'total' => count($clients)
                ]);
            }
            break;
            
        case 'POST':
            // Create new client (manual entry or from lead)
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
                exit;
            }
            
            // Validate required fields
            if (empty($input['name']) || empty($input['email'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Name and email are required']);
                exit;
            }
            
            $clients = loadJson($clientsFile);
            
            // Check if client with email already exists
            $existingClient = getClientByEmail($clients, $input['email']);
            if ($existingClient) {
                http_response_code(409);
                echo json_encode([
                    'success' => false, 
                    'error' => 'Client with this email already exists',
                    'existing_client_id' => $existingClient['id']
                ]);
                exit;
            }
            
            // Create new client
            $newClient = [
                'id' => generateClientId(),
                'lead_id' => $input['lead_id'] ?? null,
                'name' => $input['name'],
                'email' => $input['email'],
                'phone' => $input['phone'] ?? null,
                'whatsapp' => $input['whatsapp'] ?? $input['phone'] ?? null,
                'city' => $input['city'] ?? null,
                'country' => $input['country'] ?? null,
                'locale' => $input['locale'] ?? 'en',
                'avatar_url' => $input['avatar_url'] ?? null,
                'service_type' => $input['service_type'] ?? null,
                'package' => $input['package'] ?? null,
                'family_adults' => $input['family_adults'] ?? 2,
                'family_children' => $input['family_children'] ?? 0,
                'expected_travel_date' => $input['expected_travel_date'] ?? null,
                'expected_due_date' => $input['expected_due_date'] ?? null,
                'source' => $input['source'] ?? 'manual',
                'referral_source' => $input['referral_source'] ?? null,
                'is_historical' => $input['is_historical'] ?? false,
                'tags' => $input['tags'] ?? [],
                'financial' => [
                    'total_paid' => $input['total_paid'] ?? 0,
                    'total_due' => $input['total_due'] ?? 0,
                    'currency' => $input['currency'] ?? 'USD',
                    'payments' => $input['payments'] ?? []
                ],
                'cases' => $input['cases'] ?? [],
                'notes' => [],
                'communication' => [],
                'created_at' => date('c'),
                'updated_at' => date('c'),
                'created_by' => $input['created_by'] ?? 'admin'
            ];
            
            // Add initial note if provided
            if (!empty($input['initial_note'])) {
                $newClient['notes'][] = [
                    'id' => 'note-' . uniqid(),
                    'content' => $input['initial_note'],
                    'created_at' => date('c'),
                    'created_by' => $input['created_by'] ?? 'admin'
                ];
            }
            
            $clients[] = $newClient;
            saveJson($clientsFile, $clients);
            
            echo json_encode([
                'success' => true, 
                'client' => $newClient,
                'message' => 'Client created successfully'
            ]);
            break;
            
        case 'PUT':
        case 'PATCH':
            // Update client
            if (!$clientId) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Client ID required']);
                exit;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
                exit;
            }
            
            $clients = loadJson($clientsFile);
            $found = false;
            
            foreach ($clients as &$client) {
                if ($client['id'] === $clientId) {
                    // Handle special actions
                    if ($action === 'add-note') {
                        $client['notes'][] = [
                            'id' => 'note-' . uniqid(),
                            'content' => $input['content'],
                            'created_at' => date('c'),
                            'created_by' => $input['created_by'] ?? 'admin'
                        ];
                    } elseif ($action === 'add-communication') {
                        $client['communication'][] = [
                            'id' => 'comm-' . uniqid(),
                            'type' => $input['type'] ?? 'note',
                            'subject' => $input['subject'] ?? '',
                            'content' => $input['content'],
                            'sent_at' => date('c'),
                            'sent_by' => $input['sent_by'] ?? 'admin'
                        ];
                    } elseif ($action === 'add-payment') {
                        $payment = [
                            'id' => 'pay-' . uniqid(),
                            'amount' => $input['amount'],
                            'method' => $input['method'] ?? 'other',
                            'reference' => $input['reference'] ?? null,
                            'date' => $input['date'] ?? date('Y-m-d'),
                            'notes' => $input['notes'] ?? '',
                            'recorded_at' => date('c'),
                            'recorded_by' => $input['recorded_by'] ?? 'admin'
                        ];
                        $client['financial']['payments'][] = $payment;
                        $client['financial']['total_paid'] += floatval($input['amount']);
                    } elseif ($action === 'link-case') {
                        if (!in_array($input['case_id'], $client['cases'])) {
                            $client['cases'][] = $input['case_id'];
                        }
                    } else {
                        // Regular update - merge fields
                        $updateableFields = [
                            'name', 'email', 'phone', 'whatsapp', 'city', 'country',
                            'locale', 'avatar_url', 'service_type', 'package',
                            'family_adults', 'family_children', 'expected_travel_date',
                            'expected_due_date', 'tags', 'is_historical', 'referral_source'
                        ];
                        
                        foreach ($updateableFields as $field) {
                            if (isset($input[$field])) {
                                $client[$field] = $input[$field];
                            }
                        }
                        
                        // Update financial info if provided
                        if (isset($input['financial'])) {
                            $client['financial'] = array_merge($client['financial'], $input['financial']);
                        }
                    }
                    
                    $client['updated_at'] = date('c');
                    $found = true;
                    $updatedClient = $client;
                    break;
                }
            }
            
            if (!$found) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Client not found']);
                exit;
            }
            
            saveJson($clientsFile, $clients);
            echo json_encode(['success' => true, 'client' => $updatedClient]);
            break;
            
        case 'DELETE':
            // Delete client (soft delete - just mark as archived)
            if (!$clientId) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Client ID required']);
                exit;
            }
            
            $clients = loadJson($clientsFile);
            $found = false;
            
            foreach ($clients as &$client) {
                if ($client['id'] === $clientId) {
                    $client['archived'] = true;
                    $client['archived_at'] = date('c');
                    $found = true;
                    break;
                }
            }
            
            if (!$found) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Client not found']);
                exit;
            }
            
            saveJson($clientsFile, $clients);
            echo json_encode(['success' => true, 'message' => 'Client archived successfully']);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
