<?php
require_once __DIR__ . '/bootstrap.php';

$body = get_json_body();

// F3 Fix: Validate required fields to prevent empty spam submissions
$name = trim($body['name'] ?? '');
$contact = trim($body['contact'] ?? '');
$consent = $body['consent'] ?? false;

if (empty($name) || strlen($name) < 2) {
  respond(400, ['message' => 'Name is required']);
}
if (empty($contact) || strlen($contact) < 5) {
  respond(400, ['message' => 'Valid contact information is required']);
}
if (!$consent) {
  respond(400, ['message' => 'Consent is required']);
}

// F3 Fix: Honeypot field check (frontend should include hidden field 'website' that must be empty)
if (!empty($body['website'])) {
  // Bot detected - silently accept but don't store
  respond(200, ['message' => 'Lead captured', 'leadId' => 'honeypot_' . uniqid()]);
}

// F3 Fix: Rate limit per contact (max 3 submissions per hour per contact)
$recentLeads = read_json('leads.json', []);
$oneHourAgo = time() - 3600;
$contactSubmissions = array_filter($recentLeads, function($l) use ($contact, $oneHourAgo) {
  return $l['contact'] === $contact && strtotime($l['consentTimestamp']) > $oneHourAgo;
});
if (count($contactSubmissions) >= 3) {
  respond(429, ['message' => 'Too many submissions. Please try again later.']);
}

$leads = $recentLeads;

$lead = [
  'id' => uniqid('lead_', true),
  'name' => $name,
  'contact' => $contact,
  'country' => $body['country'] ?? '',
  'serviceType' => $body['serviceType'] ?? '',
  'consent' => true,
  'consentVersion' => $body['consentVersion'] ?? 'v1',
  'consentTimestamp' => gmdate('c'),
  'ip' => $_SERVER['REMOTE_ADDR'] ?? null
];

$leads[] = $lead;
write_json('leads.json', $leads);

audit_log('lead_created', ['leadId' => $lead['id']]);
respond(200, ['message' => 'Lead captured', 'leadId' => $lead['id']]);
