import { Menu, LogOut, BadgeInfo, Bell, CheckCircle2, AlertCircle, ShoppingCart } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Komponen ini menjadi navbar atas untuk pencarian ringan, identitas user, dan logout cepat.
interface TopbarProps {
  title: string;
  subtitle: string;
  username: string;
  role: string;
  onMenuClick: () => void;
  onLogout: () => void;
}

export function Topbar({ title, subtitle, username, role, onMenuClick, onLogout }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      id: 1,
      title: 'Pesanan Berhasil',
      message: 'Order Premium sudah dikirim dan statusnya sukses.',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      id: 2,
      title: 'Promo Terbaru',
      message: 'Ada promo margin baru untuk produk tertentu hari ini.',
      icon: ShoppingCart,
      color: 'text-brand',
      bg: 'bg-brand/10',
    },
    {
      id: 3,
      title: 'Info Sistem',
      message: 'Status server dan deposit saat ini dalam kondisi normal.',
      icon: AlertCircle,
      color: 'text-amber-300',
      bg: 'bg-amber-500/10',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#09060d]/90 backdrop-blur-xl">
      <div className="flex flex-col gap-3 px-3 py-3.5 lg:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={onMenuClick} className="rounded-2xl border border-white/10 p-2 text-white/70 lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-[18px] font-extrabold tracking-tight sm:text-[20px]">{title}</h1>
              <p className="max-w-2xl text-[11px] leading-5 text-white/45">{subtitle}</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="rounded-2xl border border-brand/20 bg-brand/10 px-3 py-2 text-sm font-semibold text-white">
              {role}
            </div>

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications((value) => !value)}
                className={`relative inline-flex items-center justify-center rounded-2xl border px-3 py-2 transition ${
                  showNotifications
                    ? 'border-brand/30 bg-brand/15 text-white'
                    : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                }`}
                aria-label="Notifikasi"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    className="absolute right-0 mt-3 w-80 overflow-hidden rounded-3xl border border-white/10 bg-[#0d1220]/95 shadow-2xl shadow-black/40"
                  >
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-sm font-bold text-white">Notifikasi</p>
                      <p className="text-xs text-white/40">3 notifikasi terbaru</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.id} className="flex gap-3 border-b border-white/10 px-4 py-4 last:border-0">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-white">{item.title}</p>
                              <p className="text-xs leading-5 text-white/45">{item.message}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand/20"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-white/45 lg:hidden">
          <BadgeInfo className="h-4 w-4 text-brand" />
          <span>{username} sedang aktif di {role} mode</span>
        </div>
      </div>
    </header>
  );
}
