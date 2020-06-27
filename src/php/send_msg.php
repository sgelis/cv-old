<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendors/PHPMailer/Exception.php';
require 'vendors/PHPMailer/PHPMailer.php';
require 'vendors/PHPMailer/SMTP.php';

include 'config.php';


function sanitize_vars() {
    $csrf_token = filter_input(INPUT_POST, 'csrfToken', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $name = filter_input(INPUT_POST, 'who', FILTER_SANITIZE_STRING);
    $mail_address = filter_input(INPUT_POST, 'mail', FILTER_SANITIZE_EMAIL);
    $msg = filter_input(INPUT_POST, 'msg', FILTER_SANITIZE_STRING);

    $sanitized_vars = [
        'csrf_token' => $csrf_token,
        'name' => $name,
        'mail_address' => $mail_address,
        'msg' => $msg
    ];

    return $sanitized_vars;
}

function token_is_ok($candidate)
{
    if (!session_id()) {
        session_start();
    }

    // Encrypt session ID exactly like it was done by the csrf_token.php script,
    // and compare with token (= session ID hash) given by user.
    $session_id = session_id();
    $method = 'AES-256-CBC';
    $key_hash = hash('sha256', SECRET_KEY);
    $token = openssl_encrypt($session_id . SALT, $method, $key_hash);

    return $token === $candidate;
}

function send_mail($name, $mail, $msg) {
    $msg_heading = <<<EOD
Hey,

Looks like $name ($mail) left a message for you using the contact form on your online resume!

-----


EOD;

    $full_msg = $msg_heading . $msg;

    $mail = new PHPMailer(true);
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Host = MAIL_HOST;
    $mail->Port = MAIL_PORT;
    $mail->Username = MAIL_USERNAME;
    $mail->Password = MAIL_PASSWORD;

    $mail->CharSet = 'UTF-8';
    $mail->setFrom(MAIL_FROM, 'Your online resume');
    $mail->AddAddress(MAIL_TO);

    $mail->isHTML(false);
    $mail->Subject = 'Message from online resume!';
    $mail->Body = $full_msg;

    $ret = false;
    try {
        $ret = $mail->Send();
    } catch (Exception $e) {
        $ret = false; 
    }

    return $ret;
}

function main() {
    $post_vars = sanitize_vars();

    if (!$post_vars['name'] || !$post_vars['mail_address'] || !$post_vars['msg']) {
        header('HTTP/1.1 422 Unprocessable Entity');
        die();
    }
    if (!token_is_ok($post_vars['csrf_token'])) {
        header('HTTP/1.1 403 Forbidden');
        die();
    }

    echo send_mail($post_vars['name'], $post_vars['mail_address'], $post_vars['msg']);
}

main();
die();
