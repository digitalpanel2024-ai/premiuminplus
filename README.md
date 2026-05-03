# Premiumin Plus Dashboard

Premiumin Plus Dashboard is a dark-themed React app for login, member dashboard, and admin panel UI.  
All data is mock data for now, so it is ready to be connected to a Node.js backend later.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router v7
- Tailwind CSS 4
- Motion
- Lucide React

## Run Locally

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Available Routes

- `/login`
- `/dashboard`
- `/admin`

Protected routes redirect to `/login` when the session is missing.

## Login Flow

- Input: username, password, remember me
- User login redirects to `/dashboard`
- Reseller login uses the same form with a different role
- Admin login uses:
  - username: `admin`
  - password: `admin230521`
  - redirect: `/admin`

## Dashboard Menu

- Komunitas WA
- Order Akun
- Deposit Saldo
- Daftar Harga
- Tarik Saldo
- Riwayat Pesanan
- Riwayat Deposit
- Mutasi Saldo
- Profil
- Laporan Kendala
- Bot WA & Telegram
- Document

## Main UI Notes

- Dark background with pink accent
- Responsive desktop-first layout
- Modular components:
  - Sidebar
  - Topbar
  - API Key Card
  - Stat Card
  - Mini Chart
- Mock notifications and mock transactions
- WhatsApp CTA buttons for contact and community links

## Project Structure

```text
src/
  asset/
  components/
    layout/
  pages/
  services/
  styles/
  utils/
```

## Mock Data

All dashboard cards, tables, charts, and API blocks use mock data for preview.  
This keeps the UI ready for future backend integration without changing layout logic.

## GitHub

Repository:

```bash
https://github.com/digitalpanel2024-ai/premiuminplus.git
```
