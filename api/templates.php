<?php
require_once __DIR__ . '/bootstrap.php';

session_start();
require_admin_auth();

$body = get_json_body();
$templates = read_json('templates.json', []);
$templates[] = [
  'id' => uniqid('tmpl_', true),
  'template' => $body['template'] ?? '',
  'createdAt' => gmdate('c')
];

write_json('templates.json', $templates);
respond(200, ['message' => 'Template saved']);
