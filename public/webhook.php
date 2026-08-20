<?php
/**
 * Smart Feed - Tripay Webhook Relay
 * Menerima callback dari Tripay dan meneruskannya ke Google Apps Script Spreadsheet.
 */

header('Content-Type: application/json');

// Ambil data payload JSON dari Tripay
$payload = file_get_contents('php://input');

// URL Google Apps Script Web App Anda
$googleScriptUrl = "https://script.google.com/macros/s/AKfycbzSVFXWUhaP09jdbRcD1FVVDZaDHhsskUvbx-mS7FZ2QfQcRxjMfm3WwLRoPg5wfVV1/exec";

if (!empty($payload)) {
    // Teruskan payload ke Google Apps Script
    $ch = curl_init($googleScriptUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($payload)
    ]);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    echo json_encode([
        'success' => true,
        'message' => 'Callback forwarded to Google Spreadsheet successfully',
        'forward_code' => $httpCode
    ]);
} else {
    // Jika dibuka langsung via browser (GET request)
    echo json_encode([
        'success' => true,
        'status' => 'Webhook listener is ready for Tripay callbacks'
    ]);
}
