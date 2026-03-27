<?php

return [
    'merchant_id' => env('PAYTR_MERCHANT_ID', ''),
    'merchant_key' => env('PAYTR_MERCHANT_KEY', ''),
    'merchant_salt' => env('PAYTR_MERCHANT_SALT', ''),
    'test_mode' => env('PAYTR_TEST_MODE', 1),
    'debug_on' => env('PAYTR_DEBUG_ON', 1),
    'timeout_limit' => env('PAYTR_TIMEOUT_LIMIT', 30),
    'no_installment' => env('PAYTR_NO_INSTALLMENT', 0),
    'max_installment' => env('PAYTR_MAX_INSTALLMENT', 0),
    'ok_url' => env('PAYTR_OK_URL', 'http://localhost:3000/odeme/basarili'),
    'fail_url' => env('PAYTR_FAIL_URL', 'http://localhost:3000/odeme/basarisiz'),
    'base_url' => 'https://www.paytr.com',
];
