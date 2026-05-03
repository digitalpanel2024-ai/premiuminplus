import { useLocation, useNavigate } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import {
  Banknote,
  BarChart3,
  BookText,
  Bot,
  ClipboardList,
  Coins,
  Code2,
  ArrowRight,
  AlertTriangle,
  Crown,
  FileText,
  HelpCircle,
  History,
  Layers3,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Send,
  Users,
  Wallet,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AppShell, type NavSection } from '../components/layout/AppShell';
import { ApiKeyCard } from '../components/ApiKeyCard';
import { formatCurrency, formatNumber, getGreeting } from '../utils/format';
import cardArt from '../asset/logo-upscale.png';

// Dashboard utama dibangun sebagai panel premium dengan hero, kartu saldo, statistik, dan menu halaman turunan.
interface DashboardPageProps {
  session: {
    username: string;
    role: string;
  };
  onLogout: () => void;
}

const sections: NavSection[] = [
  {
    label: 'Utama',
    items: [
      { label: 'Dasbor', to: '/dashboard', icon: Layers3, end: true },
      { label: 'Komunitas WA', to: '/dashboard/komunitas-wa', icon: MessageCircle },
    ],
  },
  {
    label: 'Transaksi',
    items: [
      { label: 'Order Akun', to: '/dashboard/order-akun', icon: ShoppingBag },
      { label: 'Deposit Saldo', to: '/dashboard/deposit-saldo', icon: Wallet },
      { label: 'Daftar Harga', to: '/dashboard/daftar-harga', icon: ReceiptText },
      { label: 'Tarik Saldo', to: '/dashboard/tarik-saldo', icon: Banknote },
      { label: 'Riwayat Pesanan', to: '/dashboard/riwayat-pesanan', icon: ClipboardList },
      { label: 'Riwayat Deposit', to: '/dashboard/riwayat-deposit', icon: Coins },
      { label: 'Mutasi Saldo', to: '/dashboard/mutasi-saldo', icon: ShoppingCart },
    ],
  },
  {
    label: 'Akun',
    items: [
      { label: 'Profil', to: '/dashboard/profil', icon: Users },
      { label: 'Laporan Kendala', to: '/dashboard/laporan-kendala', icon: ShieldCheck },
      { label: 'Bot WA & Telegram', to: '/dashboard/bot-wa-telegram', icon: Bot },
      { label: 'Document', to: '/dashboard/document', icon: BookText },
    ],
  },
];

const topSpenders = [
  { rank: 1, name: '6289 xxx 38', amount: 20000, badge: 'text-amber-400' },
  { rank: 2, name: '6287 xxx 45', amount: 20000, badge: 'text-slate-300' },
  { rank: 3, name: '6282 xxx 57', amount: 18000, badge: 'text-orange-300' },
];

const recentOrders = [
  { product: 'Viu Premium Lifetime', time: '01 May 2026, 02:37', price: 550, status: 'Sukses' },
  { product: 'HMA VPN 1 Bulan', time: '30 Apr 2026, 20:25', price: 4000, status: 'Sukses' },
  { product: 'Link ChatGPT Go 3 Bulan', time: '30 Apr 2026, 20:07', price: 3000, status: 'Sukses' },
];

const stats = [
  { label: 'Total Deposit', value: 92142, icon: Coins, tone: 'emerald' as const, suffix: '', line: [18, 20, 17, 26, 21, 23, 20, 28, 25, 29] },
  { label: 'Total Belanja', value: 40000, icon: ShoppingCart, tone: 'pink' as const, suffix: '', line: [10, 13, 14, 11, 16, 12, 15, 14, 18, 20] },
  { label: 'Total Pesanan', value: 25, icon: ClipboardList, tone: 'blue' as const, suffix: 'Trx', line: [8, 10, 9, 12, 11, 12, 13, 14, 16, 18] },
  { label: 'Produk Aktif', value: 30, icon: BarChart3, tone: 'amber' as const, suffix: 'Layanan', line: [12, 13, 12, 14, 13, 15, 14, 16, 17, 18] },
];

