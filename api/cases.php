<?php
require_once __DIR__ . '/bootstrap.php';

session_start();
require_admin_auth();

$cases = read_json('cases.json', []);
$items = array_values(array_map(function ($caseId, $case) {
  return [
    'id' => $caseId,
    'name' => $case['name'] ?? 'Case',
    'status' => $case['status'] ?? 'New'
  ];
}, array_keys($cases), $cases));

respond(200, ['items' => $items]);
