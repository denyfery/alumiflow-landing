# Rilis SEO landing AlumiFlow

Perubahan ini membuat konten utama tersedia langsung di HTML. Versi Indonesia memakai `https://alumiflow.com/`, versi Inggris `https://alumiflow.com/en/`. Keduanya punya canonical sendiri, tautan `hreflang` timbal balik, judul/deskripsi sesuai bahasa, `robots.txt`, dan `sitemap.xml`.

## Sebelum upload

Pakai source landing terbaru, tetapi **pertahankan nomor demo milikmu di `src/config.ts`**. Paket contoh tidak menyertakan nomor asli. Di laptop:

```bash
npm ci
npm run build:launch
```

Lihat `dist/index.html` dan `dist/en/index.html`: kedua file harus berisi heading dan cerita lengkap di dalam `#root`, bukan div kosong. Buka preview dan tes perpindahan ID/EN serta CTA. Kemas **isi `dist/`** seperti release sebelumnya; unggah ke direktori release baru dan pindahkan symlink `current` setelah dicek.

## Nginx setelah release baru terpasang

Vhost root saat ini memakai fallback SPA `try_files $uri $uri/ /index.html`. Untuk dua halaman statis ini, ganti fallback di blok HTTPS `alumiflow.com` menjadi 404 agar URL yang tidak ada tidak dianggap halaman valid:

```nginx
location /assets/ {
    try_files $uri =404;
}

location / {
    try_files $uri $uri/ =404;
}
```

Pertahankan redirect `/login` ke `app.alumiflow.com`, blok HTTPS, dan vhost `app` serta `pilot`. Direktori `en/index.html` akan dilayani pada `/en/`; `/en` dapat diarahkan permanen ke `/en/` bila server tidak melakukannya otomatis. Idealnya `https://www.alumiflow.com/` juga diarahkan permanen ke `https://alumiflow.com/` agar hanya ada satu alamat utama. Simpan backup vhost di luar `sites-enabled`, jalankan `sudo nginx -t`, lalu reload hanya jika lolos.

## Periksa hasil publik

```bash
curl -fsSI https://alumiflow.com/
curl -fsSI https://alumiflow.com/en/
curl -fsSI https://alumiflow.com/robots.txt
curl -fsSI https://alumiflow.com/sitemap.xml
curl -sI https://alumiflow.com/halaman-yang-tidak-ada
curl -fsS https://alumiflow.com/en/ | grep -F 'One order.'
```

Empat URL pertama harus berhasil, URL fiktif harus 404, dan HTML Inggris harus sudah berisi konten tanpa perlu JavaScript. Tes perpindahan ID/EN, interaksi cerita, FAQ, dan WhatsApp sekali lagi di browser. Pastikan aplikasi di `app.alumiflow.com` serta pilot tetap normal.

## Search Console

1. Tambahkan properti **Domain** `alumiflow.com` di Google Search Console dan verifikasi dengan TXT DNS yang diberikan Google. Jangan menyalin token contoh dari dokumentasi.
2. Setelah build baru live, kirim `https://alumiflow.com/sitemap.xml` melalui menu Sitemaps.
3. Pakai URL Inspection untuk menguji `/` dan `/en/`: periksa apakah halaman dapat diindeks, canonical yang dipilih, dan konten yang dirender. Minta indexing bila perlu.
4. Pantau laporan Pages, Search results, dan Core Web Vitals. Sitemap dan permintaan indexing tidak menjamin peringkat atau waktu muncul tertentu.

Untuk tahap konten berikutnya, kumpulkan pertanyaan nyata dari demo. Buat halaman tentang alur survei, penawaran, instalasi, dan contoh penggunaan hanya setelah ada informasi yang benar-benar membantu calon workshop. Hindari klaim harga, review, atau trial yang belum ditetapkan.
