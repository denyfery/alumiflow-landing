# Rilis identitas situs AlumiFlow

Patch ini menambahkan `WebSite` dan `Organization` JSON-LD hanya ke beranda utama `https://alumiflow.com/`. Nama yang dinyatakan adalah `AlumiFlow`, URL-nya domain landing, dan logo organisasi memakai aset PNG yang sudah publik. Tag `og:site_name` ditambahkan ke semua halaman. Tidak ada nama hukum, alamat, telepon, akun sosial, atau rating yang diasumsikan.

Di source landing terbaru yang sudah memuat panduan operasional:

```bash
git apply --check alumiflow-landing-seo-site-identity.patch
git apply alumiflow-landing-seo-site-identity.patch
npm run build:launch
```

Periksa `dist/index.html` berisi tepat satu objek `WebSite` dan satu objek `Organization` dengan `name: AlumiFlow`. Periksa `dist/en/index.html` serta halaman panduan tidak memuat `WebSite` lain. Data situs ini memang cukup di beranda root. Aset `dist/assets/alumiflow-mark.png` harus tersedia dan tetap bisa diakses publik.

Deploy isi `dist/` ke direktori release baru, lalu pindahkan symlink `current` dengan pola rilis statis yang sudah digunakan. Setelah live, cek source HTML `https://alumiflow.com/`, validasi markup di Schema Markup Validator, dan pakai URL Inspection di Search Console untuk meminta crawl ulang beranda bila diperlukan. `WebSite` membantu Google mengenali nama situs, tetapi tidak menjamin nama yang dipilih. Favicon hasil pencarian mengikuti tag icon dan crawl beranda/aset favicon; `Organization.logo` bukan pengganti tag tersebut.
