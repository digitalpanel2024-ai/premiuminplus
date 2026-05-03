import { useLocation, useNavigate } from 'react-router-dom';
import { CircleDollarSign, ClipboardList, Users, Settings2, SlidersHorizontal } from 'lucide-react';
import { AppShell, type NavSection } from '../components/layout/AppShell';
import { StatCard } from '../components/StatCard';
import { formatCurrency, formatNumber } from '../utils/format';
import { useState } from 'react';

// Halaman admin ini memakai shell yang sama, tetapi isi kontennya fokus ke user management dan monitoring.
interface AdminPanelPageProps {
  session: {
    username: string;
    role: string;
  };
  onLogout: () => void;
}

const adminSections: NavSection[] = [
  {
    label: 'Admin Panel',
    items: [
      { label: 'User Management', to: '/admin/user-management', icon: Users, end: true },
      { label: 'Monitoring Transaksi', to: '/admin/monitoring-transaksi', icon: ClipboardList },
      { label: 'Setting Markup', to: '/admin/setting-markup', icon: SlidersHorizontal },
    ],
  },
];

const adminUsers = [
  { username: 'digitalpanel123', role: 'Member', balance: 921420, status: 'Aktif' },
  { username: 'reseller001', role: 'Reseller', balance: 450000, status: 'Aktif' },
  { username: 'testuser', role: 'Member', balance: 0, status: 'Nonaktif' },
];

const adminTransactions = [
  { invoice: 'INV-20260420-001', product: 'Netflix Premium', amount: 49000, status: 'Success' },
  { invoice: 'INV-20260420-002', product: 'Deposit QRIS', amount: 150000, status: 'Pending' },
  { invoice: 'INV-20260420-003', product: 'Capcut Pro', amount: 4200, status: 'Success' },
];

export function AdminPanelPage({ session, onLogout }: AdminPanelPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [markup, setMarkup] = useState(12);
  const path = location.pathname === '/admin/' ? '/admin/user-management' : location.pathname;

  return (
    <AppShell
      title="Admin Panel"
      subtitle={`Kelola UI admin dengan akses ${session.username}.`}
      username={session.username}
      role="admin"
      sections={adminSections}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total User" value={formatNumber(adminUsers.length)} icon={Users} tone="pink" />
          <StatCard label="User Aktif" value="2" icon={CircleDollarSign} tone="emerald" />
          <StatCard label="Total Saldo" value={formatCurrency(1371420)} icon={CircleDollarSign} tone="blue" />
        </section>

        {path === '/admin/user-management' && (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">Table</p>
                <h2 className="text-xl font-extrabold">User Management</h2>
              </div>
              <button onClick={() => navigate('/admin/setting-markup')} className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">
                Setting Markup
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0f0b15] text-white/45">
                  <tr>
                    <th className="px-4 py-3">Username</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Saldo</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((row) => (
                    <tr key={row.username} className="border-t border-white/10">
                      <td className="px-4 py-4 font-medium text-white">{row.username}</td>
                      <td className="px-4 py-4 text-white/60">{row.role}</td>
                      <td className="px-4 py-4 text-white">{formatCurrency(row.balance)}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {path === '/admin/monitoring-transaksi' && (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">Table</p>
              <h2 className="text-xl font-extrabold">Monitoring Transaksi</h2>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0f0b15] text-white/45">
                  <tr>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3">Nominal</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminTransactions.map((row) => (
                    <tr key={row.invoice} className="border-t border-white/10">
                      <td className="px-4 py-4 font-medium text-white">{row.invoice}</td>
                      <td className="px-4 py-4 text-white/60">{row.product}</td>
                      <td className="px-4 py-4 text-white">{formatCurrency(row.amount)}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {path === '/admin/setting-markup' && (
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">Setting</p>
              <h2 className="mt-2 text-xl font-extrabold">Markup Global</h2>
              <p className="mt-3 text-sm leading-7 text-white/55">
                Pengaturan ini hanya mock UI, tetapi interaksinya tetap hidup agar halaman admin terasa utuh.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#0f0b15] p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Markup saat ini</span>
                  <span className="font-bold text-white">{markup}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={markup}
                  onChange={(e) => setMarkup(Number(e.target.value))}
                  className="mt-4 w-full accent-brand"
                />
                <div className="mt-4 flex items-center justify-between text-xs text-white/35">
                  <span>Lebih rendah</span>
                  <span>Lebih tinggi</span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20">
                  <Settings2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Rangkuman</p>
                  <p className="text-xs text-white/40">Preview perubahan markup</p>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f0b15] px-4 py-4">
                  <span className="text-white/55">Produk dasar</span>
                  <span className="font-bold text-white">{formatCurrency(49000)}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f0b15] px-4 py-4">
                  <span className="text-white/55">Markup</span>
                  <span className="font-bold text-white">{markup}%</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-brand/20 bg-brand/10 px-4 py-4">
                  <span className="text-white">Harga jual mock</span>
                  <span className="font-bold text-white">{formatCurrency(49000 + (49000 * markup) / 100)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
