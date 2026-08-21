<?php
/**
 * SmartFeed - TriPay Webhook & Callback Handler
 * Endpoint: POST /tripay-callback.php atau /webhook.php
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/tripay-config.php';

// Ambil raw payload & headers
$rawPayload = file_get_contents('php://input');
$signatureHeader = $_SERVER['HTTP_X_CALLBACK_SIGNATURE'] ?? '';
$eventHeader = $_SERVER['HTTP_X_CALLBACK_EVENT'] ?? '';

if (empty($rawPayload)) {
    echo json_encode([
        'success' => true,
        'message' => 'TriPay callback listener is active and ready.'
    ]);
    exit;
}

// Validasi Signature Resmi TriPay
$expectedSignature = hash_hmac('sha256', $rawPayload, TRIPAY_PRIVATE_KEY);

if (!hash_equals($expectedSignature, $signatureHeader)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid callback signature'
    ]);
    exit;
}

$data = json_decode($rawPayload, true);

if ($eventHeader === 'payment_status') {
    $status = strtoupper($data['status'] ?? '');
    
    if ($status === 'PAID') {
        // Teruskan data pembeli ke Google Spreadsheet Webhook untuk aktivasi otomatis
        $forwardPayload = json_encode([
            'event'          => 'tripay_payment_success',
            'merchant_ref'   => $data['merchant_ref'] ?? '',
            'reference'      => $data['reference'] ?? '',
            'name'           => $data['customer_name'] ?? '',
            'email'          => $data['customer_email'] ?? '',
            'phone'          => $data['customer_phone'] ?? '',
            'amount'         => $data['total_amount'] ?? $data['amount'] ?? 0,
            'payment_method' => $data['payment_method'] ?? $data['payment_name'] ?? '',
            'paid_at'        => $data['paid_at'] ?? time(),
            'raw'            => $data
        ]);

        $ch = curl_init(GOOGLE_SCRIPT_WEBHOOK);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $forwardPayload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($forwardPayload)
        ]);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        
        $result = curl_exec($ch);
        curl_close($ch);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Payment status callback processed successfully'
    ]);
    exit;
}

// Untuk event lainnya
echo json_encode([
    'success' => true,
    'message' => 'Event acknowledged'
]);
