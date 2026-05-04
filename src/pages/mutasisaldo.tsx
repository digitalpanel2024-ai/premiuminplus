import { ArrowDownRight, ArrowUpRight, Filter, ReceiptText, WalletCards } from 'lucide-react';
import { PageHero, PageSection, NeonCard } from './dashboardPageKit';
import { formatCurrency } from '../utils/format';

const summary = [
  { label: 'Total Uang Masuk', value: 101344, icon: ArrowUpRight, tone: 'text-emerald-300 bg-emerald-500/10 ring-emerald-500/20' },
  { label: 'Total Uang Keluar', value: 51000, icon: ArrowDownRight, tone: 'text-rose-300 bg-rose-500/10 ring-rose-500/20' },
  { label: 'Saldo Bersih', value: 50344, icon: WalletCards, tone: 'text-brand bg-brand/10 ring-brand/20' },
];

const movements = [
  {
    time: '04 May 2026 - 22:14',
    type: 'Keluar',
    title: 'Order API: Viu Premium Lifetime',
    note: 'Debit transaksi berhasil dipotong dari saldo utama.',
    amount: 5950,
  },
  {
    time: '03 May 2026 - 18:42',
    type: 'Keluar',
    title: 'Order API: ChatGPT Plus',
    note: 'Pembayaran order berjalan normal dan tercatat rapi.',
    amount: 5500,
  },
  {
    time: '01 May 2026 - 09:10',
    type: 'Masuk',
    title: 'Deposit Auto INV1204020625309327',
    note: 'Saldo bertambah dari top up otomatis via QRIS.',
    amount: 1921,
  },
  {
    time: '30 Apr 2026 - 16:25',
    type: 'Masuk',
    title: 'Refund minor',
    note: 'Kredit penyesuaian dari transaksi yang dibatalkan.',
    amount: 5000,
  },
];

const filters = ['Semua', 'Masuk', 'Keluar', 'Tertunda'];

export default function MutasiSaldo() {
  return (
    <div className="mutasi-saldo">
      <PageHero
        title="Mutasi Saldo"
        subtitle="Mutasi ditata seperti catatan keuangan yang ringkas dan tenang."
        slogan="Masuk, keluar, dan saldo bersih tampil jelas tanpa berisik."
        tone="from-brand/15 via-violet-500/10 to-sky-500/10"
        chips={['Ledger ringan', 'Filter cepat', 'Saldo bersih']}
      />
      <div className="mt-4">
      <PageSection title="Pergerakan saldo" subtitle="Pergerakan saldo dan jejak transaksi">
        <div className="mb-4 rounded-[1.4rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,0,127,0.10),rgba(14,165,233,0.10))] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">Dasar mutasi</p>
          <h3 className="mt-2 text-2xl font-extrabold text-white">Masuk, keluar, dan status transaksi tampil lebih jelas.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
            Halaman ini dibuat untuk membantu membaca alur saldo secara cepat. Setiap baris menampilkan waktu, arah mutasi, konteks transaksi, dan catatan singkat agar mudah dicek ulang.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {summary.map((item) => {
            const Icon = item.icon;
            return (
              <NeonCard key={item.label}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${item.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{item.label}</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-white">{formatCurrency(item.value)}</p>
              </NeonCard>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white/55">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter cepat</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((item, index) => (
              <button
                key={item}
                type="button"
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  index === 0 ? 'border-brand/20 bg-brand/10 text-white' : 'border-white/10 bg-white/5 text-white/65 hover:bg-white/10'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {movements.map((item) => (
            <NeonCard key={item.title + item.time}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                      item.type === 'Masuk' ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border border-rose-500/20 bg-rose-500/10 text-rose-300'
                    }`}>
                      {item.type}
                    </span>
                    <p className="text-xs text-white/40">{item.time}</p>
                  </div>
                  <h4 className="mt-3 text-base font-bold text-white">{item.title}</h4>
                  <p className="mt-1 text-sm leading-6 text-white/55">{item.note}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3 md:text-right">
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Nominal</p>
                    <p className="mt-1 text-lg font-extrabold text-white">
                      {item.type === 'Keluar' ? '-' : '+'}
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                </div>
              </div>
            </NeonCard>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
          <NeonCard>
            <div className="flex items-center gap-3">
              <ReceiptText className="h-5 w-5 text-brand" />
              <div>
                <p className="text-sm font-semibold text-white">Catatan mutasi</p>
                <p className="mt-1 text-sm leading-6 text-white/55">Cocok untuk cek histori saldo, validasi pembayaran, dan pemantauan transaksi harian.</p>
              </div>
            </div>
          </NeonCard>
          <NeonCard className="flex items-center gap-3">
            <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/75">Prev</button>
            <span className="text-sm text-white/55">Halaman 1 dari 4</span>
            <button className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">Next</button>
          </NeonCard>
        </div>
      </PageSection>
      </div>
    </div>
  );
}
