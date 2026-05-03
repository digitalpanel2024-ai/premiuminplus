// Utilitas kecil ini dipakai untuk merapikan angka, teks, dan kode palsu di UI.
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('id-ID').format(value);
}

export function maskKey(value: string) {
  if (value.length <= 12) {
    return value;
  }

  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

export function createMockKey() {
  return `pk_live_${Math.random().toString(36).slice(2, 10)}_${Math.random().toString(36).slice(2, 8)}${Math.random()
    .toString(36)
    .slice(2, 6)}`.toUpperCase();
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 18) return 'Selamat sore';
  return 'Selamat malam';
}
