# Rilis panduan operasional AlumiFlow

Patch ini menambah dua panduan dalam bahasa Indonesia dan Inggris, menautkannya dari beranda, serta mendaftarkan empat URL baru pada sitemap. Semua halaman dibuat sebagai HTML statis saat build. Tidak perlu mengubah Nginx selama `try_files $uri $uri/ =404` masih berlaku.

## Di laptop, dari source landing yang sudah memakai gambar WebP

```bash
git status --short
git apply --check alumiflow-landing-seo-content-step2.patch
git apply alumiflow-landing-seo-content-step2.patch
npm ci
npm run build:launch
```

Patch ini tidak menyentuh `src/config.ts`. Pastikan nomor demo milikmu masih benar. Setelah build, buka `/`, `/en/`, dan keempat panduan di preview. Periksa tombol ID/EN pada tiap panduan, tautan kembali ke beranda, tautan panduan lain, serta CTA demo. Baca ulang isi artikel untuk menyesuaikan istilah dan alur workshop pilot sebelum dipublikasikan.

## URL baru

| Indonesia | English |
| --- | --- |
| `/panduan/alur-survei-sampai-instalasi/` | `/en/guides/from-survey-to-installation/` |
| `/panduan/melacak-progres-order-workshop/` | `/en/guides/track-workshop-order-progress/` |

Kemas **isi `dist/`** dan unggah ke direktori release baru seperti rilis sebelumnya. Setelah symlink `current` dipindah, periksa:

```bash
for path in \
  /panduan/alur-survei-sampai-instalasi/ \
  /panduan/melacak-progres-order-workshop/ \
  /en/guides/from-survey-to-installation/ \
  /en/guides/track-workshop-order-progress/ \
  /sitemap.xml
do
  curl -s -o /dev/null -w "$path %{http_code}\n" "https://alumiflow.com$path"
done
```

Semua harus `200`. Periksa sumber HTML salah satu panduan: heading artikel sudah ada di dalam `#root`, canonical menunjuk URL sendiri, dan `hreflang` menunjuk pasangan bahasanya. Sitemap yang sudah terdaftar di Search Console akan berisi keenam URL; gunakan URL Inspection pada halaman baru setelah live. Penambahan halaman ke sitemap tidak menjamin halaman segera terindeks.
