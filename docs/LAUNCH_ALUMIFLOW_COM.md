# Rilis landing AlumiFlow ke alumiflow.com

Target: landing marketing di `alumiflow.com`, aplikasi produksi tetap di `app.alumiflow.com`, pilot tetap di `pilot.alumiflow.com`. Proses demo dan billing masih manual; halaman ini tidak melakukan pembayaran atau membuat akun.

## 1. Siapkan konten dan build di laptop

1. Isi `DEMO_WHATSAPP_NUMBER` di `src/config.ts` dengan nomor tujuan dalam format internasional, misalnya `6281234567890`. Gunakan nomor asli milik tim, tanpa `+`, spasi, atau tanda hubung.
2. Jalankan dari direktori proyek:

   ```bash
   npm ci
   npm run build:launch
   ```

   Perintah rilis berhenti bila nomor belum valid. Hasil statis ada di `dist/`. Jangan unggah `.env`, `node_modules`, source, atau kunci server ke document root.

3. Uji di browser lokal dengan `npm run preview`: buka ID dan EN, layar ponsel, navigasi, FAQ, dan CTA. Isi form dengan data uji, lanjutkan ke WhatsApp, **periksa nomor penerima dan isi pesan**. Pesan baru diterima tim setelah pengunjung menekan **Kirim** di WhatsApp.
4. Kemas hanya hasil build:

   ```bash
   tar -C dist -czf alumiflow-landing-dist.tar.gz .
   sha256sum alumiflow-landing-dist.tar.gz
   ```

## 2. Periksa routing VPS sebelum cutover

Di VPS produksi, periksa DNS dan konfigurasi web server yang sedang aktif. Jangan mengganti konfigurasi aplikasi secara membabi buta; `alumiflow.com` mungkin sudah memiliki virtual host atau redirect.

```bash
getent ahostsv4 alumiflow.com
sudo nginx -T 2>/dev/null | grep -nE 'server_name|root |proxy_pass|ssl_certificate'
curl -I https://alumiflow.com/
curl -I https://app.alumiflow.com/
```

Catat berkas vhost yang melayani `alumiflow.com`, cara TLS dikelola, dan jalur root saat ini. Ambil salinan berkas vhost itu sebelum mengubahnya. Jika domain belum mengarah ke VPS, atur DNS A/AAAA sesuai IP VPS lalu tunggu resolusi; jangan mengubah vhost aplikasi sampai routing jelas.

## 3. Unggah build dan pindahkan root domain

Contoh ini memakai user deploy dan VPS produksi AlumiFlow. Sesuaikan bila user, port, atau lokasi virtual host berbeda.

Dari laptop:

```bash
scp alumiflow-landing-dist.tar.gz alumiflow-deploy@103.89.4.146:/tmp/
```

Di VPS:

```bash
release_stamp=$(date +%Y%m%d-%H%M%S)
sudo install -d -o alumiflow-deploy -g www-data -m 755 /var/www/alumiflow-landing/releases
sudo install -d -o alumiflow-deploy -g www-data -m 755 "/var/www/alumiflow-landing/releases/$release_stamp"
tar -xzf /tmp/alumiflow-landing-dist.tar.gz -C "/var/www/alumiflow-landing/releases/$release_stamp"
test -f "/var/www/alumiflow-landing/releases/$release_stamp/index.html"
sudo ln -sfn "/var/www/alumiflow-landing/releases/$release_stamp" /var/www/alumiflow-landing/current
```

Jika hak akses user deploy tidak mengizinkan ekstraksi, jaJika hak akses user deploy tidak mengizinkan ekstraksi, jalankan `sudo tar -xzf ...` lalu set agar file build bisa dibaca oleh web server. Pada vhost HTTPS yang **khusus** melayani `alumiflow.com`, gunakan root `/var/www/alumiflow-landing/current`. Build menyediakan `/index.html` dan `/en/index.html`; URL lain sebaiknya 404:

```nginx
root /var/www/alumiflow-landing/current;
index index.html;
location / {
    try_files $uri $uri/ =404;
 `pilot.alumiflow.com`. Pertahankan TLS dan redirect HTTP→HTTPS yang ada. Bila root domain sebelumnya dipakai Laravel, ubah hanya vhost root setelah memastikan akses aplikasi produksinya memang lewat subdomain `app`.

Validasi dan muat ulang konfigurasi:

```bash
sudo nginx -t
sudo systemctl reload nginx
curl -fsSI https://alumiflow.com/
curl -fsSI https://app.alumiflow.com/
curl -fsSI https://pilot.alumiflow.com/
```

## 4. Uji rilis dan rollback

Buka domain dari browser biasa dan ponsel; periksa sertifikat HTTPS, aset, bahasa ID/EN, CTA WhatsApp, dan login aplikasi di `app.alumiflow.com`. Periksa juga `/assets/...` agar bukan HTML fallback saat file aset hilang. Tidak ada lead yang disimpan oleh landing; catat pesan demo yang benar-benar masuk ke WhatsApp untuk proses follow-up manual.

Untuk rollback, kembalikan berkas vhost dari salinan sebelum cutover, atau arahkan symlink `current` ke release sebelumnya bila hanya aset yang bermasalah. Jalankan `sudo nginx -t` dan `sudo systemctl reload nginx`, lalu periksa ketiga domain lagi.

## Pekerjaan setelah landing hidup

- Pantau permintaan demo dan pertanyaan calon workshop; gunakan itu untuk memvalidasi paket serta aturan langganan.
- Sebelum promosi organik yang besar, pertimbangkan prerender konten marketing dan URL terpisah untuk ID/EN agar crawler mendapat konten dan bahasa yang jelas.
- Implementasikan status paket, masa aktif, tagihan, dan pencatatan pembayaran manual di Laravel. Otomatisasi payment gateway menyusul setelah alur bisnis stabil.
