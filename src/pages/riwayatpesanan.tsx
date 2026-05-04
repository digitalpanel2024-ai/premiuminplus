import { PageHero, PageSection, TimelineList, orderHistory } from './dashboardPageKit';

export default function RiwayatPesanan() {
  return (
    <div className="riwayat-pesanan">
      <PageHero
        title="Riwayat Pesanan"
        subtitle="Histori order diringkas dalam kartu yang enak dipindai."
        slogan="Jejak pesanan terlihat jelas, dari pending sampai sukses."
        tone="from-violet-500/15 via-fuchsia-500/10 to-brand/10"
        chips={['Order history', 'Status jelas', 'Rapi di HP']}
      />
      <div className="mt-4">
        <PageSection title="Daftar transaksi" subtitle="History transaksi order">
          <TimelineList items={orderHistory} />
        </PageSection>
      </div>
    </div>
  );
}
