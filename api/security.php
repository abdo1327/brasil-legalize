<?php
// Generate CSP nonce for inline scripts/styles if needed
$CSP_NONCE = base64_encode(random_bytes(16));

function get_csp_nonce() {
  global $CSP_NONCE;
  return $CSP_NONCE;
}

function enforce_security_headers() {
  global $CSP_NONCE;
  
  header('X-Content-Type-Options: nosniff');
  header('X-Frame-Options: DENY');
  header('X-XSS-Protection: 1; mode=block');
  header('Referrer-Policy: strict-origin-when-cross-origin');
  header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
  header('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');
  
  // F5 Fix: Stricter CSP - allow Next.js domains and use nonce for any inline needs
  // Note: Next.js static export handles its own scripts; API endpoints rarely need inline
  $csp = implode('; ', [
    "default-src 'self'",
    "img-src 'self' data: https:",
    "style-src 'self' 'nonce-{$CSP_NONCE}'",
    "script-src 'self' 'nonce-{$CSP_NONCE}'",
    "connect-src 'self' https://api.calendly.com https://api.stripe.com",
    "frame-src https://calendly.com https://js.stripe.com",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'"
  ]);
  header("Content-Security-Policy: {$csp}");
}

function enforce_rate_limit() {
  $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
  $key = sys_get_temp_dir() . '/rate_' . md5($ip);
  $window = 60;
  $limit = 120;
  $data = ['count' => 0, 'start' => time()];
  if (file_exists($key)) {
    $data = json_decode(file_get_contents($key), true) ?? $data;
  }
  if (time() - $data['start'] > $window) {
    $data = ['count' => 0, 'start' => time()];
  }
  $data['count']++;
  file_put_contents($key, json_encode($data));
  if ($data['count'] > $limit) {
    http_response_code(429);
    echo json_encode(['message' => 'Rate limit exceeded']);
    exit;
  }
}
