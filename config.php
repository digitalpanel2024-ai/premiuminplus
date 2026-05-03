<?php
session_start();

//
// ╔══════════════════════════════════════════════════════╗
// ║               APPSPREM STORE SCRIPT                 ║
// ║               Powered by Marshep Ollo               ║
// ╚══════════════════════════════════════════════════════╝

// ⚠ COPYRIGHT NOTICE
// Script ini dilindungi hak cipta.
// Dilarang menjual / mendistribusikan ulang tanpa izin.

// ✓ Boleh modifikasi
// ✗ Jangan hapus credit

// Hargai pembuat aslinya ya :)
//

// ==========================================
// KONFIGURASI DATABASE (EDIT DI SINI)
// ==========================================
$db_host = "localhost";
$db_user = "maubuatw_fzl"; // Contoh: root
$db_pass = "maubuatw_fzl"; // Contoh: password_db
$db_name = "maubuatw_fzl"; // Contoh: ollo_store

$db = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Cek Koneksi Database
if ($db->connect_error) {
    die("Koneksi Database Gagal: " . $db->connect_error);
}

// ==========================================
// KONFIGURASI SISTEM (DARI DATABASE)
// ==========================================
$getConf = $db->query("SELECT * FROM settings WHERE id = 1")->fetch_assoc();

define('STORE_NAME',  $getConf['store_name'] ?? 'OLLO STORE');
define('API_KEY',     $getConf['api_key'] ?? '');
define('WA_ADMIN',    $getConf['wa_admin'] ?? '628XXXXXXXXXX');
define('MARKUP',      (float)($getConf['markup'] ?? 0));
define('MARKUP_TYPE', $getConf['markup_type'] ?? 'fixed');

// Base URL API Pusat
define('BASE_URL',    'https://premku.com/api/');

// ==========================================
// FUNCTION API PREMKU
// ==========================================
function premku_api($endpoint, $data = []) {
    $data['api_key'] = API_KEY;
    $ch = curl_init(BASE_URL . $endpoint);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $res = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err) {
        return ['success' => false, 'message' => 'CURL Error: ' . $err];
    }
    
    return json_decode($res, true);
}
?>