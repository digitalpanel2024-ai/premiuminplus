<?php 
include 'config.php'; 

$err_msg = "";
$success_msg = "";

// ---------------------------------------------------------
// LOGIKA CEK PEMBAYARAN & AUTO-ORDER
// ---------------------------------------------------------
if (isset($_POST['cek_lunas'])) {
    $inv_post = trim($_POST['invoice']);
    
    // ANTI-HACKER: Cuma bolehin Huruf dan Angka (No SQLi / XSS)
    if (preg_match('/^[a-zA-Z0-9]+$/', $inv_post)) {
        
        $cek_pay = premku_api('pay_status', ['invoice' => $inv_post]);
        
        if ($cek_pay && isset($cek_pay['success']) && $cek_pay['success'] == true) {
            $status_depo = strtolower($cek_pay['data']['status'] ?? '');

            if (in_array($status_depo, ['success', 'sukses', 'settlement', 'paid'])) {
                $q = $db->query("SELECT * FROM orders WHERE invoice = '$inv_post' LIMIT 1");
                
                if ($o = $q->fetch_assoc()) {
                    $pdata = json_decode($o['account_data'], true);

                    // SKENARIO A: Pembayaran Lunas & Belum di-Order
                    if ($o['status'] == 'pending' && isset($pdata['product_id'])) {
                        $pid = $pdata['product_id'];

                        // Gas Beli Produk!
                        $beli = premku_api('order', ['product_id' => $pid, 'qty' => 1]);
                        
                        if ($beli && $beli['success']) {
                            $order_inv = $beli['invoice']; 
                            $st = premku_api('status', ['invoice' => $order_inv]);
                            
                            if (!empty($st['accounts'])) {
                                $accs = json_encode($st['accounts']);
                                $db->query("UPDATE orders SET account_data = '$accs', status = 'success' WHERE invoice = '$inv_post'");
                                $success_msg = "Pembayaran Diterima! Akun berhasil digenerate.";
                            } else {
                                $pdata['order_invoice'] = $order_inv;
                                $pdata_json = json_encode($pdata);
                                $db->query("UPDATE orders SET account_data = '$pdata_json', status = 'processing' WHERE invoice = '$inv_post'");
                                $success_msg = "Pembayaran Diterima! Server sedang memproses akun Anda, mohon tunggu sebentar.";
                            }
                        } else {
                            $err_msg = "Saldo masuk, tapi gagal order ke pusat: " . ($beli['message'] ?? 'Unknown Error');
                        }
                    } 
                    // SKENARIO B: Sedang Processing dari pusat
                    elseif ($o['status'] == 'processing' && isset($pdata['order_invoice'])) {
                        $order_inv = $pdata['order_invoice'];
                        $st = premku_api('status', ['invoice' => $order_inv]);
                        
                        if (!empty($st['accounts'])) {
                            $accs = json_encode($st['accounts']);
                            $db->query("UPDATE orders SET account_data = '$accs', status = 'success' WHERE invoice = '$inv_post'");
                            $success_msg = "Proses selesai! Akun berhasil diambil.";
                        } else {
                            $err_msg = "Pembayaran lunas, tapi akun masih disiapkan oleh server pusat. Silakan refresh lagi.";
                        }
                    }
                }
            } else {
                $err_msg = "Pembayaran belum terdeteksi. Status API saat ini: " . strtoupper($status_depo);
            }
        } else {
            $err_msg = "Gagal terhubung ke API Pembayaran. Pesan: " . ($cek_pay['message'] ?? 'Timeout');
        }
    } else {
        $err_msg = "Aksi ilegal ditolak. Format invoice tidak valid!";
    }
}

// ---------------------------------------------------------
// LOGIKA PENGAMBILAN DATA (VIEW)
// ---------------------------------------------------------
$invoice_found = false;
$r = null;
$data = null;
$search_error = "";

// Ambil parameter GET, entah dari link manual atau dari URL
$get_inv = $_GET['inv'] ?? ($_POST['invoice'] ?? '');

if (!empty($get_inv)) {
    $inv_clean = trim($get_inv);
    
    // ANTI-HACKER: Cek format sebelum hit database
    if (preg_match('/^[a-zA-Z0-9]+$/', $inv_clean)) {
        $q = $db->query("SELECT * FROM orders WHERE invoice = '$inv_clean' LIMIT 1");
        if ($r = $q->fetch_assoc()) {
            $invoice_found = true;
            $data = json_decode($r['account_data'], true);
        } else {
            $search_error = "Nomor Invoice <b>".htmlspecialchars($inv_clean)."</b> tidak ditemukan di sistem kami.";
        }
    } else {
        $search_error = "Format pencarian tidak valid. Jangan aneh-aneh bos!";
    }
}
?>
<!--
╔══════════════════════════════════════════════════════╗
║               APPSPREM STORE SCRIPT                 ║
║               Powered by Marshep Ollo               ║
╚══════════════════════════════════════════════════════╝

