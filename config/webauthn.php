<?php

return [
    'rp' => [
        'name' => env('WEBAUTHN_RP_NAME', 'Laravel WebAuthn'),
        'id' => env('WEBAUTHN_RP_ID', 'localhost'),
    ],
    'timeout' => env('WEBAUTHN_TIMEOUT', 60_000),
];
