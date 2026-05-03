// Komponen ini menggambar chart mock kecil tanpa library tambahan agar bundle tetap ringan.
interface MiniChartProps {
  bars: number[];
}

export function MiniChart({ bars }: MiniChartProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">Chart</p>
          <p className="text-sm text-white/75">Pergerakan mock saldo dan transaksi</p>
        </div>
        <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          Live Mock
        </span>
      </div>
      <div className="flex h-40 items-end gap-2">
        {bars.map((bar, index) => (
          <div key={index} className="flex-1">
            <div
              className="mx-auto w-full rounded-t-2xl bg-gradient-to-t from-brand-dark via-brand to-brand-light"
              style={{ height: `${bar}%`, minHeight: '16px' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
