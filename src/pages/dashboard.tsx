import { BarChart3, ClipboardList, Coins, ShoppingCart, Sparkles } from 'lucide-react';
import { PageHero, PageSection, NeonCard } from './dashboardPageKit';
import { formatCurrency } from '../utils/format';

const stats = [
  { label: 'Total Deposit', value: 92142, icon: Coins, tone: 'text-emerald-300 bg-emerald-500/10 ring-emerald-500/20' },
  { label: 'Total Belanja', value: 40000, icon: ShoppingCart, tone: 'text-brand bg-brand/10 ring-brand/20' },
  { label: 'Total Pesanan', value: 25, icon: ClipboardList, tone: 'text-sky-300 bg-sky-500/10 ring-sky-500/20' },
  { label: 'Produk Aktif', value: 30, icon: BarChart3, tone: 'text-amber-300 bg-amber-500/10 ring-amber-500/20' },
];

export default function Dashboard() {
  return (
    <div className="dashboard space-y-5">
      <PageHero
        title="Dasbor"
        subtitle="Ringkasan aplikasi disusun agar cepat dibaca dan tetap enak dilihat."
        slogan="Status inti, saldo, dan performa tersedia dalam satu tampilan yang tenang."
        tone="from-brand/15 via-sky-500/10 to-emerald-500/10"
        chips={['Overview', 'Status inti', 'Neon clean']}
      />
      <PageSection title="Dashboard" subtitle="Overview aplikasi">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <NeonCard key={item.label}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${item.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{item.label}</p>
                <p className="mt-2 text-xl font-extrabold tracking-tight text-white">
                  {item.value > 1000 ? formatCurrency(item.value) : item.value}
                </p>
                <p className="mt-2 text-xs leading-5 text-white/45">
                  {item.label === 'Total Deposit'
                    ? 'Aliran masuk yang stabil dan mudah dipantau.'
                    : item.label === 'Total Belanja'
                      ? 'Belanja produk aktif yang sudah terproses.'
                      : item.label === 'Total Pesanan'
                        ? 'Semua pesanan yang tercatat dalam periode ini.'
                        : 'Layanan yang saat ini tampil aktif di panel.'}
                </p>
              </NeonCard>
            );
          })}
        </div>
      </PageSection>

      <section className="rounded-[1.25rem] border border-brand/20 bg-[linear-gradient(145deg,rgba(255,0,127,0.12),rgba(14,165,233,0.08))] p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Premiumin Plus aktif</h3>
            <p className="mt-1 text-sm text-white/55">Ringkasan saldo, transaksi, produk, dan akses API tersedia dalam satu dashboard gelap bernuansa neon.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
