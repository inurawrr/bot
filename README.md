# WhatsApp Bot Multi Device

Bot WhatsApp multi device yang menggunakan library @whiskeysockets/baileys dengan fitur penyimpanan sesi dan auto-restart menggunakan nodemon.

## Fitur

- Koneksi multi device
- Penyimpanan sesi otomatis
- QR Code scanner di terminal
- Auto-restart dengan nodemon
- Kode modular dan mudah dikembangkan

## Instalasi

1. Clone repositori ini
2. Install dependensi:
```bash
npm install
```

## Penggunaan

1. Jalankan bot dalam mode development (dengan nodemon):
```bash
npm run dev
```

2. Scan QR code yang muncul di terminal menggunakan WhatsApp di ponsel Anda

3. Bot akan otomatis menyimpan sesi dan tidak perlu scan ulang di masa depan

## Struktur Proyek

- `index.js` - File utama bot
- `sessions/` - Direktori penyimpanan sesi
- `package.json` - Konfigurasi proyek dan dependensi

## Catatan

- Pastikan Node.js terinstal di sistem Anda
- Bot akan menyimpan sesi di folder `sessions/`
- Gunakan `npm run dev` untuk development dengan auto-restart
- Gunakan `npm start` untuk menjalankan dalam mode production 