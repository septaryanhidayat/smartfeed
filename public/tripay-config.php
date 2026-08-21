<?php
/**
 * Konfigurasi Resmi TriPay Payment Gateway — SmartFeed
 * Merchant: Beranda Teknologi Digital
 */

define('TRIPAY_MERCHANT_CODE', 'T52373');
define('TRIPAY_API_KEY',       'MknzyZbGbTsjUdERDLhqNwy2JHfqEanTOUNIGbjF');
define('TRIPAY_PRIVATE_KEY',   'VGqgf-IRJ3D-X4oit-WdEsD-u1lTG');
define('TRIPAY_MODE',          'production'); // production atau sandbox

define('TRIPAY_API_URL', TRIPAY_MODE === 'production' 
    ? 'https://tripay.co.id/api/' 
    : 'https://tripay.co.id/api-sandbox/'
);

define('GOOGLE_SCRIPT_WEBHOOK', 'https://script.google.com/macros/s/AKfycbyU-nWqkiP62eGmmJz6aIIRifLWdQHzCzHEsLHWGkK8_DSOpsHSMXLvpY69uBNuKgfM/exec');
