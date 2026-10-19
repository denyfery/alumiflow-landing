# Update desain AlumiFlow — 19 Oktober 2026

Panduan ini untuk **mengganti landing yang sudah live**. Paket mencakup hero interaktif, perjalanan scroll, dua panduan dengan tema baru, serta semua versi Inggrisnya: enam halaman HTML statis.

Setup berikut berasal dari dokumentasi repo, belum diperiksa langsung di VPS pada sesi ini:

- SSH: `alumiflow-deploy@103.89.4.146` pada port standar.
- Key lokal yang sudah berhasil diuji untuk akun deploy: `~/.ssh/alumiflow_github_actions_prod`. Alias lama `alumiflow_github` menunjuk key berbeda; gunakan `-i` eksplisit pada perintah di bawah.
- Root landing: `/var/www/alumiflow-landing/current`.
- Release: `/var/www/alumiflow-landing/releases/`.
- Nginx melayani `alumiflow.com`; `app.alumiflow.com` dan `pilot.alumiflow.com` menggunakan vhost masing-masing.

Gunakan langkah aktivasi hanya setelah root dan symlink aktif cocok dengan setup tersebut. Jika tidak cocok, catat konfigurasi yang sebenarnya terlebih dahulu.

## 1. Paket yang sudah disiapkan di laptop

Di `D:\Learning\App\alumiflow-landing` tersedia:

- `alumiflow-landing-redesign-20261019.tar.gz`
- `alumiflow-landing-redesign-20261019.tar.gz.sha256`

`npm run build:launch` sudah lolos, termasuk pemeriksaan format kontak demo, TypeScript, Vite, dan prerender enam halaman. Arsip dikemas dari **isi `dist/`**, tanpa direktori `dist` tambahan. Pastikan nomor demo di `src/config.ts` memang nomor penerima yang dikehendaki; pemeriksaan otomatis hanya memvalidasi format.

Jika source berubah setelah paket ini dibuat, build dan kemas ulang sebelum upload. Tidak perlu menginstal ulang dependency untuk paket yang sudah siap ini.

## 2. Upload dari PowerShell laptop

```powershell
Set-Location 'D:\Learning\App\alumiflow-landing'
scp -o IdentitiesOnly=yes -i "$env:USERPROFILE/.ssh/alumiflow_github_actions_prod" .\alumiflow-landing-redesign-20261019.tar.gz .\alumiflow-landing-redesign-20261019.tar.gz.sha256 alumiflow-deploy@103.89.4.146:/tmp/
ssh -o IdentitiesOnly=yes -i "$env:USERPROFILE/.ssh/alumiflow_github_actions_prod" alumiflow-deploy@103.89.4.146
```

Jika koneksi lama memakai port SSH khusus atau alias SSH, gunakan pengaturan koneksi yang sama dengan rilis sebelumnya.

Jika terminal laptop memakai **Git Bash / MINGW64**, gunakan sintaks ini sebagai pengganti blok PowerShell:

```bash
cd /d/Learning/App/alumiflow-landing
scp -o IdentitiesOnly=yes -i "$HOME/.ssh/alumiflow_github_actions_prod" alumiflow-landing-redesign-20261019.tar.gz alumiflow-landing-redesign-20261019.tar.gz.sha256 alumiflow-deploy@103.89.4.146:/tmp/
ssh -o IdentitiesOnly=yes -i "$HOME/.ssh/alumiflow_github_actions_prod" alumiflow-deploy@103.89.4.146
```

## 3. Verifikasi di VPS sebelum mengaktifkan

Mulai langkah ini, semua perintah memakai **Bash di VPS**, bukan PowerShell laptop.

```bash
cd /tmp
sha256sum -c alumiflow-landing-redesign-20261019.tar.gz.sha256
sudo nginx -t
sudo nginx -T 2>/dev/null | grep -nE 'server_name|root |try_files'
ls -ld /var/www/alumiflow-landing/current
readlink -f /var/www/alumiflow-landing/current
```

