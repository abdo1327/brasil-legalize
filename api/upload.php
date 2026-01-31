<?php
require_once __DIR__ . '/bootstrap.php';

$token = $_POST['token'] ?? '';
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
$clientId = $record['clientId'] ?? 'unknown';

// New folder structure: storage/clients/{client_id}/cases/{case_id}/
$clientDir = __DIR__ . '/../storage/clients/' . $clientId;
$caseDir = $clientDir . '/cases/' . $caseId;

// Create directory structure if not exists
if (!is_dir($clientDir)) {
  mkdir($clientDir, 0755, true);
}
if (!is_dir($caseDir)) {
  mkdir($caseDir, 0755, true);
}

$maxFileSize = 25 * 1024 * 1024;
$allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
// F4 Fix: Add MIME type validation
$allowedMimes = [
  'pdf' => 'application/pdf',
  'jpg' => 'image/jpeg',
  'jpeg' => 'image/jpeg',
  'png' => 'image/png',
  'webp' => 'image/webp'
];

$files = $_FILES['files'] ?? null;
if (!$files) {
  respond(400, ['message' => 'No files uploaded']);
}

$uploadedFiles = [];

for ($i = 0; $i < count($files['name']); $i++) {
  $name = basename($files['name'][$i]);
  $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
  
  // Check extension
  if (!in_array($ext, $allowedExtensions, true)) {
    respond(400, ['message' => 'Invalid file type: ' . $ext]);
  }
  
  // F4 Fix: Validate MIME type using finfo
  $finfo = finfo_open(FILEINFO_MIME_TYPE);
  $detectedMime = finfo_file($finfo, $files['tmp_name'][$i]);
  finfo_close($finfo);
  
  $expectedMime = $allowedMimes[$ext];
  if ($detectedMime !== $expectedMime) {
    audit_log('upload_mime_mismatch', [
      'caseId' => $caseId,
      'clientId' => $clientId,
      'file' => $name,
      'expected' => $expectedMime,
      'detected' => $detectedMime
    ]);
    respond(400, ['message' => 'File content does not match extension']);
  }
  
  if ($files['size'][$i] > $maxFileSize) {
    respond(400, ['message' => 'File too large (max 25MB)']);
  }
  
  // Generate unique filename to prevent overwrites
  $safeName = time() . '_' . bin2hex(random_bytes(4)) . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $name);
  $filePath = $caseDir . '/' . $safeName;
  
  if (move_uploaded_file($files['tmp_name'][$i], $filePath)) {
    $uploadedFiles[] = [
      'originalName' => $name,
      'storedName' => $safeName,
      'size' => $files['size'][$i],
      'mimeType' => $detectedMime,
      'path' => $filePath
    ];
    
    audit_log('file_uploaded', [
      'caseId' => $caseId, 
      'clientId' => $clientId,
      'file' => $safeName,
      'originalName' => $name,
      'size' => $files['size'][$i]
    ]);
  }
}

respond(200, [
  'message' => 'Files uploaded successfully',
  'files' => $uploadedFiles,
  'count' => count($uploadedFiles)
]);
