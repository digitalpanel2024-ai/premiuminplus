import { Bot, MessageCircle, Send, Sparkles, Workflow } from 'lucide-react';
import { LinkCard, PageHero, PageSection, NeonCard } from './dashboardPageKit';

const botOffers = [
  {
    title: 'Generate Bot',
    tagline: 'Bangun dari nol',
    description: 'Ideal untuk tim yang ingin kontrol penuh, alur custom, dan branding bot yang mengikuti cara kerja sendiri.',
    href: 'https://wa.me/6285888009931?text=Saya%20ingin%20generate%20bot%20baru',
    icon: Bot,
    accent: 'from-emerald-500/20 to-cyan-500/10',
    benefits: ['Workflow custom', 'Notifikasi transaksi', 'Setup bertahap'],
  },
  {
    title: 'Sewa Bot',
    tagline: 'Langsung jalan',
    description: 'Pas untuk yang ingin cepat pakai, tanpa ribet setup panjang. Tinggal aktif, jalan, dan monitor hasilnya.',
    href: 'https://t.me/+1tkWNfTUfEg1MTY1',
    icon: Workflow,
    accent: 'from-sky-500/20 to-indigo-500/10',
    benefits: ['Aktif lebih cepat', 'Support ringan', 'Siap pakai'],
  },
];

const quickChannels = [
  {
    title: 'WhatsApp Bot',
    description: 'Respons cepat untuk order, notifikasi, dan follow-up.',
    href: 'https://wa.me/6285888009931?text=Bot%20WhatsApp%20untuk%20order',
    icon: MessageCircle,
  },
  {
    title: 'Telegram Bot',
    description: 'Cocok untuk channel update, broadcast, dan arsip pesan.',
    href: 'https://t.me/+1tkWNfTUfEg1MTY1',
    icon: Send,
  },
];

export default function BotWA() {
  return (
    <div className="bot-wa">
      <PageHero
        title="Bot WA & Telegram"
        subtitle="Halaman bot dirancang untuk dua jalur: generate atau sewa."
        slogan="Kontrol penuh atau tinggal pakai, sama-sama dibuat tampil rapi."
        tone="from-cyan-500/15 via-emerald-500/10 to-brand/10"
        chips={['Generate', 'Sewa', 'Notifikasi']}
      />
      <div className="mt-4">
      <PageSection title="Pilihan bot" subtitle="Generate bot atau sewa bot">
        <div className="mb-4 rounded-[1.4rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,0,127,0.12),rgba(14,165,233,0.10))] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">Slogan layanan</p>
          <h3 className="mt-2 text-2xl font-extrabold text-white">Bangun otomatisasi yang rapi, cepat, dan siap jual.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
            Halaman ini dibuat untuk dua kebutuhan utama: generate bot untuk kontrol penuh, atau sewa bot untuk mulai lebih cepat. Pilih alurnya sesuai ritme bisnismu.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {botOffers.map((item) => {
            const Icon = item.icon;
            return (
              <NeonCard key={item.title} className="relative overflow-hidden">
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent}`} />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">{item.tagline}</p>
                      <h3 className="mt-1 text-xl font-extrabold text-white">{item.title}</h3>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                    Populer
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/65">{item.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.benefits.map((benefit) => (
                    <span key={benefit} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                      {benefit}
                    </span>
                  ))}
                </div>

                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:scale-[1.01]"
                >
                  <Sparkles className="h-4 w-4" />
                  {item.title === 'Generate Bot' ? 'Mulai Generate' : 'Ajukan Sewa'}
                </a>
              </NeonCard>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {quickChannels.map((item) => (
            <LinkCard key={item.title} title={item.title} description={item.description} href={item.href} icon={item.icon} />
          ))}
        </div>
      </PageSection>
      </div>
    </div>
  );
}
