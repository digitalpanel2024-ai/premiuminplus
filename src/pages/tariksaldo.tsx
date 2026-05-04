import { Banknote, CheckCircle2 } from 'lucide-react';
import { PageHero, PageSection, NeonCard } from './dashboardPageKit';
import { formatCurrency } from '../utils/format';

export default function TarikSaldo() {
  return (
    <div className="tarik-saldo">
      <PageHero
        title="Tarik Saldo"
        subtitle="Penarikan saldo dibikin sederhana, jelas, dan aman dibaca."
        slogan="Langkah singkat, data cukup, dan tampilan tetap elegan."
        tone="from-amber-500/15 via-orange-500/10 to-brand/10"
        chips={['Sederhana', 'Aman dibaca', 'Cepat diajukan']}
      />
      <div className="mt-4">
      <PageSection title="Form penarikan" subtitle="Penarikan saldo pengguna">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <NeonCard>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
                <Banknote className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Saldo Tersedia</p>
                <p className="mt-1 text-2xl font-black text-white">{formatCurrency(61344)}</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm text-white/60">
              <div className="flex items-center justify-between"><span>Minimal tarik</span><b className="text-white">{formatCurrency(50000)}</b></div>
              <div className="flex items-center justify-between"><span>Biaya admin</span><b className="text-white">{formatCurrency(2500)}</b></div>
            </div>
          </NeonCard>

          <NeonCard>
            <div className="grid gap-3">
              <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-brand/50" placeholder="Nama bank atau e-wallet" />
              <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-brand/50" placeholder="Nomor rekening atau akun" />
              <input className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-brand/50" placeholder="Nominal penarikan" inputMode="numeric" />
              <button className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20">Ajukan Tarik Saldo</button>
            </div>
          </NeonCard>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {['Rekening aktif', 'Nama pemilik sesuai', 'Diproses manual cepat'].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              {item}
            </div>
          ))}
        </div>
      </PageSection>
      </div>
    </div>
  );
}