Checksum harus `OK`. Dalam blok HTTPS yang melayani `alumiflow.com`, cocokkan root `/var/www/alumiflow-landing/current`. Direktori `current` harus symlink ke release sebelumnya di bawah `/var/www/alumiflow-landing/releases/`.

Routing statis yang sesuai untuk keenam halaman ini sudah didokumentasikan di repo:

```nginx
root /var/www/alumiflow-landing/current;
index index.html;

location /assets/ {
    try_files $uri =404;
}

location / {
    try_files $uri $uri/ =404;
}
```

Ini acuan pemeriksaan, bukan pengganti seluruh vhost. Pertahankan TLS, redirect `/login`, dan konfigurasi subdomain yang sudah berjalan. Jika root sudah sesuai, update desain cukup menggunakan release baru dan pergantian symlink. Perubahan konfigurasi Nginx memerlukan validasi serta reload; rujukan: [panduan resmi Nginx](https://nginx.org/en/docs/beginners_guide.html).

Catat respons aplikasi sebelum update untuk dibandingkan setelahnya:

```bash
curl -sS -o /dev/null -w 'app: %{http_code}\n' https://app.alumiflow.com/
curl -sS -o /dev/null -w 'pilot: %{http_code}\n' https://pilot.alumiflow.com/
```

## 4. Buat release baru, kemudian aktifkan

Blok berikut berhenti jika symlink atau lokasi release lama tidak cocok. Baris `mv -Tf` adalah titik perubahan situs publik. Jalankan blok dalam satu sesi SSH. Penulisan file memakai `sudo`, sehingga akun admin seperti `deny.irawan` juga bisa menjalankannya; hasil release tetap dimiliki `alumiflow-deploy:www-data`.

```bash
set -e
base=/var/www/alumiflow-landing
archive=/tmp/alumiflow-landing-redesign-20261019.tar.gz

test -L "$base/current" || { echo 'STOP: current bukan symlink.'; exit 1; }
previous=$(readlink -f "$base/current")
case "$previous" in
  "$base"/releases/*) ;;
  *) echo 'STOP: lokasi release lama tidak sesuai.'; exit 1 ;;
esac
test -s "$previous/index.html"
test -s "$archive"

stamp=$(date +%Y%m%d-%H%M%S)
release="$base/releases/$stamp"
test ! -e "$release"
sudo install -d -o alumiflow-deploy -g www-data -m 755 "$release"
sudo tar --no-same-owner --no-same-permissions -xzf "$archive" -C "$release"

for page in \
  index.html \
  en/index.html \
  panduan/alur-survei-sampai-instalasi/index.html \
  panduan/melacak-progres-order-workshop/index.html \
  en/guides/from-survey-to-installation/index.html \
  en/guides/track-workshop-order-progress/index.html
do
  test -s "$release/$page"
done
test -s "$release/robots.txt"
test -s "$release/sitemap.xml"
test -d "$release/assets"

# Pertahankan aset lama untuk browser yang masih menggunakan HTML versi lama.
if test -d "$previous/assets"; then
  sudo cp -Rn "$previous/assets/." "$release/assets/"
fi
sudo chown -R alumiflow-deploy:www-data "$release"
sudo chmod -R u=rwX,go=rX "$release"

# Simpan penunjuk rollback sebelum mengganti release aktif.
sudo ln -s "$previous" "$base/previous-$stamp"
sudo ln -s "$release" "$base/.current-$stamp"
sudo mv -Tf "$base/.current-$stamp" "$base/current"

printf 'Release aktif: %s\n' "$release"
printf 'Penunjuk rollback: %s\n' "$base/previous-$stamp"
```

Simpan kedua path yang dicetak. Release lama tetap tersedia. Konfigurasi Nginx yang root-nya sudah menuju `current` tetap memakai root tersebut.

Jika sebelumnya ekstraksi gagal `Permission denied` saat login sebagai `deny.irawan`, gunakan blok yang sudah dikoreksi ini dari awal. Direktori baru dengan timestamp berbeda akan dibuat. `set -e` menghentikan proses pada kegagalan; bila shell SSH ikut tertutup, login kembali sebelum menjalankan blok. Pergantian `current` berada setelah seluruh pemeriksaan file.

Jika memang mengubah konfigurasi Nginx pada langkah 3, terapkan setelah validasi:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 5. Periksa hasil publik

```bash
for path in \
  / \
  /en/ \
  /panduan/alur-survei-sampai-instalasi/ \
  /panduan/melacak-progres-order-workshop/ \
  /en/guides/from-survey-to-installation/ \
  /en/guides/track-workshop-order-progress/ \
  /robots.txt \
  /sitemap.xml
do
  curl -sS -o /dev/null -w '%{http_code} %{url_effective}\n' "https://alumiflow.com$path"
done

curl -sS -o /dev/null -w '404 check: %{http_code}\n' https://alumiflow.com/halaman-uji-tidak-ada-20261019
curl -sS -o /dev/null -w 'app: %{http_code}\n' https://app.alumiflow.com/
curl -sS -o /dev/null -w 'pilot: %{http_code}\n' https://pilot.alumiflow.com/
```

Delapan URL landing harus `200`; URL fiktif harus `404`. Respons `app` dan `pilot` perlu sama dengan sebelum update; redirect menuju login dapat merupakan perilaku normal.

Di browser, gunakan hard refresh atau Incognito lalu periksa:

1. Hero baru, lima penanda area, tombol jeda/putar, dan perjalanan scroll.
2. Dua panduan bertema baru dan tombol bahasa ID/EN.
3. Navigasi langkah artikel, FAQ, serta tautan kembali ke beranda.
4. Form demo: periksa penerima dan pesan WhatsApp sebelum menekan Kirim.
5. Tampilan ponsel dan aset yang dimuat tanpa error 404.

Jika memakai CDN/cache HTML, hapus cache halaman yang diperbarui setelah release aktif. DNS dan sertifikat tidak perlu diganti ketika server dan domain tetap sama.

## 6. Rollback bila diperlukan

Gunakan path `Penunjuk rollback` dari langkah 4. Dalam **sesi SSH yang sama**, variabel `base` dan `stamp` masih tersedia:

```bash
rollback_target=$(readlink -f "$base/previous-$stamp")
case "$rollback_target" in
  "$base"/releases/*) ;;
  *) echo 'STOP: target rollback tidak sesuai.'; exit 1 ;;
esac
test -s "$rollback_target/index.html"
rollback_stamp=$(date +%Y%m%d-%H%M%S)
sudo ln -s "$rollback_target" "$base/.rollback-$rollback_stamp"
sudo mv -Tf "$base/.rollback-$rollback_stamp" "$base/current"
readlink -f "$base/current"
```

Jika sesi SSH sudah ditutup, isi kembali `base=/var/www/alumiflow-landing` dan `stamp` dengan angka pada nama penunjuk rollback yang disimpan. Setelah rollback, ulangi pemeriksaan URL. Jika sebelumnya mengubah vhost atau cache CDN, kembalikan konfigurasi/cache yang relevan juga.

## Membuat paket baru setelah perubahan berikutnya

Di PowerShell laptop:

```powershell
Set-Location 'D:\Learning\App\alumiflow-landing'
npm run build:launch
if ($LASTEXITCODE -ne 0) { throw 'Build gagal; paket tidak diperbarui.' }
tar -czf alumiflow-landing-redesign-20261019.tar.gz -C dist .
if ($LASTEXITCODE -ne 0) { throw 'Pembuatan arsip gagal.' }
$releasePackageHash = Get-FileHash -LiteralPath 'alumiflow-landing-redesign-20261019.tar.gz' -Algorithm SHA256
$releaseChecksumText = ('{0}  {1}' -f $releasePackageHash.Hash.ToLowerInvariant(), 'alumiflow-landing-redesign-20261019.tar.gz') + [char]10
[System.IO.File]::WriteAllText((Join-Path $PWD 'alumiflow-landing-redesign-20261019.tar.gz.sha256'), $releaseChecksumText, [System.Text.Encoding]::ASCII)
```
