<?php
include 'config.php';

/* * APPSPREM STORE Script - Powered by Marshep Ollo
 * Dilarang memperjualbelikan script ini tanpa izin.
 * Modifikasi diperbolehkan tanpa menghapus copyright.
 */
 
$notif = "";
// ---------------------------------------------------------
// LOGIKA CHECKOUT (GENERATE QRIS & REDIRECT)
// ---------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['gas_order'])) {
    $pid = (int)$_POST['product_id'];
    $cust = $db->real_escape_string($_POST['customer']);
    $wa = $db->real_escape_string($_POST['wa_number']);

    $res_api = premku_api('products');
    $base_price = 0;
    $p_name = "";
    if ($res_api && $res_api['success']) {
        foreach ($res_api['products'] as $p) {
            if ($p['id'] == $pid) { 
                $base_price = $p['price']; 
                $p_name = $p['name']; 
                break; 
            }
        }
    }

    if ($base_price > 0) {
        if (defined('MARKUP_TYPE') && MARKUP_TYPE == 'percent') {
            $sell_price = $base_price + ($base_price * (MARKUP / 100));
        } else {
            $sell_price = $base_price + (defined('MARKUP') ? MARKUP : 2000);
        }
        $sell_price = ceil($sell_price / 100) * 100;

        $pay = premku_api('pay', ['amount' => $sell_price]);

        if ($pay && $pay['success']) {
            $inv = $pay['data']['invoice'];
            $qr_img = $pay['data']['qr_image'];
            $total = $pay['data']['total_bayar'];

            $payment_data = json_encode([
                'product_id' => $pid,
                'qr_image' => $qr_img,
                'total_bayar' => $total
            ]);

            $db->query("INSERT INTO orders (invoice, product_name, customer_name, whatsapp, account_data, status) 
                        VALUES ('$inv', '$p_name', '$cust', '$wa', '$payment_data', 'pending')");
            
            header("Location: cek?inv=$inv");
            exit;
        } else {
            $notif = "error|" . ($pay['message'] ?? "Sistem pembayaran sedang gangguan.");
        }
    } else {
        $notif = "error|Produk tidak ditemukan atau stok habis.";
    }
}

// ---------------------------------------------------------
// LOGIKA PENGELOMPOKAN & SORTING PRODUK
// ---------------------------------------------------------
$res_api = premku_api('products');
$grouped_products = [];

function getSmartGroupName($productName) {
    $aliases = [
        'am' => 'Alight Motion', 'alight motion' => 'Alight Motion',
        'canva' => 'Canva', 'capcut' => 'CapCut', 'spotify' => 'Spotify',
        'youtube' => 'YouTube', 'yt' => 'YouTube', 'netflix' => 'Netflix',
        'prime' => 'Prime Video', 'viu' => 'Viu', 'vidio' => 'Vidio', 'vd' => 'Vidio',
        'chatgpt' => 'ChatGPT', 'gpt' => 'ChatGPT', 'discord' => 'Discord', 'nitro' => 'Discord',
        'disney' => 'Disney+', 'hotstar' => 'Disney+', 'wetv' => 'WeTV', 'iqiyi' => 'iQIYI',
        'bstation' => 'BStation', 'zoom' => 'Zoom', 'hbo' => 'HBO Go', 'picsart' => 'PicsArt',
        'vsco' => 'VSCO', 'lightroom' => 'Lightroom'
    ];
    
    foreach ($aliases as $keyword => $group) {
        if (preg_match("/\b" . preg_quote($keyword, '/') . "\b/i", $productName)) {
            return $group;
        }
    }
    
    $cleanName = preg_replace('/^([0-9]+\s*(akun|pcs|hari|bulan|tahun)?\s*)/i', '', $productName);
    return ucfirst(explode(' ', trim($cleanName))[0]); 
}

