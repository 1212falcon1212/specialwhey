<?php

$secret = getenv('DEPLOY_WEBHOOK_SECRET') ?: trim(file_get_contents('/var/www/.deploy-secret'));
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';

$expected = 'sha256='.hash_hmac('sha256', $payload, $secret);
if (! hash_equals($expected, $signature)) {
    http_response_code(403);
    exit('Invalid signature');
}

$data = json_decode($payload, true);
if (($data['ref'] ?? '') !== 'refs/heads/main') {
    echo 'Not main branch, skipping';
    exit;
}

exec('nohup bash /var/www/promix/deploy.sh >> /var/log/promix-deploy.log 2>&1 &');
echo 'Deploy triggered';
