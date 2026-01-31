<?php
require_once __DIR__ . '/bootstrap.php';

$body = get_json_body();
$tokens = read_json('tokens.json', []);

if (($body['action'] ?? '') === 'create') {
  $token = generate_token();
  $expiresAt = strtotime('+180 days');
  $record = [
    'token' => $token,
    'caseId' => $body['caseId'] ?? uniqid('case_', true),
    'expiresAt' => $expiresAt,
    'createdAt' => time()
  ];
  $tokens[] = $record;
  write_json('tokens.json', $tokens);
  audit_log('token_created', ['token' => $token, 'caseId' => $record['caseId']]);
  respond(200, ['token' => $token, 'expiresAt' => $expiresAt]);
}

if (($body['action'] ?? '') === 'extend') {
  $tokenValue = $body['token'] ?? '';
  foreach ($tokens as &$record) {
    if ($record['token'] === $tokenValue) {
      $record['expiresAt'] = strtotime('+180 days');
      write_json('tokens.json', $tokens);
      audit_log('token_extended', ['token' => $tokenValue]);
      respond(200, ['message' => 'Token extended', 'expiresAt' => $record['expiresAt']]);
    }
  }
}

respond(400, ['message' => 'Invalid action']);