if ($res_api && $res_api['success']) {
    foreach ($res_api['products'] as $p) {
        $group_name = getSmartGroupName($p['name']);
        
        if (defined('MARKUP_TYPE') && MARKUP_TYPE == 'percent') {
            $p['sell_price'] = $p['price'] + ($p['price'] * (MARKUP / 100));
        } else {
            $p['sell_price'] = $p['price'] + (defined('MARKUP') ? MARKUP : 2000);
        }
        $p['sell_price'] = ceil($p['sell_price'] / 100) * 100;
        
        $grouped_products[$group_name][] = $p;
    }

    // URUTKAN GRUP PRODUK A-Z
    ksort($grouped_products);

    // URUTKAN VARIAN DI DALAM GRUP A-Z
    foreach ($grouped_products as &$items) {
        usort($items, function($a, $b) {
            return strcmp($a['name'], $b['name']);
        });
    }
    // INI DIA PENYELAMAT ZOOM BIAR GAK JADI YOUTUBE WKWK
    unset($items); 
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
    <title><?= defined('STORE_NAME') ? STORE_NAME : 'Ollo Store' ?> — Premium Apps</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #0B0F19; color: #F1F5F9; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
        .neon-border { border: 1px solid rgba(255, 255, 255, 0.1); transition: 0.3s; background: #111827; }
        .neon-border:hover { border-color: #8b5cf6; box-shadow: 0 0 20px rgba(139, 92, 246, 0.2); transform: translateY(-4px); }
        .grad-text { background: linear-gradient(90deg, #a78bfa, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .grad-btn { background: linear-gradient(135deg, #8b5cf6, #3b82f6); transition: 0.3s; }
        .grad-btn:hover { opacity: 0.9; box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4); transform: scale(1.02); }
        .variant-card { transition: 0.2s; cursor: pointer; }
        .variant-card:hover { background: rgba(139, 92, 246, 0.1); border-color: #8b5cf6; }
        .variant-disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; filter: grayscale(100%); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-up { animation: fadeIn 0.4s ease forwards; }
    </style>
</head>
<body class="min-h-screen pb-20 relative">

<nav class="sticky top-0 z-50 glass py-4 px-6 md:px-10 flex justify-between items-center border-b border-white/5 shadow-sm">
    <a href="/" class="text-2xl font-extrabold tracking-tighter text-white"><?= defined('STORE_NAME') ? explode(' ', STORE_NAME)[0] : 'OLLO' ?><span class="text-violet-500">.</span></a>
    <a href="cek" class="text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition flex items-center gap-2">
        <i class="bi bi-search"></i> <span class="hidden md:inline">Lacak Pesanan</span>
    </a>
</nav>

<div class="max-w-6xl mx-auto px-6 py-10">
    <?php if ($notif): 
        $d = explode('|', $notif); 
        if ($d[0] == 'error'): ?>
        <div class="animate-up glass rounded-3xl p-6 mb-10 border-l-4 border-red-500 shadow-xl">
            <h2 class="text-lg font-bold text-red-400 mb-1"><i class="bi bi-exclamation-triangle-fill me-2"></i> Checkout Gagal</h2>
            <p class="text-sm text-slate-300"><?= $d[1] ?></p>
        </div>
    <?php endif; endif; ?>

    <div class="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 class="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">Rajanya Apps <br class="hidden md:block"><span class="grad-text">Premium Murah.</span></h1>
            <p class="text-slate-400 text-sm md:text-base max-w-xl">Kenapa harus bayar mahal kalau ada yang legal dan murah? Proses otomatis, scan QRIS langsung dapet akun!</p>
        </div>
        <div class="w-full md:w-72 relative">
            <i class="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            <input type="text" id="searchInput" onkeyup="cariProduk()" placeholder="Cari aplikasi..." 
                   class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-violet-500 transition text-white">
        </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" id="productGrid">
        <?php
        if (!empty($grouped_products)):
            foreach ($grouped_products as $group_name => $items):
                $cover_image = $items[0]['image'];
                $total_paket = count($items);
                
                $harga_mulai = 0;
                $total_stok = 0;
                $prices = [];
                foreach ($items as $item) {
                    $total_stok += $item['stock'];
                    if ($item['stock'] > 0) {
                        $prices[] = $item['sell_price'];
                    }
                }
                if (!empty($prices)) {
                    $harga_mulai = min($prices);
                } else {
                    $harga_mulai = $items[0]['sell_price']; 
                }
        ?>
        <div class="group animate-up product-card <?= $total_stok == 0 ? 'opacity-50 grayscale' : '' ?>" data-name="<?= strtolower($group_name) ?>" <?= $total_stok > 0 ? "onclick=\"openGroup('".addslashes($group_name)."')\"" : "" ?>>
            <div class="relative overflow-hidden rounded-[2rem] mb-3 neon-border shadow-lg <?= $total_stok > 0 ? 'cursor-pointer' : '' ?>">
                <img src="<?= $cover_image ?>" class="w-full aspect-square object-cover bg-white transition-transform duration-500 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-[#0B0F19]/20 to-transparent"></div>
                
                <div class="absolute bottom-3 left-3">
                    <?php if($total_stok == 0): ?>
                        <span class="flex items-center gap-2 text-[9px] font-bold text-red-400 uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded-lg">
                            <i class="bi bi-x-circle-fill"></i> Habis
                        </span>
                    <?php elseif($total_paket > 1): ?>
                        <span class="text-[9px] font-bold bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-lg uppercase tracking-wider border border-white/10">
                            <?= $total_paket ?> Pilihan
                        </span>
                    <?php else: ?>
                        <span class="flex items-center gap-2 text-[9px] font-bold text-slate-200 uppercase tracking-widest">
                            <span class="flex h-2 w-2 relative"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                            Ready <?= $items[0]['stock'] ?>
                        </span>
                    <?php endif; ?>
                </div>
            </div>
            <h3 class="font-bold text-sm md:text-base text-white/90 truncate mb-1 px-1"><?= $group_name ?> Apps</h3>
            <div class="flex justify-between items-center px-1 mt-2">
                <div>
                    <p class="text-[9px] text-slate-500 uppercase font-bold">Mulai dari</p>
                    <p class="text-blue-400 font-extrabold text-sm">Rp <?= number_format($harga_mulai, 0, ',', '.') ?></p>
                </div>
                <?php if($total_stok > 0): ?>
                    <button class="grad-btn text-[10px] font-bold px-3 py-1.5 rounded-xl text-white uppercase tracking-wider">Lihat</button>
                <?php else: ?>
                    <button class="bg-slate-700 text-slate-400 text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider cursor-not-allowed">Habis</button>
                <?php endif; ?>
            </div>
        </div>
        <?php endforeach; else: ?>
        <div class="col-span-full glass p-10 text-center rounded-3xl text-slate-400">Katalog kosong atau gagal terhubung ke server pusat.</div>
        <?php endif; ?>
    </div>
</div>

<div id="superModal" class="hidden fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60 transition-all">
    <div class="glass relative w-full max-w-md rounded-[2.5rem] p-6 md:p-8 animate-up shadow-2xl border border-white/10 bg-[#0B0F19] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        
        <button type="button" onclick="closeModal()" class="absolute top-6 right-6 text-slate-400 hover:text-red-400 transition-colors text-3xl font-light leading-none z-10">&times;</button>
        
        <div id="stepVariants" class="hidden mt-2">
            <h3 class="text-2xl font-extrabold mb-1 text-white">Pilih Paket</h3>
            <p id="modalAppName" class="text-violet-400 text-xs mb-6 font-bold uppercase tracking-wider"></p>
            <div id="variantsContainer" class="space-y-3 mb-2"></div>
        </div>

        <div id="stepCheckout" class="hidden mt-2">
            <button type="button" id="btnBackVariant" onclick="backToVariants()" class="hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-white mb-4 flex items-center gap-1">
                <i class="bi bi-chevron-left"></i> Ganti Paket
            </button>
            
            <h3 class="text-2xl font-extrabold mb-1 text-white">Purchase</h3>
            <p id="checkoutProdName" class="text-violet-400 text-xs font-bold uppercase tracking-wider"></p>
            <p id="checkoutProdDesc" class="text-xs text-slate-400 mb-6 bg-white/5 p-3 rounded-xl border border-white/10"></p>
            
            <form method="POST">
                <input type="hidden" name="product_id" id="checkoutProdId">
                
                <div class="space-y-4 mb-8">
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Nama Pembeli</label>
                        <input type="text" name="customer" placeholder="Nama Anda" required class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3.5 outline-none focus:border-violet-500 focus:bg-slate-800 transition text-sm text-white">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Nomor WhatsApp</label>
                        <input type="number" name="wa_number" placeholder="08123xxxx" required class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3.5 outline-none focus:border-violet-500 focus:bg-slate-800 transition text-sm text-white">
                    </div>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700 mb-6">
                    <span class="text-xs font-bold text-slate-400 uppercase">Total Bayar:</span>
                    <span id="checkoutPrice" class="text-lg font-extrabold text-blue-400"></span>
                </div>
                
                <button type="submit" name="gas_order" class="w-full grad-btn py-4 rounded-2xl font-black text-xs tracking-widest shadow-lg shadow-violet-600/30 text-white uppercase">CONFIRM PAYMENT</button>
            </form>
        </div>
    </div>
</div>

<a href="https://wa.me/<?= defined('WA_ADMIN') ? WA_ADMIN : '628XXXXXXXXXX' ?>" target="_blank" class="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-green-500/40 hover:scale-110 hover:-translate-y-1 transition-all">
    <i class="bi bi-whatsapp"></i>
</a>

<script>
    const groupData = <?= json_encode($grouped_products) ?>;
</script>

<script>
    function cariProduk() {
        let input = document.getElementById('searchInput').value.toLowerCase();
        let cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            card.style.display = card.getAttribute('data-name').includes(input) ? "block" : "none";
        });
    }

    const modal = document.getElementById('superModal');
    const stepVar = document.getElementById('stepVariants');
    const stepChk = document.getElementById('stepCheckout');

    function openGroup(groupName) {
        const items = groupData[groupName];
        const availableItems = items.filter(i => i.stock > 0);
        if (availableItems.length === 0) return; 

        if (availableItems.length === 1) {
            goCheckout(availableItems[0].id, availableItems[0].name, availableItems[0].sell_price, availableItems[0].description, false);
            return;
        }

        document.getElementById('modalAppName').innerText = groupName + ' Apps';
        let html = '';
        items.forEach(p => {
            let priceFormatted = new Intl.NumberFormat('id-ID').format(p.sell_price);
            let isHabis = p.stock == 0;
            let classV = isHabis ? 'variant-disabled bg-slate-800/20 border-slate-800 text-slate-500' : 'variant-card bg-slate-800/40 border-slate-700 hover:border-violet-500';
            let desc = p.description ? p.description.replace(/'/g, "\\'") : 'Tidak ada deskripsi.';

            html += `
                <div ${isHabis ? '' : `onclick="goCheckout(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.sell_price}, '${desc}', true)"`} class="${classV} flex justify-between items-center p-4 rounded-2xl border mb-3">
                    <div class="pr-3 w-3/4">
                        <h4 class="text-sm font-bold ${isHabis ? 'text-slate-500' : 'text-white'} mb-1 leading-tight truncate">${p.name}</h4>
                        ${p.description ? `<p class="text-[9px] ${isHabis ? 'text-slate-600' : 'text-slate-400'} line-clamp-1 mb-2">${p.description}</p>` : ''}
                        <span class="text-[9px] font-bold ${isHabis ? 'text-red-400 bg-red-500/10' : 'text-slate-400 bg-slate-800'} px-2 py-1 rounded uppercase inline-block">${isHabis ? 'Habis' : `Stok: ${p.stock}`}</span>
                    </div>
                    <div class="text-right whitespace-nowrap pl-2">
                        <span class="${isHabis ? 'text-slate-600' : 'text-blue-400'} font-extrabold text-sm block">Rp ${priceFormatted}</span>
                        <span class="text-[9px] ${isHabis ? 'text-slate-600' : 'text-violet-400'} uppercase font-bold mt-1 inline-block">${isHabis ? 'KOSONG' : `Pilih <i class="bi bi-arrow-right"></i>`}</span>
                    </div>
                </div>
            `;
        });
        document.getElementById('variantsContainer').innerHTML = html;
        
        stepChk.classList.add('hidden');
        stepVar.classList.remove('hidden');
        modal.classList.remove('hidden');
    }

    function goCheckout(id, name, price, desc, showBackButton) {
        document.getElementById('checkoutProdId').value = id;
        document.getElementById('checkoutProdName').innerText = name;
        document.getElementById('checkoutPrice').innerText = 'Rp ' + new Intl.NumberFormat('id-ID').format(price);
        
        const descEl = document.getElementById('checkoutProdDesc');
        if(desc && desc !== 'null' && desc !== 'undefined' && desc !== '') {
            descEl.innerHTML = desc;
            descEl.style.display = 'block';
        } else {
            descEl.style.display = 'none';
        }

        document.getElementById('btnBackVariant').style.display = showBackButton ? 'inline-flex' : 'none';

        stepVar.classList.add('hidden');
        stepChk.classList.remove('hidden');
        modal.classList.remove('hidden'); 
    }

    function backToVariants() {
        stepChk.classList.add('hidden');
        stepVar.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.querySelector('form').reset();
    }
</script>
</body>
</html>