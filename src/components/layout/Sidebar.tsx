import { NavLink } from 'react-router-dom';
import { CalendarClock, MessageCircle, Send, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { NavSection } from './AppShell';
import logoTransparent from '../../asset/logo-upscale.png';

// Komponen ini menampilkan menu samping dengan highlight aktif dan versi mobile drawer.
interface SidebarProps {
  open: boolean;
  sections: NavSection[];
  onClose: () => void;
}

type SaleItem = {
  buyer: string;
  product: string;
  channel: 'WA' | 'Telegram';
  time: string;
};

const products = ['Capcut 7 Day', 'Capcut 30 Day', 'Netflix', 'ChatGPT 1 Bulan', 'YouTube Premium'];
const channels: SaleItem['channel'][] = ['WA', 'Telegram'];

function makePhone() {
  const partA = 100 + Math.floor(Math.random() * 900);
  const partB = 10 + Math.floor(Math.random() * 90);
  return `+6285${partA}XXX`;
}

function makeSale(): SaleItem {
  return {
    buyer: makePhone(),
    product: products[Math.floor(Math.random() * products.length)],
    channel: channels[Math.floor(Math.random() * channels.length)],
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  };
}

export function Sidebar({ open, sections, onClose }: SidebarProps) {
  const initialSale = useMemo(() => makeSale(), []);
  const [sale, setSale] = useState<SaleItem>(initialSale);
  const [showSale, setShowSale] = useState(false);
  const nextTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (nextTimerRef.current) window.clearTimeout(nextTimerRef.current);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };

    const scheduleNext = () => {
      clearTimers();
      const delay = 20000 + Math.floor(Math.random() * 10001);
      nextTimerRef.current = window.setTimeout(() => {
        setSale(makeSale());
        setShowSale(true);
        hideTimerRef.current = window.setTimeout(() => {
          setShowSale(false);
          scheduleNext();
        }, 3000);
      }, delay);
    };

    scheduleNext();

    return clearTimers;
  }, []);

  return (
    <>
      {open && <button aria-label="Close sidebar" className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/10 bg-[#0d0912]/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-3">
              <img
                src={logoTransparent}
                alt="Premiumin Plus"
                className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 object-contain p-1"
              />
              <div>
                <p className="text-sm font-extrabold tracking-wide">Premiumin Plus</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Dashboard UI</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-xl p-2 text-white/50 hover:bg-white/5 lg:hidden" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="scrollbar-hidden flex-1 overflow-y-auto px-3 py-4">
            {sections.map((section) => (
              <div key={section.label} className="mb-5">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">{section.label}</p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={onClose}
                        className={({ isActive }) =>
                          [
                            'flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-200 hover:translate-x-1',
                            isActive
                              ? 'bg-brand text-white shadow-lg shadow-brand/20'
                              : 'text-white/70 hover:bg-white/5 hover:text-white',
                          ].join(' ')
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="leading-tight">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="relative border-t border-white/10 p-4">
            <AnimatePresence>
              {showSale ? (
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="pointer-events-none absolute bottom-[92px] left-4 right-4 z-10 rounded-[1.2rem] border border-white/10 bg-[#0b1018]/95 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <ShoppingBag className="h-4 w-4" />
                      <p className="text-xs font-semibold text-white/70">Pesan Terbaru</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Hidup
                    </span>
                  </div>
                  <div className="mt-3 rounded-[1rem] border border-white/10 bg-[#0d0912] px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-white/65">
                          {sale.channel === 'WA' ? (
                            <MessageCircle className="h-3.5 w-3.5 text-emerald-300" />
                          ) : (
                            <Send className="h-3.5 w-3.5 text-sky-300" />
                          )}
                          <span>{sale.buyer}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-white">{sale.product}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Selesai</p>
                        <p className="mt-1 text-xs font-semibold text-white/55">{sale.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-white/40">
                    <CalendarClock className="h-3.5 w-3.5 text-emerald-300" />
                    <span>Muncul 3 detik, ulang tiap 20 - 30 detik.</span>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="rounded-3xl border border-brand/20 bg-[linear-gradient(145deg,rgba(255,0,127,0.10),rgba(255,255,255,0.03))] p-4">
              <div className="flex items-center gap-2 text-brand">
                <ShoppingBag className="h-4 w-4" />
                <p className="text-xs font-semibold text-white/70">Menu Aktif</p>
              </div>
              <p className="mt-2 text-sm text-white/75">Sidebar dibuat lebih lega agar menu tidak tertutup notifikasi.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
