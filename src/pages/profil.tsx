import { BadgeCheck, CalendarClock, Coins, CreditCard, History, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { PageHero, PageSection, NeonCard } from './dashboardPageKit';
import { formatCurrency } from '../utils/format';

const metrics = [
  { label: 'Saldo Aktif', value: 61344, icon: Wallet, tone: 'text-emerald-300 bg-emerald-500/10 ring-emerald-500/20' },
  { label: 'Transaksi Berhasil', value: 128, icon: BadgeCheck, tone: 'text-sky-300 bg-sky-500/10 ring-sky-500/20' },
  { label: 'Deposit Masuk', value: 18, icon: Coins, tone: 'text-brand bg-brand/10 ring-brand/20' },
  { label: 'Order Selesai', value: 97, icon: CreditCard, tone: 'text-amber-300 bg-amber-500/10 ring-amber-500/20' },
];

const accountDetails = [
  { label: 'Username', value: 'digitalpanel123' },
  { label: 'Role', value: 'Member' },
  { label: 'Status', value: 'Aktif' },
  { label: 'Level', value: 'Premium User' },
  { label: 'Nomor WA', value: '6285888009931' },
  { label: 'Last Login', value: '04 May 2026 - 21:40' },
];

const recentActivity = [
  { title: 'Order berhasil', note: 'Capcut 30 Day diproses tanpa kendala.', time: '04 May 2026 - 21:18' },
  { title: 'Deposit masuk', note: 'Top up QRIS terverifikasi otomatis.', time: '04 May 2026 - 19:02' },
  { title: 'Login aman', note: 'Perangkat yang dikenal masih aktif.', time: '04 May 2026 - 08:10' },
];

export default function Profil() {
  return (
    <div className="profil">
      <PageHero
        title="Profil"
        subtitle="Profil dibuat seperti dashboard mini berisi data inti akun."
        slogan="Saldo, transaksi, dan aktivitas terakhir tampil dalam satu napas."
        tone="from-fuchsia-500/15 via-brand/10 to-sky-500/10"
        chips={['Data akun', 'Ringkasan performa', 'Aktivitas terbaru']}
      />
      <div className="mt-4">
      <PageSection title="Ringkasan akun" subtitle="Ringkasan akun dan aktivitas">
        <div className="mb-4 rounded-[1.4rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,0,127,0.12),rgba(14,165,233,0.10))] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">Sub data akun</p>
          <h3 className="mt-2 text-2xl font-extrabold text-white">Semua info inti akun ada di satu tempat.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
            Bagian ini menampilkan saldo aktif, jumlah transaksi berhasil, deposit masuk, dan aktivitas terakhir agar profil terasa lebih hidup dan lebih berguna untuk dipantau.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <NeonCard key={item.label}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${item.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{item.label}</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-white">
                  {item.label === 'Saldo Aktif' ? formatCurrency(item.value) : item.value}
                </p>
              </NeonCard>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <NeonCard>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <p className="text-sm font-semibold text-white">Detail akun</p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {accountDetails.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </NeonCard>

          <NeonCard>
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-brand" />
              <p className="text-sm font-semibold text-white">Aktivitas terbaru</p>
            </div>
            <div className="mt-4 space-y-3">
              {recentActivity.map((item) => (
                <div key={item.title + item.time} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-white/55">{item.note}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                      Baru
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </NeonCard>
        </div>

        <div className="mt-4 rounded-[1.4rem] border border-brand/20 bg-[linear-gradient(145deg,rgba(255,0,127,0.10),rgba(255,255,255,0.03))] p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-brand-light" />
            <p className="text-sm font-semibold text-white">Ringkasan cepat</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Profil ini disusun agar user bisa langsung lihat status akun, performa transaksi, dan kondisi saldo tanpa harus pindah halaman.
          </p>
        </div>
      </PageSection>
      </div>
    </div>
  );
}
