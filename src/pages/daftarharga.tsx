import { PageHero, PageSection, ProductList } from './dashboardPageKit';

export default function DaftarHarga() {
  return (
    <div className="daftar-harga">
      <PageHero
        title="Daftar Harga"
        subtitle="Daftar layanan dibuat ringkas, nyaman dibaca, dan enak dipindai."
        slogan="Harga jelas, tampilan tenang, dan susunan produk tetap rapi."
        tone="from-sky-500/15 via-cyan-500/10 to-brand/10"
        chips={['Ringkas', 'Harga jelas', 'Scannable']}
      />
      <div className="mt-4">
        <PageSection title="Katalog produk" subtitle="Produk aktif">
        <ProductList />
        </PageSection>
      </div>
    </div>
  );
}