const products = [
  { name: 'Capcut 7 Day', price: 5900, note: 'Paling populer', tag: 'Instan' },
  { name: 'Capcut 30 Day', price: 14900, note: 'Lebih hemat', tag: 'Best' },
  { name: 'Netflix', price: 25900, note: 'Multi device', tag: 'Premium' },
  { name: 'ChatGPT 1 Bulan', price: 34900, note: 'Akses cepat', tag: 'AI' },
  { name: 'YouTube Premium', price: 29900, note: 'Tanpa iklan', tag: 'Video' },
];

const waOrderLink = 'https://wa.me/6285888009931?text=Masih%20ada%20slot%20join%20reseller%20%3F';

const quickDeposits = [10000, 25000, 50000, 100000, 250000, 500000];
const waDepositLink = 'https://wa.me/6285888009931?text=Halo%20Admin%2C%20saya%20ingin%20top%20up%20saldo.';

const orderHistory = [
  { title: 'Capcut 30 Day', time: '01 Mei 2026, 10:12', amount: 14900, status: 'Sukses' },
  { title: 'Netflix', time: '01 Mei 2026, 09:54', amount: 25900, status: 'Sukses' },
  { title: 'ChatGPT 1 Bulan', time: '30 Apr 2026, 21:32', amount: 34900, status: 'Pending' },
];

const depositHistory = [
  { title: 'Deposit QRIS', time: '01 Mei 2026, 08:40', amount: 50000, status: 'Sukses' },
  { title: 'Deposit Transfer', time: '30 Apr 2026, 19:20', amount: 100000, status: 'Sukses' },
  { title: 'Deposit E-Wallet', time: '30 Apr 2026, 17:05', amount: 25000, status: 'Pending' },
];

const mutationHistory = [
  { title: 'Order Capcut 30 Day', type: 'Debit', amount: 14900, time: '01 Mei 2026, 10:12' },
  { title: 'Refund Test', type: 'Credit', amount: 5000, time: '01 Mei 2026, 09:10' },
  { title: 'Deposit QRIS', type: 'Credit', amount: 50000, time: '01 Mei 2026, 08:40' },
];

const profileItems = [
  { label: 'Username', value: 'digitalpanel123' },
  { label: 'Role', value: 'Member' },
  { label: 'Status', value: 'Aktif' },
  { label: 'Level', value: 'Premium User' },
];

const supportTopics = [
  'Login gagal',
  'Order pending',
  'Deposit belum masuk',
  'Harga produk berubah',
];

const botLinks = [
  {
    title: 'Buat Akun Bot WA',
    description: 'Siapkan bot WhatsApp untuk notifikasi dan order otomatis.',
    href: 'https://wa.me/6285888009931?text=Masih%20ada%20slot%20join%20reseller%20%3F',
    icon: MessageCircle,
  },
  {
    title: 'Buat Bot Telegram',
    description: 'Tambahkan bot Telegram untuk notifikasi dan integrasi channel.',
    href: 'https://t.me/+1tkWNfTUfEg1MTY1',
    icon: Send,
  },
];

const docsList = [
  { title: 'API Docs', desc: 'Panduan endpoint dan struktur request mock.' },
  { title: 'Webhook', desc: 'Contoh payload notifikasi transaksi.' },
  { title: 'Status API', desc: 'Daftar status sukses, pending, dan gagal.' },
];

const pageTitles: Record<string, string> = {
  '/dashboard/komunitas-wa': 'Komunitas WA',
  '/dashboard/order-akun': 'Order Akun',
  '/dashboard/deposit-saldo': 'Deposit Saldo',
  '/dashboard/daftar-harga': 'Daftar Harga',
  '/dashboard/tarik-saldo': 'Tarik Saldo',
  '/dashboard/riwayat-pesanan': 'Riwayat Pesanan',
  '/dashboard/riwayat-deposit': 'Riwayat Deposit',
  '/dashboard/mutasi-saldo': 'Mutasi Saldo',
  '/dashboard/profil': 'Profil',
  '/dashboard/laporan-kendala': 'Laporan Kendala',
  '/dashboard/bot-wa-telegram': 'Bot WA & Telegram',
  '/dashboard/document': 'Document',
};

