<?php
session_start();
include 'config.php';

// --- PENGATURAN LOGIN ADMIN ---
$admin_username = "admin";
$admin_password = "admin123";

// Proses Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: admin.php");
    exit;
}

// Proses Login
$error = "";
if (isset($_POST['do_login'])) {
    $u = $_POST['username'];
    $p = $_POST['password'];
    
    if ($u === $admin_username && $p === $admin_password) {
        $_SESSION['admin_logged_in'] = true;
        header("Location: admin.php");
        exit;
    } else {
        $error = "Username atau password salah!";
    }
}

// =========================================================================
// 1. TAMPILAN HALAMAN LOGIN (JIKA BELUM LOGIN)
// =========================================================================
if (!isset($_SESSION['admin_logged_in'])) {
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
    <title>Admin Login - <?= defined('STORE_NAME') ? STORE_NAME : 'Ollo Store' ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #050505; color: #fff; }
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); }
        .grad-text { background: linear-gradient(90deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .grad-btn { background: linear-gradient(135deg, #7c3aed, #2563eb); transition: all 0.3s ease; }
        .grad-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.5); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-up { animation: slideUp 0.5s ease forwards; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse" style="animation-delay: 2s;"></div>

    <div class="glass w-full max-w-sm p-10 rounded-[2.5rem] shadow-2xl animate-up relative z-10">
        <div class="text-center mb-10">
            <h1 class="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome Back.</h1>
            <p class="text-slate-400 text-sm">Masuk ke panel admin <span class="grad-text font-bold text-base"><?= defined('STORE_NAME') ? STORE_NAME : 'OLLO' ?></span></p>
        </div>

        <?php if($error): ?>
            <div class="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm mb-6 text-center font-medium">
                <?= $error ?>
            </div>
        <?php endif; ?>

        <form method="POST" class="space-y-5">
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Username</label>
                <input type="text" name="username" placeholder="admin" required class="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-violet-500 focus:bg-white/5 transition text-sm">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Password</label>
                <input type="password" name="password" placeholder="••••••••" required class="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-violet-500 focus:bg-white/5 transition text-sm">
            </div>
            <button type="submit" name="do_login" class="w-full grad-btn py-4 mt-4 rounded-2xl font-black text-xs tracking-widest text-white uppercase shadow-lg shadow-violet-600/30">Sign In</button>
        </form>
    </div>
</body>
</html>
<?php
    exit;
}

// =========================================================================
// 2. TAMPILAN DASHBOARD ADMIN (JIKA SUDAH LOGIN)
// =========================================================================

// Update Settings
if(isset($_POST['save_settings'])) {
    $sn = $db->real_escape_string($_POST['store_name']); 
    $ak = $db->real_escape_string($_POST['api_key']); 
    $wa = $db->real_escape_string($_POST['wa_admin']); 
    $mk = (int)$_POST['markup'];
    $mkt = $db->real_escape_string($_POST['markup_type']);
    
    $db->query("UPDATE settings SET store_name='$sn', api_key='$ak', wa_admin='$wa', markup='$mk', markup_type='$mkt' WHERE id=1");
    header("Location: admin.php?saved=1");
    exit;
}

// Ambil Data Profile Pusat (Premku)
$profile_res = premku_api('profile');
$premku = null;
if ($profile_res && isset($profile_res['success']) && $profile_res['success'] == true) {
    $premku = $profile_res['data'];
}

$orders = $db->query("SELECT * FROM orders ORDER BY id DESC");
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - <?= defined('STORE_NAME') ? STORE_NAME : 'Ollo Store' ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #050505; color: #f1f5f9; }
        .glass-panel { background: #0B0F19; border: 1px solid rgba(255,255,255,0.05); }
        .grad-btn { background: linear-gradient(135deg, #8b5cf6, #3b82f6); transition: 0.3s; }
        .grad-btn:hover { opacity: 0.9; box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4); }
        .animate-up { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="p-4 md:p-8 relative">
    <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h2 class="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">ADMINISTRATOR</h2>
                <p class="text-slate-500 text-sm font-medium mt-1">Mengelola sistem <?= defined('STORE_NAME') ? STORE_NAME : 'Ollo Store' ?></p>
            </div>
            <div class="flex gap-3">
                <a href="/" target="_blank" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition hidden md:inline-flex items-center"><i class="bi bi-box-arrow-up-right mr-2"></i> Buka Toko</a>
                <a href="?logout=true" onclick="return confirm('Yakin mau keluar?')" class="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center"><i class="bi bi-power mr-2"></i> Logout</a>
            </div>
        </div>
        
        <?php if(isset($_GET['saved'])): ?>
            <div class="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl text-sm mb-6 font-bold flex items-center animate-up">
                <i class="bi bi-check-circle-fill mr-2"></i> Konfigurasi berhasil disimpan!
            </div>
        <?php endif; ?>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <?php if($premku): ?>
                <div class="glass-panel p-6 rounded-[2rem] flex justify-between items-center border-l-4 border-blue-500 shadow-xl">
                    <div>
                        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Saldo Pusat (Premku)</p>
                        <h3 class="text-2xl font-black text-white">Rp <?= number_format($premku['saldo'], 0, ',', '.') ?></h3>
                    </div>
                    <div class="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl">
                        <i class="bi bi-wallet2"></i>
                    </div>
                </div>
                <div class="glass-panel p-6 rounded-[2rem] flex justify-between items-center border-l-4 border-violet-500 shadow-xl">
                    <div>
                        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Username Pusat</p>
                        <h3 class="text-lg font-black text-white truncate max-w-[150px]">@<?= htmlspecialchars($premku['username']) ?></h3>
                    </div>
                    <div class="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 text-xl">
                        <i class="bi bi-person-badge"></i>
                    </div>
                </div>
                <div class="glass-panel p-6 rounded-[2rem] flex justify-between items-center border-l-4 border-green-500 shadow-xl">
                    <div>
                        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Status API Key</p>
                        <h3 class="text-lg font-black text-green-400">Terkoneksi ✔</h3>
                    </div>
                    <div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 text-xl">
                        <i class="bi bi-shield-check"></i>
                    </div>
                </div>
            <?php else: ?>
                <div class="col-span-1 md:col-span-3 bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] flex items-center gap-4 text-red-400">
                    <i class="bi bi-exclamation-triangle-fill text-3xl"></i>
                    <div>
                        <h3 class="font-bold text-lg">API Key Tidak Valid!</h3>
                        <p class="text-sm opacity-80">Gagal mengambil data dari server Premku. Silakan cek kembali API Key Anda di pengaturan bawah.</p>
                    </div>
                </div>
            <?php endif; ?>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-1">
                <form method="POST" class="glass-panel p-6 rounded-[2rem] shadow-2xl sticky top-24">
                    <div class="font-black text-xs text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4 mb-6"><i class="bi bi-gear-fill mr-2"></i> Konfigurasi Toko</div>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Nama Toko</label>
                            <input type="text" name="store_name" value="<?= defined('STORE_NAME') ? STORE_NAME : '' ?>" class="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-violet-500 text-white transition">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">WA Admin (Awali 628)</label>
                            <input type="number" name="wa_admin" value="<?= defined('WA_ADMIN') ? WA_ADMIN : '' ?>" class="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-violet-500 text-white transition">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">API Key Premku</label>
                            <input type="text" name="api_key" value="<?= defined('API_KEY') ? API_KEY : '' ?>" class="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-violet-500 text-white transition font-mono">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Tipe Markup Harga</label>
                            <select name="markup_type" class="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-violet-500 text-white transition appearance-none">
                                <option value="fixed" <?= defined('MARKUP_TYPE') && MARKUP_TYPE == 'fixed' ? 'selected' : '' ?>>Nominal Rupiah (Rp)</option>
                                <option value="percent" <?= defined('MARKUP_TYPE') && MARKUP_TYPE == 'percent' ? 'selected' : '' ?>>Persentase (%)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Nilai Keuntungan</label>
                            <input type="number" name="markup" value="<?= defined('MARKUP') ? MARKUP : '' ?>" class="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-violet-500 text-white transition">
                        </div>
                    </div>

                    <div class="mt-6">
                        <button type="submit" name="save_settings" class="w-full px-8 grad-btn py-4 rounded-xl font-black text-xs tracking-widest uppercase text-white shadow-lg shadow-violet-500/20"><i class="bi bi-floppy-fill mr-2"></i> Simpan Data</button>
                    </div>
                </form>
            </div>

            <div class="lg:col-span-2">
                <div class="glass-panel rounded-[2rem] overflow-hidden shadow-2xl h-full">
                    <div class="p-6 md:p-8 border-b border-white/5 font-black text-xs text-slate-500 uppercase tracking-widest flex justify-between items-center">
                        <span><i class="bi bi-clock-history mr-2"></i> Riwayat Transaksi</span>
                        <span class="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg">Total: <?= $orders->num_rows ?></span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm whitespace-nowrap">
                            <thead class="bg-black/30 text-slate-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th class="px-6 py-4 font-bold">Data Order</th>
                                    <th class="px-6 py-4 font-bold">Produk</th>
                                    <th class="px-6 py-4 font-bold text-center">Status / Akun</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5 text-slate-300">
                                <?php if($orders->num_rows > 0): ?>
                                    <?php while($o = $orders->fetch_assoc()): 
                                        // Rapihin Status
                                        $st_color = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
                                        $st_text = "PENDING";
                                        if ($o['status'] == 'success') { $st_color = "text-green-400 bg-green-500/10 border-green-500/20"; $st_text = "SUKSES"; }
                                        if ($o['status'] == 'processing') { $st_color = "text-blue-400 bg-blue-500/10 border-blue-500/20"; $st_text = "PROSES"; }

                                        // Data Akun
                                        $acc_json = json_decode($o['account_data'], true);
                                        $modal_html = "";
                                        $copy_text = "";
                                        
                                        if ($o['status'] == 'pending' || $o['status'] == 'processing') {
                                            $modal_html = "<div class='text-center text-slate-400 py-6'><i class='bi bi-hourglass-split text-3xl mb-2 block'></i>Status belum sukses. Data akun belum tersedia.</div>";
                                        } else if (is_array($acc_json) && isset($acc_json[0]['username'])) {
                                            foreach ($acc_json as $idx => $acc) {
                                                $copy_text .= "Akun " . ($idx + 1) . "\nUser: " . $acc['username'] . "\nPass: " . $acc['password'] . "\n\n";
                                                $modal_html .= "
                                                    <div class='bg-slate-800/80 p-4 rounded-xl border border-slate-700 mb-3 text-left relative'>
                                                        <div class='absolute top-0 left-0 w-1 h-full bg-green-500 rounded-l-xl'></div>
                                                        <p class='text-[10px] text-slate-400 font-bold uppercase mb-1'>Username / Email</p>
                                                        <code class='text-blue-300 font-bold text-sm block mb-3'>".htmlspecialchars($acc['username'])."</code>
                                                        <p class='text-[10px] text-slate-400 font-bold uppercase mb-1'>Password</p>
                                                        <code class='text-violet-300 font-bold text-sm'>".htmlspecialchars($acc['password'])."</code>
                                                    </div>
                                                ";
                                            }
                                        } else {
                                            $modal_html = "<div class='text-center text-red-400 py-6'><i class='bi bi-exclamation-triangle text-3xl mb-2 block'></i>Data akun tidak valid atau kosong.</div>";
                                        }

                                        // ANTI-BUG: Encode pakai URL Encodding biar nggak patah pas di JS
                                        $modal_html_safe = rawurlencode($modal_html);
                                        $copy_text_safe = rawurlencode($copy_text);
                                    ?>
                                    <tr class="hover:bg-white/5 transition">
                                        <td class="px-6 py-4">
                                            <div class="font-bold text-white mb-1"><?= htmlspecialchars($o['customer_name']) ?></div>
                                            <div class="text-[10px] text-slate-500 flex items-center gap-2"><i class="bi bi-whatsapp"></i> <?= htmlspecialchars($o['whatsapp']) ?></div>
                                            <div class="text-[10px] text-slate-600 mt-1"><?= date('d/m/y H:i', strtotime($o['created_at'])) ?></div>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="font-bold text-sm text-slate-200"><?= $o['product_name'] ?></div>
                                            <div class="font-mono text-blue-400 text-[10px] mt-1">INV: <?= $o['invoice'] ?></div>
                                        </td>
                                        <td class="px-6 py-4 text-center">
                                            <div class="flex flex-col items-center gap-2">
                                                <span class="text-[9px] font-black px-3 py-1 rounded border uppercase <?= $st_color ?>"><?= $st_text ?></span>
                                                <button onclick="openIntipModal('<?= $o['invoice'] ?>', '<?= $modal_html_safe ?>', '<?= $copy_text_safe ?>')" class="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"><i class="bi bi-eye"></i> Intip</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <tr><td colspan="3" class="px-6 py-10 text-center text-slate-500">Belum ada transaksi masuk.</td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="intipModal" class="hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
        <div class="bg-[#0B0F19] border border-white/10 rounded-[2rem] w-full max-w-sm shadow-2xl relative animate-up">
            <button onclick="closeIntipModal()" class="absolute top-6 right-6 text-slate-400 hover:text-red-400 text-2xl font-bold leading-none transition">&times;</button>
            
            <div class="p-6 md:p-8">
                <h3 class="text-xl font-black text-white mb-1"><i class="bi bi-shield-lock text-violet-500 mr-2"></i>Data Akun</h3>
                <p class="text-xs text-slate-400 mb-6 font-mono" id="intipInv"></p>
                
                <div id="intipContent" class="max-h-[50vh] overflow-y-auto pr-2 mb-6">
                    </div>
                
                <button id="btnCopy" onclick="copyAkun()" class="w-full grad-btn py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 transition hidden">
                    <i class="bi bi-clipboard"></i> <span>Salin Data</span>
                </button>
            </div>
        </div>
    </div>

    <script>
        let currentCopyText = "";

        // Fungsi buka modal (Decode data dari rawurlencode)
        function openIntipModal(inv, htmlEnc, copyEnc) {
            const htmlContent = decodeURIComponent(htmlEnc);
            const copyText = decodeURIComponent(copyEnc);

            document.getElementById('intipInv').innerText = "INV: " + inv;
            document.getElementById('intipContent').innerHTML = htmlContent;
            
            currentCopyText = copyText;
            const btnCopy = document.getElementById('btnCopy');
            
            // Tampilin tombol copy cuma kalo ada isinya
            if(copyText && copyText.trim() !== "") {
                btnCopy.classList.remove('hidden');
                btnCopy.innerHTML = '<i class="bi bi-clipboard"></i> <span>Salin Data</span>';
                btnCopy.classList.remove('from-green-600', 'to-emerald-500');
            } else {
                btnCopy.classList.add('hidden');
            }

            document.getElementById('intipModal').classList.remove('hidden');
        }

        function closeIntipModal() {
            document.getElementById('intipModal').classList.add('hidden');
        }

        function copyAkun() {
            if(!currentCopyText) return;
            
            navigator.clipboard.writeText(currentCopyText).then(() => {
                const btnCopy = document.getElementById('btnCopy');
                btnCopy.innerHTML = '<i class="bi bi-check2-all"></i> <span>Tersalin!</span>';
                // Ganti warna button sementara jadi ijo
                btnCopy.classList.add('from-green-600', 'to-emerald-500');
                
                setTimeout(() => {
                    btnCopy.innerHTML = '<i class="bi bi-clipboard"></i> <span>Salin Data</span>';
                    btnCopy.classList.remove('from-green-600', 'to-emerald-500');
                }, 2000);
            }).catch(err => {
                alert("Gagal menyalin: " + err);
            });
        }
    </script>
</body>
</html>