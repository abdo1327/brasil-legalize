<?php
require_once __DIR__ . '/security.php';

header('Content-Type: application/json');

enforce_security_headers();

enforce_rate_limit();

function storage_path($file) {
  return __DIR__ . '/../storage/data/' . $file;
}

function read_json($file, $default = []) {
  $path = storage_path($file);
  if (!file_exists($path)) {
    return $default;
  }
  $content = file_get_contents($path);
  $data = json_decode($content, true);
  return $data === null ? $default : $data;
}

function write_json($file, $data) {
  $path = storage_path($file);
  if (!is_dir(dirname($path))) {
    mkdir(dirname($path), 0755, true);
  }
  file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT));
}

function get_json_body() {
  $raw = file_get_contents('php://input');
  return json_decode($raw, true) ?? [];
}

function respond($status, $payload) {
  http_response_code($status);
  echo json_encode($payload);
  exit;
}

function generate_token($length = 48) {
  return bin2hex(random_bytes($length / 2));
}

function audit_log($event, $data = []) {
  $log = read_json('audit.json', []);
  $log[] = [
    'event' => $event,
    'data' => $data,
    'timestamp' => gmdate('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? null
  ];
  write_json('audit.json', $log);
}

/**
 * F2 Fix: Require admin authentication for protected endpoints.
 * Call session_start() before this function.
 */
function require_admin_auth() {
  // Check session-based auth
  if (empty($_SESSION['admin_authenticated']) || $_SESSION['admin_authenticated'] !== true) {
    // Also check Authorization header for API token
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
      $providedToken = $matches[1];
      // Validate against session token (requires prior login)
      if (!empty($_SESSION['admin_token']) && hash_equals($_SESSION['admin_token'], $providedToken)) {
        return true;
      }
    }
    
    audit_log('admin_auth_failed', ['uri' => $_SERVER['REQUEST_URI'] ?? '']);
    respond(401, ['message' => 'Authentication required']);
  }
  
  // Session timeout: 2 hours
  $sessionTimeout = 7200;
  if (isset($_SESSION['admin_login_time']) && (time() - $_SESSION['admin_login_time']) > $sessionTimeout) {
    session_destroy();
    respond(401, ['message' => 'Session expired']);
  }
  
  return true;
}