function Sparkline({ points }: { points: number[] }) {
  const width = 180;
  const height = 48;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(max - min, 1);
  const step = width / (points.length - 1);
  const path = points
    .map((point, index) => {
      const x = index * step;
      const y = height - ((point - min) / range) * (height - 6) - 3;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-12 w-full">
      <path d={path} fill="none" stroke="rgba(255,0,127,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_0_30px_rgba(255,0,127,0.05)]"
    >
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">{subtitle}</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function LinkCard({
  title,
  description,
  href,
  icon: Icon,
  tone,
}: {
  title: string;
  description: string;
  href: string;
  icon: typeof MessageCircle;
  tone: string;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`rounded-[1.35rem] border border-white/10 bg-[#0f0b15] p-5 transition-shadow duration-200 hover:shadow-lg ${tone}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="mt-1 text-sm text-white/45">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm font-semibold text-brand">Buka link</div>
    </motion.a>
  );
}

function ProductList({
  items,
  cta = 'Order Sekarang',
}: {
  items: { name: string; price: number; note: string; tag: string }[];
  cta?: string | null;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.name} className="rounded-[1.2rem] border border-white/10 bg-[#0f0b15] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{item.name}</p>
              <p className="mt-1 text-xs text-white/40">{item.note}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">{formatCurrency(item.price)}</p>
              <span className="mt-1 inline-flex rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                {item.tag}
              </span>
            </div>
          </div>
          {cta ? (
            <button className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10">
              {cta}
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ListTimeline({
  items,
}: {
  items: { title: string; time: string; amount: number; status: string }[];
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.title + item.time} className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-white/10 bg-[#0f0b15] px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-white">{item.title}</p>
            <p className="mt-1 text-xs text-white/40">{item.time}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-white">{formatCurrency(item.amount)}</p>
            <span className="mt-1 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MenuPage({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <SectionShell title={title} subtitle={subtitle}>
        {children}
      </SectionShell>
    </motion.div>
  );
}

function OrderCheckout() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [qty, setQty] = useState(1);
  const total = selectedProduct.price * qty;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-4 xl:max-h-[calc(100vh-112px)] xl:overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Checkout Produk</h2>
          <p className="mt-1 text-xs text-white/55">Selesaikan pesanan kamu dalam beberapa langkah mudah.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          100% Secure Checkout
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <section className="min-h-[300px] rounded-[1.25rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,0,127,0.05))] p-4 shadow-[0_14px_32px_rgba(0,0,0,0.18)]">
          <div className="flex h-full flex-col justify-center rounded-[1rem] border border-white/10 bg-[#0f0b15]/70 p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/35">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-white">{selectedProduct.name}</h3>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/55">{selectedProduct.note}. Produk dikirim ke nomor WhatsApp setelah order diproses.</p>
            <div className="mx-auto mt-4 inline-flex items-center gap-3 rounded-xl border border-brand/20 bg-brand/10 px-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Harga</span>
              <strong className="text-xl text-brand">{formatCurrency(selectedProduct.price)}</strong>
            </div>
          </div>
        </section>

        <section className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 shadow-[0_14px_32px_rgba(0,0,0,0.18)]">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Order Detail</h3>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">Saldo Kamu</p>
              <p className="mt-1 text-lg font-black text-white">Rp50.344</p>
            </div>
          </div>

          <div className="mt-4 space-y-3.5">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Pilih Layanan</span>
              <select
                value={selectedProduct.name}
                onChange={(event) => {
                  const nextProduct = products.find((item) => item.name === event.target.value);
                  if (nextProduct) setSelectedProduct(nextProduct);
                }}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0f0b15] px-3.5 py-3 text-sm font-semibold text-white outline-none transition focus:border-brand/60"
              >
                {products.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} - {formatCurrency(item.price)}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-[1fr_132px]">
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Kirim ke WA</span>
                <div className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0f0b15] px-3.5 py-3 text-sm font-semibold text-white">
                  <MessageCircle className="h-4 w-4 text-emerald-300" />
                  6285888009931
                </div>
              </label>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Qty</span>
                <div className="mt-1.5 grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 bg-[#0f0b15]">
                  <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} className="grid h-[44px] place-items-center text-white/70 transition hover:bg-white/5">
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="grid h-[44px] place-items-center border-x border-white/10 text-sm font-bold text-white">{qty}</div>
                  <button type="button" onClick={() => setQty((value) => value + 1)} className="grid h-[44px] place-items-center text-white/70 transition hover:bg-white/5">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[#0b0f1a] px-4 py-3.5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Total Tagihan</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-300">{selectedProduct.name}</p>
                </div>
                <p className="text-2xl font-black text-white">{formatCurrency(total)}</p>
              </div>
            </div>

            <button className="w-full rounded-xl bg-brand px-5 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-lg shadow-brand/20 transition hover:scale-[1.01]">
              Order Sekarang
            </button>
          </div>
        </section>
      </div>

      <section className="rounded-[1.25rem] border border-emerald-500/20 bg-[linear-gradient(145deg,rgba(16,185,129,0.12),rgba(255,255,255,0.04))] p-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Masih ada pertanyaan?</h3>
              <p className="mt-1 max-w-lg text-xs leading-5 text-white/55">Konsultasikan kebutuhanmu langsung ke tim kami via WhatsApp.</p>
            </div>
          </div>
          <a
            href={waOrderLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-w-[220px] items-center justify-center gap-2.5 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01]"
          >
            <MessageCircle className="h-5 w-5" />
            Chat WhatsApp
          </a>
        </div>
      </section>
    </motion.div>
  );
}

function DepositTopup() {
  const [amount, setAmount] = useState(25000);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-4 xl:max-h-[calc(100vh-112px)] xl:overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Isi Saldo <span className="text-brand">Otomatis</span>
          </h2>
          <p className="mt-1 text-xs text-white/55">Top up saldo instan 24 jam via QRIS, e-wallet, dan mobile banking.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-light">
          <Sparkles className="h-3.5 w-3.5" />
          QRIS Payment
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
        <section className="rounded-[1.25rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,0,127,0.04))] p-5 shadow-[0_14px_32px_rgba(0,0,0,0.18)]">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">Nominal Deposit</span>
            <div className="mt-3 flex items-center rounded-xl border border-white/10 bg-[#0b0f1a] px-4 py-4">
              <span className="text-2xl font-black text-white/70">Rp</span>
              <input
                value={amount.toLocaleString('id-ID')}
                onChange={(event) => {
                  const numeric = Number(event.target.value.replace(/\D/g, '')) || 0;
                  setAmount(Math.min(numeric, 1000000));
                }}
                className="ml-2 w-full bg-transparent text-3xl font-black text-white outline-none"
                inputMode="numeric"
                aria-label="Nominal deposit"
              />
            </div>
          </label>

          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-white/55">
            <span className="inline-flex items-center gap-2">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-brand text-[10px] font-bold text-white">i</span>
              Minimal Rp1.000
            </span>
            <span>Maks Rp1.000.000</span>
          </div>

          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">Pilihan Cepat</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {quickDeposits.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value)}
                  className={`rounded-xl border px-3 py-4 text-center transition ${
                    amount === value
                      ? 'border-brand bg-brand/10 text-brand shadow-[0_0_24px_rgba(255,0,127,0.14)]'
                      : 'border-white/10 bg-[#0b0f1a]/70 text-white hover:border-white/20'
                  }`}
                >
                  <span className="block text-xs text-white/50">+ Rp</span>
                  <strong className="mt-1 block text-lg">{formatNumber(value)}</strong>
                </button>
              ))}
            </div>
          </div>

          <button className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-brand px-5 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-lg shadow-brand/20 transition hover:scale-[1.01]">
            Lanjut Pembayaran
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>

        <section className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5 shadow-[0_14px_32px_rgba(0,0,0,0.18)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Cara Pembayaran</h3>
          </div>

          <div className="mt-6 space-y-5">
            {[
              'Sistem akan men-generate QRIS dinamis. Anda bebas scan menggunakan DANA, GoPay, OVO, ShopeePay, atau mobile banking.',
              'Pastikan nominal transfer SAMA PERSIS hingga 3 digit terakhir. Jika tidak sesuai, saldo tidak masuk otomatis.',
              'Saldo bertambah otomatis ke akun Anda dalam waktu 1 - 5 menit setelah pembayaran berhasil divalidasi.',
            ].map((text, index) => (
              <div key={text} className="grid grid-cols-[34px_1fr] gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand/20 text-sm font-black text-brand-light">{index + 1}</span>
                <p className="text-sm leading-6 text-white/70">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-200">
            <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-300" />
            <p>Jika saldo belum masuk lebih dari 10 menit, segera hubungi admin via WhatsApp dengan menyertakan bukti transfer.</p>
          </div>
        </section>
      </div>

      <section className="rounded-[1.25rem] border border-brand/25 bg-[linear-gradient(145deg,rgba(255,0,127,0.12),rgba(255,255,255,0.035))] p-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Butuh Bantuan?</h3>
              <p className="mt-1 max-w-lg text-xs leading-5 text-white/55">Konsultasikan kebutuhanmu langsung ke tim kami via WhatsApp.</p>
            </div>
          </div>
          <a
            href={waDepositLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-w-[220px] items-center justify-center gap-2.5 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01]"
          >
            <MessageCircle className="h-5 w-5" />
            Chat WhatsApp
          </a>
        </div>
      </section>
    </motion.div>
  );
}

export function DashboardPage({ session, onLogout }: DashboardPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.replace(/\/+$/, '') || '/dashboard';
  const accountLabel = session.role === 'admin' ? 'Admin' : session.role === 'reseller' ? 'Reseller' : 'Member';
  const greeting = getGreeting();

  const section = path === '/dashboard' ? null : path;

  const sectionContent: Record<string, ReactNode> = {
    '/dashboard/komunitas-wa': (
      <MenuPage title="Komunitas" subtitle="Menu komunitas resellers">
        <div className="grid gap-4 md:grid-cols-2">
          <LinkCard
            title="Grup Reseller WhatsApp"
            description="Gabung komunitas reseller untuk update dan diskusi cepat."
            href="https://chat.whatsapp.com/Igg1KjY54I3A2ERIgofm4b"
            icon={MessageCircle}
            tone=""
          />
          <LinkCard
            title="Grup Telegram"
            description="Channel alternatif untuk update dan pengumuman."
            href="https://t.me/+1tkWNfTUfEg1MTY1"
            icon={Send}
            tone=""
          />
        </div>
      </MenuPage>
    ),
    '/dashboard/order-akun': <OrderCheckout />,
    '/dashboard/deposit-saldo': <DepositTopup />,
    '/dashboard/daftar-harga': (
      <MenuPage title="Daftar Harga" subtitle="List produk dan harga">
        <ProductList items={products} cta={null} />
      </MenuPage>
    ),
    '/dashboard/tarik-saldo': (
      <MenuPage title="Tarik Saldo" subtitle="Riwayat dan opsi tarik saldo">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.2rem] border border-white/10 bg-[#0f0b15] p-4">
            <p className="text-sm font-semibold text-white">Ringkasan Saldo</p>
            <div className="mt-4 space-y-3 text-sm text-white/60">
              <div className="flex items-center justify-between">
                <span>Saldo tersedia</span>
                <b className="text-white">{formatCurrency(61344)}</b>
              </div>
              <div className="flex items-center justify-between">
                <span>Minimal tarik</span>
                <b className="text-white">{formatCurrency(50000)}</b>
              </div>
            </div>
          </div>
          <div className="rounded-[1.2rem] border border-white/10 bg-[#0f0b15] p-4">
            <p className="text-sm font-semibold text-white">Checklist</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>Pastikan rekening aktif.</li>
              <li>Nama pemilik sesuai akun.</li>
              <li>Verifikasi manual ringan.</li>
            </ul>
          </div>
        </div>
      </MenuPage>
    ),
    '/dashboard/riwayat-pesanan': (
      <MenuPage title="Riwayat Pesanan" subtitle="History transaksi order">
        <ListTimeline items={orderHistory} />
      </MenuPage>
    ),
    '/dashboard/riwayat-deposit': (
      <MenuPage title="Riwayat Deposit" subtitle="History deposit saldo">
        <ListTimeline items={depositHistory} />
      </MenuPage>
    ),
    '/dashboard/mutasi-saldo': (
      <MenuPage title="Mutasi Saldo" subtitle="Pergerakan saldo terbaru">
        <div className="space-y-3">
          {mutationHistory.map((item) => (
            <div key={item.title + item.time} className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-white/10 bg-[#0f0b15] px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs text-white/40">{item.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{formatCurrency(item.amount)}</p>
                <span className="mt-1 inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                  {item.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </MenuPage>
    ),
    '/dashboard/profil': (
      <MenuPage title="Profil" subtitle="Informasi akun pengguna">
        <div className="grid gap-4 md:grid-cols-2">
          {profileItems.map((item) => (
            <div key={item.label} className="rounded-[1.2rem] border border-white/10 bg-[#0f0b15] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/35">{item.label}</p>
              <p className="mt-2 text-base font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </MenuPage>
    ),
    '/dashboard/laporan-kendala': (
      <MenuPage title="Laporan Kendala" subtitle="Form laporan masalah">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.2rem] border border-white/10 bg-[#0f0b15] p-4">
            <div className="grid gap-3">
              <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none" placeholder="Judul kendala" />
              <textarea className="min-h-32 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none" placeholder="Jelaskan kendala di sini" />
              <button className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">Kirim Laporan</button>
            </div>
          </div>
          <div className="rounded-[1.2rem] border border-white/10 bg-[#0f0b15] p-4">
            <p className="text-sm font-semibold text-white">Topik cepat</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {supportTopics.map((topic) => (
                <span key={topic} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </MenuPage>
    ),
    '/dashboard/bot-wa-telegram': (
      <MenuPage title="Bot WA & Telegram" subtitle="Buat akun bot untuk notifikasi">
        <div className="grid gap-4 md:grid-cols-2">
          {botLinks.map((item) => (
            <LinkCard key={item.title} title={item.title} description={item.description} href={item.href} icon={item.icon} tone="" />
          ))}
        </div>
      </MenuPage>
    ),
    '/dashboard/document': (
      <MenuPage title="Document" subtitle="Dokumentasi ringkas">
        <div className="grid gap-4 md:grid-cols-3">
          {docsList.map((item) => (
            <div key={item.title} className="rounded-[1.2rem] border border-white/10 bg-[#0f0b15] p-4">
              <div className="flex items-center gap-2 text-brand">
                <FileText className="h-4 w-4" />
                <p className="text-sm font-semibold text-white">{item.title}</p>
              </div>
              <p className="mt-3 text-sm text-white/45">{item.desc}</p>
            </div>
          ))}
        </div>
      </MenuPage>
    ),
  };

  if (section) {
    return (
      <AppShell
        title={pageTitles[path] || 'Menu'}
        subtitle={`${greeting}, ${session.username}. ${accountLabel} mode aktif.`}
        username={session.username}
        role={accountLabel}
        sections={sections}
        onLogout={onLogout}
      >
        {sectionContent[path as keyof typeof sectionContent] || (
          <SectionShell title="Konten" subtitle="Halaman menu">
            <p className="text-sm text-white/55">Konten belum tersedia.</p>
          </SectionShell>
        )}
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Dasbor"
      subtitle={`${greeting}, ${session.username}. Kelola transaksi dan akses API kamu dengan mudah di Premiumin Plus.`}
      username={session.username}
      role={accountLabel}
      sections={sections}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {greeting}, <span className="text-brand">{session.username}</span>
            </h2>
            <p className="mt-2 text-sm text-white/55 sm:text-base">
              Kelola transaksi dan akses API kamu dengan mudah di Premiumin Plus.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 lg:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            System Online
          </div>
        </div>

        <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-[1.55rem] border border-white/10 bg-[linear-gradient(145deg,rgba(15,11,21,0.96),rgba(13,9,18,0.98))] p-5 shadow-[0_0_32px_rgba(255,0,127,.06)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">Premiumin Card</p>
                <p className="mt-3 text-sm text-white/60">Saldo Tersedia</p>
                <div className="mt-1 flex items-end gap-2">
                  <span className="text-lg font-bold text-brand">Rp</span>
                  <span className="text-4xl font-black tracking-tight text-white">61.344</span>
                </div>
              </div>
              <button className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white/70 transition-transform duration-200 hover:scale-105">
                <Sparkles className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid items-center gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">Keseimbangan</p>
                <p className="mt-2 text-sm text-white/60">Saldo kartu utama</p>
                <p className="mt-1 text-2xl font-black text-white">{formatCurrency(55844)}</p>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">Card Holder</p>
                <p className="mt-1 text-base font-extrabold tracking-tight">{session.username.toUpperCase()}</p>
              </div>
              <img
                src={cardArt}
                alt="Premiumin Card"
                className="mx-auto h-44 w-full object-contain drop-shadow-[0_10px_26px_rgba(255,0,127,.22)]"
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => navigate('/dashboard/deposit-saldo')}
                className="rounded-2xl bg-brand px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-transform duration-200 hover:scale-[1.01]"
              >
                Isi Saldo
              </button>
              <button
                onClick={() => navigate('/dashboard/mutasi-saldo')}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-white/80 transition-transform duration-200 hover:scale-[1.01] hover:bg-white/10"
              >
                Mutasi
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.04 }}
          >
            <ApiKeyCard username={session.username} />
          </motion.div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;
            const toneClass =
              item.tone === 'emerald'
                ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20'
                : item.tone === 'pink'
                  ? 'bg-brand/10 text-brand ring-brand/20'
                  : item.tone === 'blue'
                    ? 'bg-sky-500/10 text-sky-300 ring-sky-500/20'
                    : 'bg-amber-500/10 text-amber-300 ring-amber-500/20';

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${toneClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{item.label}</p>
                    <p className="mt-2 text-xl font-extrabold tracking-tight text-white">
                      {typeof item.value === 'number' ? formatCurrency(item.value) : item.value}
                      {item.suffix ? <span className="ml-2 text-sm font-semibold text-white/55">{item.suffix}</span> : null}
                    </p>
                  </div>
                </div>
                <div className="mt-2 opacity-90">
                  <Sparkline points={item.line} />
                </div>
              </motion.div>
            );
          })}
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <SectionShell title="Top Sultan" subtitle="Top spender">
              <div className="space-y-3">
                {topSpenders.map((item) => (
                  <div key={item.rank} className="rounded-[1.2rem] border border-white/10 bg-[#0f0b15] px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-white/35">Top Spender</p>
                      </div>
                      <p className={`text-lg font-extrabold ${item.badge}`}>{formatNumber(item.amount / 1000)}k</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionShell>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
            <SectionShell title="Riwayat Terakhir" subtitle="Transaksi terbaru">
              <div className="space-y-4">
                {recentOrders.map((row) => (
                  <div key={row.product} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-white">{row.product}</p>
                      <p className="mt-1 text-xs text-white/35">{row.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{formatCurrency(row.price)}</p>
                      <span className="mt-1 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionShell>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
            <SectionShell title="API Console" subtitle="Developer access">
              <div className="rounded-[1.1rem] border border-white/10 bg-[#0b0f1a] p-4 font-mono text-[11px] leading-6 text-white/80">
                <div className="mb-3 flex items-center justify-between text-xs text-white/35">
                  <span className="flex items-center gap-2">
                    <Code2 className="h-3.5 w-3.5 text-brand" />
                    BASH
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/document')}
                    className="inline-flex items-center gap-1 rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-transform duration-200 hover:scale-105"
                  >
                    Docs
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <pre className="whitespace-pre-wrap">
{`curl -X POST \\
https://premiumin.plus/api/order \\
-H "Content-Type: application/json" \\
-d '{
  "api_key": "************",
  "product_id": "netflix_1b",
  "qty": 1
}'

developer@premiumin:~$`}
                </pre>
              </div>
            </SectionShell>
          </motion.div>
        </section>

        <footer className="py-2 text-center text-xs text-white/45">
          © 2026 Premiumin Plus. All rights reserved.
        </footer>
      </div>
    </AppShell>
  );
}
