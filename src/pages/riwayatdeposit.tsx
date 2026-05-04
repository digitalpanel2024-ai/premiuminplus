import { PageHero, PageSection, TimelineList, depositHistory } from './dashboardPageKit';

export default function RiwayatDeposit() {
  return (
    <div className="riwayat-deposit">
      <PageHero
        title="Riwayat Deposit"
        subtitle="Riwayat top up tampil lebih rapi dan mudah dicek ulang."
        slogan="Setiap deposit punya alur yang jelas, dari request sampai saldo masuk."
        tone="from-emerald-500/15 via-sky-500/10 to-cyan-500/10"
        chips={['Top up', 'Status pembayaran', 'Validasi cepat']}
      />
      <div className="mt-4">
        <PageSection title="Daftar deposit" subtitle="History deposit saldo">
          <TimelineList items={depositHistory} />
        </PageSection>
      </div>
    </div>
  );
}
