import { useState } from 'react';
import { MessageCircle, Minus, Phone, Plus, ShieldCheck, ShoppingBag, ShoppingCart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PageHero, NeonCard, products } from './dashboardPageKit';
import { formatCurrency } from '../utils/format';

const waOrderLink = 'https://wa.me/6285888009931?text=Masih%20ada%20slot%20join%20reseller%20%3F';

export default function Order() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [qty, setQty] = useState(1);
  const total = selectedProduct.price * qty;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="order space-y-4">
      <PageHero
        title="Order Akun"
        subtitle="Pilih layanan, atur qty, lalu kirim pesanan dengan alur yang cepat dan rapi."
        slogan="Cepat diproses, jelas detailnya, dan tetap nyaman dilihat di desktop maupun HP."
        tone="from-emerald-500/15 via-sky-500/10 to-brand/10"
        chips={['Produk premium', 'Checkout ringkas', 'Support WA']}
      />

      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <NeonCard className="overflow-hidden">
          <div className="flex h-full flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Preview layanan</p>
                <h3 className="text-lg font-extrabold text-white">{selectedProduct.name}</h3>
              </div>
            </div>
            <div className="rounded-[1.05rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(14,165,233,0.08))] p-5 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Harga layanan</p>
              <p className="mt-3 text-3xl font-black text-white">{formatCurrency(selectedProduct.price)}</p>
              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/55">{selectedProduct.note}. Produk dikirim setelah order masuk ke antrian.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Saldo kamu</p>
                <p className="mt-2 text-lg font-black text-white">Rp50.344</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Status</p>
                <p className="mt-2 text-lg font-black text-emerald-300">Siap order</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-brand/20 bg-brand/10 px-4 py-3 text-sm text-white/75">
              <Sparkles className="h-4 w-4 text-brand-light" />
              Pesanan yang jelas biasanya lebih cepat diproses.
            </div>
          </div>
        </NeonCard>

        <NeonCard>
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Detail Order</h3>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">Jenis layanan</p>
              <p className="mt-1 text-sm font-bold text-white">Akun digital</p>
            </div>
          </div>

          <div className="mt-4 space-y-3.5">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Pilih layanan</span>
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
        </NeonCard>
      </div>

      <section className="rounded-[1.25rem] border border-emerald-500/20 bg-[linear-gradient(145deg,rgba(16,185,129,0.12),rgba(14,165,233,0.08))] p-4">
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
          <a href={waOrderLink} target="_blank" rel="noreferrer" className="inline-flex min-w-[220px] items-center justify-center gap-2.5 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01]">
            <MessageCircle className="h-5 w-5" />
            Chat WhatsApp
          </a>
        </div>
      </section>
    </motion.div>
  );
}
