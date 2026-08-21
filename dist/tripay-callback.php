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

// Log incoming callback untuk audit
$logFile = __DIR__ . '/tripay-log.txt';
$timestamp = date('Y-m-d H:i:s');

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
    @file_put_contents($logFile, "[$timestamp] [ERROR] Invalid Signature. Header: $signatureHeader\n", FILE_APPEND);
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
        $merchantRef   = $data['merchant_ref'] ?? '';
        $reference     = $data['reference'] ?? '';
        $amount        = $data['total_amount'] ?? $data['amount'] ?? 0;
        $paymentMethod = $data['payment_method'] ?? $data['payment_name'] ?? 'TriPay';

        $customerEmail = trim($data['customer_email'] ?? '');
        $customerName  = trim($data['customer_name'] ?? '');
        $customerPhone = trim($data['customer_phone'] ?? '');

        // JIKA TRIPAY TIDAK MENYERTAKAN EMAIL (MISAL QRIS), AMBIL DARI DATA ORDER LOKAL
        if (empty($customerEmail) && !empty($merchantRef)) {
            $trxFile = __DIR__ . '/data_trx/' . $merchantRef . '.json';
            if (file_exists($trxFile)) {
                $cached = json_decode(file_get_contents($trxFile), true);
                if ($cached) {
                    $customerEmail = trim($cached['customer_email'] ?? '');
                    $customerName  = trim($cached['customer_name'] ?? '');
                    $customerPhone = trim($cached['customer_phone'] ?? '');
                }
            }
        }

        // 1. Kirim via POST dengan CURLOPT_POSTREDIR untuk menangani 302 redirect Google Apps Script
        $forwardPayload = json_encode([
            'event'          => 'tripay_payment_success',
            'merchant_ref'   => $merchantRef,
            'reference'      => $reference,
            'name'           => $customerName,
            'email'          => $customerEmail,
            'phone'          => $customerPhone,
            'amount'         => $amount,
            'payment_method' => $paymentMethod,
            'status'         => 'PAID',
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
        if (defined('CURLOPT_POSTREDIR')) {
            curl_setopt($ch, CURLOPT_POSTREDIR, 3); // Preserve POST on 301 & 302 redirects
        }
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        // 2. Secondary Safety Net: Fallback via GET jika POST terhalang redirect
        $queryParams = http_build_query([
            'event'          => 'tripay_payment_success',
            'merchant_ref'   => $merchantRef,
            'reference'      => $reference,
            'name'           => $customerName,
            'email'          => $customerEmail,
            'phone'          => $customerPhone,
            'amount'         => $amount,
            'payment_method' => $paymentMethod,
            'status'         => 'PAID'
        ]);

        $fallbackUrl = GOOGLE_SCRIPT_WEBHOOK . (strpos(GOOGLE_SCRIPT_WEBHOOK, '?') !== false ? '&' : '?') . $queryParams;
        $chFallback = curl_init($fallbackUrl);
        curl_setopt($chFallback, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($chFallback, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($chFallback, CURLOPT_TIMEOUT, 15);
        curl_setopt($chFallback, CURLOPT_SSL_VERIFYPEER, true);
        $fallbackResult = curl_exec($chFallback);
        curl_close($chFallback);

        @file_put_contents($logFile, "[$timestamp] [SUCCESS PAID] Ref: $merchantRef | Email: $customerEmail | POST Result (HTTP $httpCode): $result | Fallback: $fallbackResult\n", FILE_APPEND);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Payment status callback processed successfully'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Event acknowledged'
]);
