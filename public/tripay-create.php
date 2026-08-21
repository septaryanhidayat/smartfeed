<?php
/**
 * SmartFeed - TriPay Create Transaction API Handler
 * Endpoint: POST /tripay-create.php
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/tripay-config.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON input data'
    ]);
    exit;
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$method = trim($data['method'] ?? 'QRIS');
$plan = trim($data['plan'] ?? 'lifetime');

if (empty($name) || empty($email) || empty($phone)) {
    echo json_encode([
        'success' => false,
        'message' => 'Nama, email, dan nomor WhatsApp wajib diisi.'
    ]);
    exit;
}

// Normalisasi phone format (misal 0812 -> 0812)
$phone = preg_replace('/[^0-9]/', '', $phone);
if (substr($phone, 0, 2) === '62') {
    $phone = '0' . substr($phone, 2);
}

// Fungsi membaca nominal harga secara otomatis dari config.js
function getSmartFeedAmount($plan = 'lifetime') {
    if ($plan === 'reseller') {
        $configFile = __DIR__ . '/config.js';
        if (file_exists($configFile)) {
            $js = file_get_contents($configFile);
            if (preg_match('/resellerPrice\s*:\s*["\']([0-9.]+)["\']/', $js, $matches)) {
                $cleaned = (int)str_replace('.', '', $matches[1]);
                if ($cleaned > 0) return $cleaned;
            }
        }
        return 290000;
    }

    $configFile = __DIR__ . '/config.js';
    if (file_exists($configFile)) {
        $js = file_get_contents($configFile);
        if (preg_match('/price\s*:\s*["\']([0-9.]+)["\']/', $js, $matches)) {
            $cleaned = (int)str_replace('.', '', $matches[1]);
            if ($cleaned > 0) return $cleaned;
        }
    }
    return 1000;
}

$amount = getSmartFeedAmount($plan);
$productName = ($plan === 'reseller') 
    ? 'SmartFeed AI Studio + Lisensi Reseller 100% Profit' 
    : 'SmartFeed AI Studio (Lifetime Access - 20 Engine Kreatif)';

$merchantRef = 'SF-' . time() . '-' . rand(100, 999);
$signature = hash_hmac('sha256', TRIPAY_MERCHANT_CODE . $merchantRef . $amount, TRIPAY_PRIVATE_KEY);

$payload = [
    'method'         => $method,
    'merchant_ref'   => $merchantRef,
    'amount'         => (int)$amount,
    'customer_name'  => $name,
    'customer_email' => $email,
    'customer_phone' => $phone,
    'order_items'    => [
        [
            'sku'      => 'SMARTFEED-' . strtoupper($plan),
            'name'     => $productName,
            'price'    => (int)$amount,
            'quantity' => 1
        ]
    ],
    'return_url'     => 'https://smartfeed.berandadigital.net/checkout?ref=' . $merchantRef . '&status=paid&email=' . urlencode($email) . '&name=' . urlencode($name),
    'expired_time'   => time() + (24 * 60 * 60), // 24 jam
    'signature'      => $signature
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, TRIPAY_API_URL . 'transaction/create');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . TRIPAY_API_KEY,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 25);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    echo json_encode([
        'success' => false,
        'message' => 'Koneksi ke gateway gagal: ' . $curlError
    ]);
    exit;
}

$resData = json_decode($response, true);

if ($httpCode === 200 && isset($resData['success']) && $resData['success']) {
    echo json_encode([
        'success' => true,
        'data'    => $resData['data']
    ]);
} else {
    $msg = $resData['message'] ?? 'Gagal membuat transaksi TriPay (HTTP ' . $httpCode . ')';
    echo json_encode([
        'success'  => false,
        'message'  => $msg,
        'response' => $resData
    ]);
}