⚠ COPYRIGHT NOTICE
Script ini dilindungi hak cipta.
Dilarang menjual / mendistribusikan ulang tanpa izin.

✓ Boleh modifikasi
✗ Jangan hapus credit

Hargai pembuat aslinya ya :)
-->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lacak Pesanan — <?= defined('STORE_NAME') ? STORE_NAME : 'Ollo Store' ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #0B0F19; color: #F1F5F9; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
        .grad-text { background: linear-gradient(90deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .grad-btn { background: linear-gradient(135deg, #8b5cf6, #3b82f6); transition: 0.3s; }
        .grad-btn:hover { opacity: 0.9; box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4); transform: translateY(-2px); }
        .animate-up { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="min-h-screen pb-20 relative flex flex-col">

<nav class="sticky top-0 z-50 glass py-4 px-6 md:px-10 flex justify-between items-center border-b border-white/5 shadow-sm w-full">
    <a href="/" class="text-2xl font-extrabold tracking-tighter text-white"><?= defined('STORE_NAME') ? explode(' ', STORE_NAME)[0] : 'OLLO' ?><span class="text-violet-500">.</span></a>
    <a href="cek" class="text-xs font-bold uppercase tracking-widest text-violet-400 hover:text-white transition flex items-center gap-2">
        <i class="bi bi-search"></i> <span class="hidden md:inline">Lacak Pesanan</span>
    </a>
</nav>

<div class="flex-grow flex items-center justify-center p-6 mt-4">
    <div class="w-full max-w-lg">

        <?php if(!$invoice_found): ?>
            <div class="text-center md:text-left mb-8 animate-up">
                <a href="/" class="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition uppercase tracking-widest mb-6">
                    <i class="bi bi-arrow-left"></i> Kembali ke Toko
                </a>
                <h1 class="text-3xl font-extrabold mb-2 text-white">Lacak <span class="grad-text">Pesanan.</span></h1>
                <p class="text-slate-400 text-sm">Masukkan nomor invoice (ORD...) untuk melihat pembayaran/akun Anda.</p>
            </div>

            <?php if($search_error): ?>
                <div class="animate-up mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium">
                    <i class="bi bi-exclamation-circle-fill me-2"></i> <?= $search_error ?>
                </div>
            <?php endif; ?>

            <div class="glass rounded-[2.5rem] p-6 md:p-10 shadow-2xl bg-[#111827]/50 animate-up">
                <form method="GET" action="cek" class="flex flex-col md:flex-row gap-3">
                    <input type="text" name="inv" placeholder="Contoh: ORD123..." required 
                           class="flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-violet-500 transition text-sm text-white placeholder-slate-500">
                    <button class="bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-2xl text-xs uppercase tracking-widest transition shadow-lg shadow-violet-500/20">Cari</button>
                </form>
            </div>
        <?php endif; ?>

        <?php if($invoice_found): 
            $status_color = 'bg-yellow-500/10 text-yellow-400';
            $status_text = 'PENDING PAYMENT';
            if ($r['status'] == 'processing') { $status_color = 'bg-blue-500/10 text-blue-400'; $status_text = '⏳ MEMPROSES AKUN'; }
            if ($r['status'] == 'success') { $status_color = 'bg-green-500/10 text-green-400'; $status_text = '✔ SUKSES'; }
        ?>
            <div class="flex justify-between items-center mb-6 animate-up">
                <a href="/" class="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition uppercase tracking-widest">
                    <i class="bi bi-arrow-left"></i> Home
                </a>
                <a href="cek" class="inline-flex items-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300 transition uppercase tracking-widest">
                    <i class="bi bi-search"></i> Lacak Lainnya
                </a>
            </div>

            <div class="glass rounded-[2.5rem] p-6 md:p-10 shadow-2xl bg-[#111827]/50 animate-up">
                
                <div class="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
                    <div>
                        <span class="text-[10px] font-black <?= $status_color ?> px-3 py-1 rounded-full uppercase tracking-widest">
                            <?= $status_text ?>
                        </span>
                        <h2 class="text-xl md:text-2xl font-bold text-white mt-4"><?= htmlspecialchars($r['product_name']) ?></h2>
                        <p class="text-slate-400 text-xs mt-1 font-mono">INV: <?= htmlspecialchars($r['invoice']) ?></p>
                    </div>
                </div>

                <?php if($err_msg): ?>
                    <div class="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold leading-relaxed"><i class="bi bi-info-circle-fill me-2"></i><?= htmlspecialchars($err_msg) ?></div>
                <?php endif; ?>
                <?php if($success_msg): ?>
                    <div class="p-4 mb-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-xs font-bold leading-relaxed"><i class="bi bi-check-circle-fill me-2"></i><?= htmlspecialchars($success_msg) ?></div>
                <?php endif; ?>

                <?php if($r['status'] == 'pending'): ?>
                    <div class="text-center bg-white p-6 rounded-3xl mb-6 relative overflow-hidden group">
                        <img src="<?= htmlspecialchars($data['qr_image'] ?? '') ?>" class="mx-auto w-48 h-48 object-contain">
                    </div>
                    
                    <div class="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 flex justify-between items-center mb-8">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Bayar:</span>
                        <span class="text-xl font-extrabold text-blue-400">Rp <?= number_format($data['total_bayar'] ?? 0, 0, ',', '.') ?></span>
                    </div>

                    <form method="POST">
                        <input type="hidden" name="invoice" value="<?= htmlspecialchars($r['invoice']) ?>">
                        <button type="submit" name="cek_lunas" class="w-full grad-btn py-4 rounded-2xl font-black text-xs tracking-widest text-white uppercase shadow-lg shadow-violet-500/30">Cek Status Pembayaran</button>
                    </form>

                <?php elseif($r['status'] == 'processing'): ?>
                    <div class="text-center p-8 bg-blue-500/10 rounded-3xl mb-8 border border-blue-500/20">
                        <i class="bi bi-hourglass-split text-5xl text-blue-400 mb-4 block animate-pulse"></i>
                        <h3 class="text-white font-bold text-lg mb-2">Sedang Mengambil Akun...</h3>
                        <p class="text-xs text-slate-400 leading-relaxed">Pembayaran Anda sudah lunas. Server sedang menarik data akun dari pusat. Tunggu sebentar.</p>
                    </div>

                    <form method="POST">
                        <input type="hidden" name="invoice" value="<?= htmlspecialchars($r['invoice']) ?>">
                        <button type="submit" name="cek_lunas" id="btnCooldown" disabled class="w-full bg-slate-700 cursor-not-allowed transition py-4 rounded-2xl font-black text-xs tracking-widest text-slate-400 uppercase shadow-lg">Menunggu (10s)...</button>
                    </form>

                <?php elseif($r['status'] == 'success'): ?>
                    <div class="space-y-4">
                        <?php if(!empty($data)): foreach($data as $a): ?>
                            <div class="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 relative overflow-hidden">
                                <div class="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Email / Username</p>
                                <div class="flex justify-between items-center mb-3">
                                    <code class="text-blue-300 font-bold text-sm select-all"><?= htmlspecialchars($a['username']) ?></code>
                                </div>
                                
                                <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Password</p>
                                <code class="text-violet-300 font-bold text-sm select-all"><?= htmlspecialchars($a['password']) ?></code>
                            </div>
                        <?php endforeach; else: ?>
                            <div class="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-yellow-400 text-xs text-center">Terjadi kesalahan saat memuat data akun.</div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
                
                <?php if($r['status'] != 'pending'): ?>
                    <a href="https://wa.me/<?= defined('WA_ADMIN') ? WA_ADMIN : '628XXXXXXXXXX' ?>?text=Halo+Admin+Bantu+Cek+Inv+<?= htmlspecialchars($r['invoice']) ?>" target="_blank" class="mt-6 block text-center bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-bold text-xs tracking-widest text-white uppercase transition">Ada Kendala? Hubungi Admin</a>
                <?php endif; ?>

            </div>
        <?php endif; ?>

    </div>
</div>

<a href="https://wa.me/<?= defined('WA_ADMIN') ? WA_ADMIN : '628XXXXXXXXXX' ?>" target="_blank" class="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-green-500/40 hover:scale-110 hover:-translate-y-1 transition-all">
    <i class="bi bi-whatsapp"></i>
</a>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const btn = document.getElementById('btnCooldown');
        if (btn) {
            let timeLeft = 10; // Setting timer 10 detik di sini
            
            const timer = setInterval(() => {
                timeLeft--;
                if (timeLeft > 0) {
                    btn.innerHTML = `Menunggu (${timeLeft}s)...`;
                } else {
                    clearInterval(timer);
                    btn.disabled = false;
                    btn.innerHTML = 'Cek Akun Sekarang';
                    
                    // Balikin warna dan efek hover aslinya
                    btn.className = 'w-full bg-blue-600 hover:bg-blue-500 transition py-4 rounded-2xl font-black text-xs tracking-widest text-white uppercase shadow-lg shadow-blue-500/30 cursor-pointer';
                }
            }, 1000);
        }
    });
</script>

</body>
</html>