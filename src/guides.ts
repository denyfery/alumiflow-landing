import type { Locale } from './i18n';
import { guidePaths, type GuideKey } from './guideLinks';

type Step = { title: string; body: string; check: string };
export type Guide = {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  summary: string[];
  steps: Step[];
  exampleTitle: string;
  example: string;
  practiceTitle: string;
  practices: string[];
  closing: string;
};

export const guides: Record<GuideKey, Record<Locale, Guide>> = {
  survey: {
    id: {
      path: guidePaths.survey.id,
      title: 'Alur Survei sampai Instalasi untuk Workshop Kaca dan Aluminium | AlumiFlow',
      description: 'Panduan praktis menyambungkan hasil survei, ukuran, penawaran, pekerjaan, material, dan instalasi agar tim workshop tidak kehilangan konteks order.',
      eyebrow: 'Panduan operasional · Workshop kaca & aluminium',
      intro: 'Order kaca atau aluminium sering dimulai dari chat singkat, tetapi pekerjaannya melewati survei, persetujuan harga, persiapan material, dan pemasangan. Kuncinya bukan menambah banyak status: pastikan hasil satu tahap cukup jelas untuk dipakai oleh orang di tahap berikutnya.',
      summary: [
        'Tetapkan satu identitas order sejak kebutuhan pelanggan dicatat.',
        'Setiap serah terima perlu hasil, penanggung jawab, dan langkah berikutnya.',
        'Bedakan hasil survei, persetujuan penawaran, kesiapan kerja, dan pemasangan selesai.',
      ],
      steps: [
        { title: 'Catat kebutuhan dan jadwalkan survei', body: 'Simpan nama pelanggan, kontak, alamat lokasi, jenis pekerjaan, dan permintaan awal. Sebelum surveyor berangkat, pastikan orang yang ditugaskan tahu waktu kunjungan serta hal yang perlu diukur.', check: 'Siapa pelanggan, di mana lokasi, kapan kunjungan, dan apa yang diminta?' },
        { title: 'Ukur dan dokumentasikan kondisi lapangan', body: 'Catat ukuran per titik atau item, bukaan, foto lokasi, dan kendala pemasangan. Bila ada ukuran yang belum pasti, tandai sebagai pekerjaan lanjutan; jangan diam-diam menganggapnya final.', check: 'Apakah penawaran bisa disusun tanpa menebak ukuran atau kondisi lokasi?' },
        { title: 'Susun penawaran dari hasil survei', body: 'Hubungkan spesifikasi, kuantitas, harga, dan catatan pekerjaan ke hasil ukur. Catat revisi bila pelanggan mengubah pilihan material atau lingkup kerja. Baru lanjut setelah versi penawaran yang disetujui jelas.', check: 'Versi mana yang disetujui pelanggan, dan apa saja yang termasuk?' },
        { title: 'Siapkan job, material, dan jadwal', body: 'Ubah pekerjaan yang disetujui menjadi daftar tugas yang bisa dikerjakan. Periksa kebutuhan material dan aksesori, ketersediaan, tim pelaksana, serta jadwal pemasangan sebelum menjanjikan tanggal pasti.', check: 'Apa yang sudah siap, apa yang masih menunggu, dan siapa pemilik tindak lanjut?' },
        { title: 'Pasang, catat kendala, lalu verifikasi', body: 'Installer perlu membawa konteks ukuran, lokasi, dan lingkup pekerjaan. Simpan catatan serta foto hasil pemasangan dan kendala yang perlu ditindaklanjuti. Setelah diperiksa, bedakan pekerjaan selesai dari pekerjaan yang masih memiliki perbaikan.', check: 'Adakah bukti hasil kerja dan daftar kendala yang belum ditutup?' },
      ],
      exampleTitle: 'Contoh sederhana: pemasangan tiga jendela',
      example: 'Pelanggan meminta tiga jendela aluminium. Surveyor menemukan satu bukaan perlu penyesuaian. Catatan itu masuk ke hasil survei dan penawaran, bukan hanya tertinggal di chat. Saat job dijadwalkan, tim tahu material yang dibutuhkan dan titik yang berisiko. Setelah pemasangan, foto hasil dan catatan penyesuaian membantu owner memeriksa apakah pekerjaan benar-benar selesai.',
      practiceTitle: 'Checklist serah terima sebelum pindah tahap',
      practices: [
        'Tulis keputusan dan perubahan spesifikasi pada order yang sama.',
        'Tunjuk satu penanggung jawab untuk tahap berikutnya.',
        'Pisahkan status “menunggu pelanggan”, “menunggu material”, dan “menunggu tim”.',
        'Jika ada kendala lapangan, catat keputusan serta siapa yang menyetujuinya.',
      ],
      closing: 'Alur ini bisa dimulai dengan checklist sederhana. AlumiFlow membantu menyatukan konteks customer, survei, penawaran, job, dan instalasi ketika tim membutuhkan satu tempat untuk bekerja bersama.',
    },
    en: {
      path: guidePaths.survey.en,
      title: 'From Site Survey to Installation for Glass and Aluminium Workshops | AlumiFlow',
      description: 'A practical guide to connecting measurements, quotes, materials, jobs, and installation so workshop teams keep each order in context.',
      eyebrow: 'Operations guide · Glass and aluminium workshops',
      intro: 'A glass or aluminium order may begin as a short message, but the work passes through a site survey, quote approval, material preparation, and installation. The goal is to make the result of each stage clear enough for the next person to act on.',
      summary: [
        'Give each customer request one order identity from the beginning.',
        'Every handoff needs an outcome, an owner, and a next action.',
        'Keep survey results, quote approval, job readiness, and installation completion distinct.',
      ],
      steps: [
        { title: 'Record the request and schedule the survey', body: 'Keep the customer contact, site address, job type, and initial request together. Before the visit, the surveyor should know when to arrive and what needs measuring.', check: 'Who is the customer, where is the site, when is the visit, and what is requested?' },
        { title: 'Measure and document the site', body: 'Record dimensions by opening or item, site photos, and installation constraints. Mark uncertain measurements for follow-up instead of silently treating them as final.', check: 'Can the team prepare a quote without guessing the dimensions or site conditions?' },
        { title: 'Build the quote from survey findings', body: 'Connect specifications, quantities, pricing, and work notes to the measurements. Record revisions when the customer changes materials or scope. Move on only when the approved quote version is clear.', check: 'Which version did the customer approve, and what does it include?' },
        { title: 'Prepare the job, materials, and schedule', body: 'Turn approved work into actionable tasks. Check materials and accessories, availability, the assigned team, and the installation schedule before promising a firm date.', check: 'What is ready, what is waiting, and who owns the next action?' },
        { title: 'Install, record issues, and verify', body: 'Installers need the measurements, location, and work scope. Record completion photos and issues requiring follow-up. After review, distinguish finished work from work that still needs correction.', check: 'Is there evidence of the result and a list of unresolved issues?' },
      ],
      exampleTitle: 'A simple example: three aluminium windows',
      example: 'A customer requests three windows. At the site, the surveyor finds that one opening needs an adjustment. That note belongs in the survey and quote, not only in a chat. When the job is scheduled, the team knows the materials and the risky opening. Completion photos and adjustment notes then help the owner verify the work.',
      practiceTitle: 'Handoff checklist before moving forward',
      practices: [
        'Record decisions and specification changes on the same order.',
        'Assign one owner for the next stage.',
        'Separate “waiting for customer”, “waiting for material”, and “waiting for crew”.',
        'For a site issue, record the decision and who approved it.',
      ],
      closing: 'This workflow can start as a simple checklist. AlumiFlow brings customer, survey, quote, job, and installation context together when your team needs one shared place to work.',
    },
  },
  progress: {
    id: {
      path: guidePaths.progress.id,
      title: 'Cara Melacak Progres Order Workshop Kaca dan Aluminium | AlumiFlow',
      description: 'Contoh status, penanggung jawab, kendala, dan ritme update untuk melacak order workshop tanpa harus mengejar kabar lewat chat satu per satu.',
      eyebrow: 'Panduan operasional · Progres order',
      intro: '“Sudah sampai mana order ini?” sulit dijawab kalau informasi survei, persetujuan, material, dan pemasangan tersimpan di tempat berbeda. Pelacakan yang berguna menunjukkan pekerjaan terakhir yang selesai, hambatan saat ini, siapa yang perlu bertindak, dan kapan update berikutnya diharapkan.',
      summary: [
        'Lacak tahap kerja dan hambatan secara terpisah.',
        'Setiap update perlu pemilik serta waktu tindak lanjut.',
        'Berikan kabar ke pelanggan berdasarkan peristiwa penting, bukan dugaan.',
      ],
      steps: [
        { title: 'Gunakan tahap yang mudah dipahami semua tim', body: 'Mulai dari kebutuhan dicatat, survei dijadwalkan, hasil survei masuk, penawaran dikirim, penawaran disetujui, persiapan kerja, instalasi, hingga verifikasi. Tahap ini menjawab posisi order; catatan terpisah menjelaskan masalahnya.', check: 'Bila satu status dibaca owner dan installer, apakah maknanya sama?' },
        { title: 'Catat satu sumber informasi per order', body: 'Simpan kontak, alamat, item pekerjaan, ukuran, penawaran yang disetujui, dan jadwal pada order terkait. Foto dan catatan lapangan harus punya hubungan dengan item atau tahap yang tepat agar tidak tertukar antar pelanggan.', check: 'Bisakah anggota tim baru memahami pekerjaan tanpa menggali seluruh chat?' },
        { title: 'Tandai penghambat berikut penanggung jawabnya', body: 'Status “proses” saja tidak memberi tahu apakah tim menunggu persetujuan pelanggan, material, ukuran revisi, atau jadwal installer. Tambahkan siapa yang perlu melakukan apa dan kapan dicek lagi.', check: 'Apa penghambatnya, siapa yang bergerak, dan kapan diperbarui?' },
        { title: 'Perbarui saat terjadi perpindahan penting', body: 'Minta update ketika survei selesai, penawaran direvisi atau disetujui, material siap, instalasi dijadwalkan, kendala ditemukan, dan pekerjaan diverifikasi. Hindari status “selesai” sebelum bukti atau catatan koreksi diperiksa.', check: 'Apakah update terakhir menunjukkan kejadian nyata dan langkah selanjutnya?' },
        { title: 'Beri pelanggan kabar yang bisa ditindaklanjuti', body: 'Sampaikan tahap saat ini, keputusan yang dibutuhkan dari pelanggan bila ada, dan perkiraan kabar berikutnya. Jika jadwal berubah, jelaskan sebab dan rencana lanjut tanpa menjanjikan tanggal baru sebelum kesiapan tim dan material dipastikan.', check: 'Apakah pelanggan tahu apa yang terjadi dan kapan akan mendapat kabar lagi?' },
      ],
      exampleTitle: 'Contoh status yang lebih berguna',
      example: 'Kurang jelas: “Order Pak Budi masih proses.” Lebih berguna: “Survei selesai; revisi ukuran jendela dapur tercatat. Penawaran versi 2 dikirim hari ini. Menunggu persetujuan pelanggan; admin menghubungi kembali besok.” Dengan catatan ini, owner dan admin melihat tindakan yang sama tanpa menebak.',
      practiceTitle: 'Kolom minimum untuk papan progres',
      practices: [
        'Nomor/order dan nama pelanggan.',
        'Tahap saat ini serta tanggal update terakhir.',
        'Hambatan atau keputusan yang menunggu.',
        'Penanggung jawab dan tanggal tindak lanjut.',
        'Tautan ke ukuran, penawaran, foto, atau bukti kerja yang relevan.',
      ],
      closing: 'Mulailah dengan papan sederhana bila tim masih kecil. Saat order bertambah, AlumiFlow membantu menghubungkan tugas kantor dan aktivitas lapangan agar progres bisa ditelusuri bersama.',
    },
    en: {
      path: guidePaths.progress.en,
      title: 'How to Track Glass and Aluminium Workshop Orders | AlumiFlow',
      description: 'A practical status and follow-up framework for tracking workshop orders without chasing updates across separate chats.',
      eyebrow: 'Operations guide · Order progress',
      intro: '“Where is this order now?” is hard to answer when surveys, approvals, materials, and installations live in different places. Useful tracking shows the last completed step, the current blocker, the person responsible, and when the next update is due.',
      summary: [
        'Track the work stage separately from the blocker.',
        'Give every update an owner and a follow-up time.',
        'Update customers at meaningful milestones rather than guessing.',
      ],
      steps: [
        { title: 'Use stages that mean the same thing to everyone', body: 'Start with request recorded, survey scheduled, survey completed, quote sent, quote approved, job preparation, installation, and verification. A stage shows where the order is; a separate note explains what is wrong.', check: 'Would the owner and installer interpret this status the same way?' },
        { title: 'Keep one source of context per order', body: 'Connect contact details, site, work items, measurements, the approved quote, and schedule to the relevant order. Attach photos and site notes to the correct item or stage so they do not get mixed between customers.', check: 'Can a teammate understand the job without reading every chat?' },
        { title: 'Name the blocker and the person responsible', body: '“In progress” does not reveal whether the team is waiting for customer approval, materials, revised dimensions, or an installer schedule. Add who needs to do what and when it will be checked again.', check: 'What is blocking progress, who will act, and when will it be updated?' },
        { title: 'Update at meaningful handoffs', body: 'Update the record when the survey is completed, a quote is revised or approved, materials are ready, installation is scheduled, an issue appears, or work is verified. Avoid marking work finished before evidence or corrections are reviewed.', check: 'Does the latest update describe an actual event and next step?' },
        { title: 'Give customers an actionable update', body: 'Tell them the current stage, any decision you need from them, and when to expect another update. If the schedule changes, explain why and what happens next without promising a date before checking crew and material readiness.', check: 'Does the customer know what happened and when to expect news?' },
      ],
      exampleTitle: 'An update that actually helps',
      example: 'Vague: “Mr Budi’s order is still in progress.” Useful: “Survey complete; revised kitchen window measurement recorded. Quote version 2 sent today. Waiting for customer approval; admin will follow up tomorrow.” The owner and admin can now act on the same information.',
      practiceTitle: 'Minimum fields for a progress board',
      practices: [
        'Order reference and customer name.',
        'Current stage and last update date.',
        'Blocker or decision awaiting a response.',
        'Owner and next follow-up date.',
        'Links to relevant measurements, quote, photos, or work evidence.',
      ],
      closing: 'A simple board is enough to start with a small team. As order volume grows, AlumiFlow helps connect office tasks and field activity so everyone can follow progress together.',
    },
  },
};
