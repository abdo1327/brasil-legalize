<?php
/**
 * F7 Fix: Status index endpoint
 * Returns API health status and available endpoints.
 */

require_once __DIR__ . '/bootstrap.php';

$endpoints = [
  'POST /api/auth.php' => 'Admin authentication',
  'POST /api/leads.php' => 'Lead capture (public)',
  'POST /api/tokens.php' => 'Generate upload token (admin)',
  'POST /api/upload.php' => 'File upload (token required)',
  'GET /api/status.php?token=xxx' => 'Check case status (token required)',
  'GET /api/cases.php' => 'List all cases (admin)',
  'POST /api/templates.php' => 'Save email template (admin)',
  'GET /api/audit.php' => 'View audit log (admin)'
];

respond(200, [
  'status' => 'healthy',
  'version' => '1.0.0',
  'timestamp' => gmdate('c'),
  'endpoints' => $endpoints
]);
