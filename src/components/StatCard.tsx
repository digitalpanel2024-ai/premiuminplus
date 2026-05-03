import type { LucideIcon } from 'lucide-react';

// Komponen ini menampilkan satu kartu ringkas berisi angka penting di dashboard.
interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: 'pink' | 'emerald' | 'blue' | 'amber';
}

const toneMap = {
  pink: 'bg-brand/10 text-brand ring-brand/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  blue: 'bg-sky-500/10 text-sky-400 ring-sky-500/20',
  amber: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
};

export function StatCard({ label, value, icon: Icon, tone = 'pink' }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{label}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
