<?php

include 'config.php';


function generate_token()
{
    if (!session_id()) {
        session_start();
    }

    $session_id = session_id();
    $method = 'AES-256-CBC';
    $key_hash = hash('sha256', SECRET_KEY);
    $token = openssl_encrypt($session_id . SALT, $method, $key_hash);

    return $token;
}

echo generate_token();
die();
