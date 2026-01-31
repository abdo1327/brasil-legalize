<?php
require_once __DIR__ . '/bootstrap.php';

session_start();
require_admin_auth();

$log = read_json('audit.json', []);
respond(200, ['items' => $log]);
