<?php
require_once __DIR__ . '/bootstrap.php';

$body = get_json_body();

// TODO: Implement Resend API integration.

respond(200, ['message' => 'Notification queued']);
