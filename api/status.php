<?php
require_once __DIR__ . '/bootstrap.php';

$token = $_GET['token'] ?? '';
$tokens = read_json('tokens.json', []);
$record = null;
foreach ($tokens as $item) {
  if ($item['token'] === $token) {
    $record = $item;
    break;
  }
}

if (!$record) {
  respond(403, ['message' => 'Invalid token']);
}

if ($record['expiresAt'] < time()) {
  respond(403, ['message' => 'Token expired']);
}

$caseId = $record['caseId'];
$cases = read_json('cases.json', []);
$case = $cases[$caseId] ?? [
  'milestones' => ['Docs review', 'Submission', 'Government processing'],
  'nextActions' => ['Awaiting additional documents']
];

respond(200, $case);
