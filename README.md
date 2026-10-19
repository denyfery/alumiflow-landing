# AlumiFlow landing — React + Tailwind

Prototipe landing page untuk pilot terbatas AlumiFlow. Halaman mengajak pengunjung mengikuti satu pekerjaan dari customer hingga payment, dengan CTA **Jadwalkan Demo**. Harga dan durasi trial belum dipublikasikan.

## Interaksi cerita

- `src/WorkshopWorld.tsx`: satu dunia workshop isometrik berbasis SVG, dipakai bersama oleh hero dan perjalanan scroll. Ilustrasi mencakup kantor, lokasi survei, workshop produksi, instalasi, dan pembayaran.
- `src/HeroWorld.tsx`: ilustrasi hero interaktif dengan lima penanda area, panel informasi ID/EN, parallax mouse ringan, serta animasi JS melalui Web Animations API untuk jalur order, penanda order, mobil, dan aktivitas pekerja. Tombol jeda/putar mengontrol gerakan; reduced motion, tab tersembunyi, dan area di luar viewport menghentikan animasi. `src/hero-world.css` mengatur penanda dan kontrolnya.
- `src/ScrollWorld.tsx`: lima tahap dengan kamera yang dikendalikan scroll. Kamera menjauh di antara tujuan dan mendekat di tiap tujuan; tombol tahap bisa dipakai untuk maju atau kembali. Peredaman gerakan berbasis waktu menjaga respons pada frame rate yang berbeda.
- Preview ini mengikuti pilihan pengguna: **fly-through, layout responsif, tanpa render berbayar**. Adegan merupakan ilustrasi vektor, bukan video hasil render Higgsfield/Monid. Tidak ada video mobile 9:16 atau render AI yang dijalankan.
- Preferensi reduced motion serta layar dengan tinggi 600px atau kurang menggunakan tampilan statis yang dapat dijelajahi lewat tombol tahap. Tanpa JavaScript, penjelasan kelima tahap tetap tersedia.
- `src/Viewpoints.tsx`: pilihan sudut pandang owner/kantor dan tim lapangan.
- `src/App.tsx`: navigasi, progress membaca, section masalah, fitur, FAQ, dan form demo.
- `src/i18n.tsx`: terjemahan ID/EN untuk seluruh konten dan teks form. Bahasa Indonesia ada di `/`, Inggris di `/en/`; pemilih bahasa memakai tautan antar-URL.
- `scripts/prerender.mjs`: menghasilkan HTML awal lengkap untuk kedua bahasa, termasuk metadata masing-masing. React tetap menghidupkan interaksi setelah halaman dimuat.
- `src/styles.css`: gaya dasar. `src/landing.css`: token brand bersama, tema landing, hero, kamera scroll, dan penyesuaian responsif. `src/guides.css`: tema artikel panduan yang mengikuti palet, header, kartu, dan tipografi landing baru, dengan daftar langkah serta tautan antar-panduan. Visual dunia workshop adalah ilustrasi, bukan data pelanggan.

## Jalankan

Gunakan Node.js 20.19+ atau 22.12+ (Node 24 juga dapat dipakai).

```bash
npm ci
npm run dev
```

Buka URL lokal yang dicetak Vite. Untuk memeriksa build:

```bash
npm run build
npm run preview
```

## Nomor demo dan SEO

Isi `DEMO_WHATSAPP_NUMBER` di `src/config.ts`, misalnya `6281234567890`. Sebelum diisi, form menampilkan pemberitahuan dan tidak mengirim data. Setelah diisi, submit membuka WhatsApp dengan pesan yang sudah disusun; pengunjung tetap perlu menekan **Kirim** sendiri. Tidak ada data yang disimpan pada server landing page.

Untuk rilis publik jalankan `npm run build:launch`; perintah ini berhenti jika nomor belum valid. `npm run build` tetap tersedia untuk pratinjau desain tanpa nomor.

Build sekarang menghasilkan `dist/index.html`, `dist/en/index.html`, `dist/robots.txt`, dan `dist/sitemap.xml`. Jangan mengunggah `index.html` sumber proyek; unggah **isi `dist/`**. Jika memperbarui proyek yang sudah live, pertahankan nomor asli di `src/config.ts` pada laptop sebelum build.

Panduan cutover domain dan pemeriksaan setelah rilis ada di [`docs/LAUNCH_ALUMIFLOW_COM.md`](docs/LAUNCH_ALUMIFLOW_COM.md).
Untuk update situs yang sudah live dengan desain terbaru, gunakan [`docs/UPDATE_DESIGN_20261019.md`](docs/UPDATE_DESIGN_20261019.md): paket rilis, upload VPS, pergantian symlink, verifikasi, dan rollback.
Langkah khusus SEO dan Search Console ada di [`docs/SEO_RELEASE.md`](docs/SEO_RELEASE.md).

## Perpindahan ke Laravel

Proyek ini adalah prototipe React untuk meninjau visual dan copy. Bila marketing, lead, trial, dan subscription dikelola bersama AlumiFlow, pindahkan komponen di `src/` ke halaman Marketing pada React/Inertia Laravel, pindahkan aset ke direktori publik, dan gabungkan tema Tailwind dengan build Vite yang sudah ada. Jangan membuat database lead terpisah hanya untuk prototipe ini.

Saat membuka pendaftaran mandiri atau perlu melacak calon pelanggan yang belum menekan **Kirim** di WhatsApp, sambungkan form ke endpoint lead Laravel dengan validasi, pembatasan spam, dan pemberitahuan privasi. Halaman ilustrasi produk saat ini memang berupa mockup, bukan screenshot data asli.
