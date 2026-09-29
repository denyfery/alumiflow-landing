import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { DEMO_WHATSAPP_NUMBER } from './config';
import Story from './Story';
import Viewpoints from './Viewpoints';
import { useLanguage } from './i18n';
import HeroPreview from './HeroPreview';
import { guidePaths, guideSummaries, type GuideKey } from './guideLinks';

const brandWordmark = '/assets/alumiflow-wordmark-ui.webp';

function ArrowUpRight({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 19 19 5M7 5h12v12" /></svg>;
}

function Icon({ kind }: { kind: 'users' | 'measure' | 'document' | 'tools' | 'boxes' | 'chart' }) {
  const common = { width: 27, height: 27, viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const };
  if (kind === 'users') return <svg {...common}><circle cx="12" cy="11" r="4" /><path d="M4 26v-2a8 8 0 0 1 16 0v2H4Zm18-18a4 4 0 0 1 0 8m2 4a7 7 0 0 1 4 6h-5" /></svg>;
  if (kind === 'measure') return <svg {...common}><path d="M6 25 24 7l4 4-18 18-4-4ZM10 21l2 2m2-6 2 2m2-6 2 2m2-6 2 2M5 6v7m0-7h7" /></svg>;
  if (kind === 'document') return <svg {...common}><path d="M8 3h11l5 5v21H8V3Zm11 0v6h5M12 15h8m-8 5h8m-8 5h5" /></svg>;
  if (kind === 'tools') return <svg {...common}><path d="M19 4a7 7 0 0 0-7 9L4 21l7 7 8-8a7 7 0 0 0 9-7l-5 5-5-5 5-5-4-4Z" /></svg>;
  if (kind === 'boxes') return <svg {...common}><path d="m16 3 11 6-11 6L5 9l11-6ZM5 9v13l11 6 11-6V9M16 15v13M10 6l11 6" /></svg>;
  return <svg {...common}><path d="M5 27V6m0 21h23M10 21l5-6 5 3 7-10M23 8h4v4" /></svg>;
}

const navLinks = [
  { href: '#cerita', label: 'Ceritanya' },
  { href: '#cara-kerja', label: 'Cara kerja' },
  { href: '#untuk-tim', label: 'Untuk tim' },
  { href: '#panduan', label: 'Panduan' },
  { href: '#faq', label: 'FAQ' },
];

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, t } = useLanguage();
  return <header className="relative z-30 border-b border-slate-100 bg-white">
    <div className="wrap flex h-20 items-center justify-between gap-6 lg:h-22">
      <a href="#top" className="block w-41 sm:w-47" aria-label={t('AlumiFlow, kembali ke atas')} onClick={() => setIsOpen(false)}><img src={brandWordmark} alt="AlumiFlow" width={480} height={160} className="block w-full" /></a>
      <nav className="hidden items-center gap-8 lg:flex" aria-label={t('Navigasi utama')}>
        {navLinks.map(link => <a key={link.href} href={link.href} className="text-sm font-bold text-slate-600 transition hover:text-[#0757a8]">{t(link.label)}</a>)}
        <div className="lang-switch" role="group" aria-label={t('Pilih bahasa')}><a href="/" lang="id" hrefLang="id" aria-current={locale === 'id' ? 'page' : undefined}>ID</a><a href="/en/" lang="en" hrefLang="en" aria-current={locale === 'en' ? 'page' : undefined}>EN</a></div>
        <a href="#demo" className="inline-flex items-center gap-5 rounded-lg bg-[#092653] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#0757a8]">{t('Jadwalkan Demo')} <ArrowUpRight size={16} /></a>
      </nav>
      <div className="flex items-center gap-2 lg:hidden"><div className="lang-switch" role="group" aria-label={t('Pilih bahasa')}><a href="/" lang="id" hrefLang="id" aria-current={locale === 'id' ? 'page' : undefined}>ID</a><a href="/en/" lang="en" hrefLang="en" aria-current={locale === 'en' ? 'page' : undefined}>EN</a></div><button type="button" className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 text-[#092653]" aria-controls="mobile-nav" aria-expanded={isOpen} aria-label={t(isOpen ? 'Tutup menu' : 'Buka menu')} onClick={() => setIsOpen(!isOpen)}>
        <span className="flex w-5 flex-col gap-1.5"><span className="h-0.5 w-full bg-current" /><span className="h-0.5 w-full bg-current" /><span className="h-0.5 w-full bg-current" /></span>
      </button></div>
    </div>
    {isOpen && <nav id="mobile-nav" className="absolute inset-x-0 top-full flex flex-col border-t border-slate-100 bg-white px-6 py-4 shadow-xl lg:hidden" aria-label={t('Navigasi mobile')}>
      {navLinks.map(link => <a key={link.href} href={link.href} className="py-3 text-sm font-bold text-slate-700" onClick={() => setIsOpen(false)}>{t(link.label)}</a>)}
      <a href="#demo" className="mt-2 flex items-center justify-between rounded-lg bg-[#092653] px-5 py-4 text-sm font-bold text-white" onClick={() => setIsOpen(false)}>{t('Jadwalkan Demo')} <ArrowUpRight size={16} /></a>
    </nav>}
  </header>;
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const range = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(range > 0 ? Math.min(100, window.scrollY / range * 100) : 0);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <div className="read-progress" style={{ width: progress + '%' }} aria-hidden="true" />;
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <span className={`mb-5 inline-flex items-center gap-2.5 text-[11px] font-extrabold tracking-[.16em] uppercase ${light ? 'text-[#8ee7f2]' : 'text-[#0757a8]'}`}><span className={`h-1.5 w-1.5 rounded-full ${light ? 'bg-[#26d5e6]' : 'bg-[#08bcd7]'}`} />{children}</span>;
}

function PrimaryLink({ children, href = '#demo', light = false }: { children: ReactNode; href?: string; light?: boolean }) {
  return <a href={href} className={`inline-flex min-h-14 items-center justify-center gap-7 rounded-lg px-6 py-4 text-sm font-extrabold transition hover:-translate-y-0.5 ${light ? 'bg-white text-[#092653] hover:bg-[#e4f8fc]' : 'bg-[#13c4dd] text-[#072b4c] shadow-[0_14px_35px_rgba(0,190,225,.18)] hover:bg-[#65e4ef]'}`}>{children}<ArrowUpRight size={17} /></a>;
}

function Hero() {
  const { t } = useLanguage();
  return <section className="hero-bg relative overflow-hidden bg-[#061c43] text-white" aria-labelledby="hero-title"><div className="wrap relative grid items-center gap-16 pt-18 pb-24 lg:min-h-[690px] lg:grid-cols-[.98fr_1.02fr] lg:gap-12 lg:py-21">
    <div className="relative z-10 max-w-[640px]"><Eyebrow light>{t('Pilot terbatas untuk workshop kaca & aluminium')}</Eyebrow><h1 id="hero-title" className="font-display text-[clamp(2.85rem,5.2vw,5rem)] leading-[1.075] font-extrabold tracking-[-.065em]">{t('Satu order.')} <span className="text-[#72dfed]">{t('Banyak langkah.')}</span> {t('Satu flow.')}</h1><p className="mt-6 max-w-[550px] text-base leading-[1.8] text-[#c2d7e9] sm:text-lg">{t('Dari pesan pertama pelanggan sampai pembayaran selesai, AlumiFlow membantu tim kantor dan lapangan mengikuti pekerjaan yang sama.')}</p><div className="mt-8 flex flex-wrap items-center gap-6"><PrimaryLink href="#cara-kerja">{t('Lihat alurnya')}</PrimaryLink><a href="#demo" className="inline-flex items-center gap-3 border-b border-white/50 pb-1 text-sm font-bold text-white transition hover:border-[#72dfed] hover:text-[#72dfed]">{t('Jadwalkan Demo')} <span aria-hidden="true">↗</span></a></div><div className="mt-11 flex items-center gap-3 text-xs text-[#9bb9d2]"><span className="h-px w-7 bg-[#5bcfe3]" />{t('Pilih tahap untuk melihat alurnya')}</div></div>
    <div className="relative z-10"><HeroPreview /></div>
  </div></section>;
}

const pains = [
  ['01', 'Informasi tersebar', 'Chat pelanggan, ukuran, foto, dan jadwal ada di tempat berbeda. Tim harus mencari ulang konteks pekerjaan.'],
  ['02', 'Proses sulit diikuti', 'Hasil survei sudah ada, tetapi langkah menuju penawaran, pekerjaan, dan pemasangan belum terlihat jelas.'],
  ['03', 'Owner harus mengejar update', 'Status tugas, kendala lapangan, material, dan tagihan membutuhkan banyak konfirmasi manual.'],
];

function Problems() {
  const { t } = useLanguage();
  return <section id="cerita" className="section-space bg-white" aria-labelledby="problem-title"><div className="wrap grid gap-13 lg:grid-cols-[1fr_1fr] lg:gap-24"><div data-reveal><Eyebrow>{t('Bab 01 · Yang sering terjadi')}</Eyebrow><h2 id="problem-title" className="section-title max-w-[540px]">{t('Order masuk. Lalu ceritanya terpecah.')}</h2><p className="mt-5 max-w-[480px] leading-[1.75] text-slate-500">{t('Satu pekerjaan melewati banyak tangan. Saat informasinya tercecer, setiap orang perlu menyusun ulang apa yang sebenarnya terjadi.')}</p><div className="problem-bridge"><span aria-hidden="true">↘</span> {t('Bagaimana kalau satu pekerjaan punya alur yang bisa diikuti bersama?')}</div></div><div className="divide-y divide-slate-200 border-t border-slate-200">{pains.map(([number, title, body]) => <div data-reveal key={number} className="grid grid-cols-[39px_1fr] gap-4 py-6 sm:py-7"><span className="pt-1 text-xs font-extrabold text-[#14abc7]">{number}</span><div><h3 className="font-display text-lg font-extrabold tracking-tight">{t(title)}</h3><p className="mt-2 text-sm leading-[1.75] text-slate-500">{t(body)}</p></div></div>)}</div></div></section>;
}

const features: { title: string; body: string; icon: Parameters<typeof Icon>[0]['kind'] }[] = [
  { title: 'Customer & survei', body: 'Mulai dari kebutuhan pelanggan, jadwal kunjungan, dan hasil survei yang bisa ditindaklanjuti.', icon: 'users' },
  { title: 'Ukuran & dokumentasi', body: 'Catat pengukuran, lokasi, catatan, dan foto bersama konteks pekerjaan yang tepat.', icon: 'measure' },
  { title: 'Penawaran & persetujuan', body: 'Teruskan hasil survei menjadi penawaran dan ketahui kapan pekerjaan siap dilanjutkan.', icon: 'document' },
  { title: 'Job & instalasi', body: 'Koordinasikan tugas, progres, kendala, dan bukti pemasangan dari tim lapangan.', icon: 'tools' },
  { title: 'Material & pembelian', body: 'Hubungkan kebutuhan material dengan perencanaan dan aktivitas pekerjaan workshop.', icon: 'boxes' },
  { title: 'Tagihan & pembayaran', body: 'Ikuti pekerjaan hingga invoice, payment, dan gambaran operasional yang lebih jelas.', icon: 'chart' },
];

function Features() {
  const { t } = useLanguage();
  return <section id="fitur" className="section-space bg-white" aria-labelledby="features-title"><div className="wrap grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-22"><div className="lg:sticky lg:top-12 lg:self-start" data-reveal><Eyebrow>{t('Bab 03 · Yang ikut terhubung')}</Eyebrow><h2 id="features-title" className="section-title">{t('Cerita yang utuh butuh detail yang tepat.')}</h2><p className="mt-5 max-w-[470px] leading-[1.75] text-slate-500">{t('Dari kebutuhan awal sampai tagihan, tiap bagian punya informasi yang dibutuhkan tim untuk melanjutkan pekerjaan.')}</p><a href="#demo" className="mt-6 inline-flex items-center gap-3 border-b border-[#0757a8] pb-1 text-sm font-bold text-[#0757a8] hover:text-[#0da9c8]">{t('Lihat dalam demo')} <ArrowUpRight size={16} /></a></div><div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">{features.map(feature => <article key={feature.title} className="feature-story border-t border-slate-200 pt-6" data-reveal><span className="mb-6 grid h-13 w-13 place-items-center rounded-xl bg-[#e9f8fc] text-[#0757a8]"><Icon kind={feature.icon} /></span><h3 className="font-display text-lg font-extrabold">{t(feature.title)}</h3><p className="mt-2 text-sm leading-[1.75] text-slate-500">{t(feature.body)}</p></article>)}</div></div></section>;
}

function Guides() {
  const { locale } = useLanguage();
  const isId = locale === 'id';
  return <section id="panduan" className="section-space bg-[#edf5f9]" aria-labelledby="guides-title"><div className="wrap"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#0757a8]">{isId ? 'Panduan untuk workshop' : 'Guides for workshops'}</p><h2 id="guides-title" className="section-title mt-4 max-w-[760px] text-[#092653]">{isId ? 'Jawaban praktis untuk pekerjaan sehari-hari.' : 'Practical answers for everyday work.'}</h2><p className="mt-5 max-w-[660px] leading-8 text-slate-600">{isId ? 'Mulai dari cara menyerahkan hasil survei sampai membaca progres order tanpa mengejar kabar satu per satu.' : 'From handing off a site survey to following order progress without chasing every update.'}</p><div className="mt-10 grid gap-5 md:grid-cols-2">{(['survey', 'progress'] as GuideKey[]).map((key, index) => { const guide = guideSummaries[key][locale]; const path = guidePaths[key][locale]; return <article key={key} className="rounded-2xl border border-[#dcebf2] bg-white p-7 shadow-[0_12px_35px_rgba(5,46,88,.05)] sm:p-9"><span className="text-xs font-extrabold text-[#079dbc]">0{index + 1} / {isId ? 'PANDUAN' : 'GUIDE'}</span><h3 className="font-display mt-4 text-2xl font-extrabold leading-snug text-[#102b4c]"><a href={path} className="hover:text-[#0757a8]">{guide.title}</a></h3><p className="mt-4 text-sm leading-7 text-slate-600">{guide.description}</p><a href={path} className="mt-6 inline-block text-sm font-extrabold text-[#0757a8] hover:underline">{isId ? 'Baca panduan ↗' : 'Read the guide ↗'}</a></article>; })}</div></div></section>;
}

const faqs = [
  ['Apakah AlumiFlow sudah bisa dicoba?', 'AlumiFlow sedang membuka pilot terbatas. Jadwalkan demo agar kami bisa memahami alur workshopmu dan menjelaskan proses uji coba yang tersedia.'],
  ['Apakah tim lapangan harus selalu online?', 'AlumiFlow Field mendukung pencatatan aktivitas tertentu ketika koneksi terbatas. Data yang menunggu dapat disinkronkan setelah koneksi kembali.'],
  ['Apakah ada harga langganan?', 'Skema pilot dan kebutuhan workshop dibahas saat demo. Informasi paket akan dijelaskan sebelum kamu memutuskan untuk bergabung.'],
  ['Siapa yang menggunakan AlumiFlow Field?', 'Surveyor dan installer memakai aplikasi Field untuk melihat tugas dan mencatat hasil pekerjaan di lapangan. Pengelolaan operasional dilakukan melalui web.'],
];

function Faq() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);
  return <section id="faq" className="section-space bg-white" aria-labelledby="faq-title"><div className="wrap grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:gap-22"><div><Eyebrow>{t('Pertanyaan umum')}</Eyebrow><h2 id="faq-title" className="section-title max-w-[440px]">{t('Kenalan dulu dengan AlumiFlow.')}</h2></div><div className="border-t border-slate-200">{faqs.map(([question, answer], i) => <div key={question} className="border-b border-slate-200"><h3><button type="button" className="flex w-full items-center justify-between gap-5 py-5 text-left font-display text-sm font-extrabold text-[#102b4c] sm:text-base" aria-expanded={open === i} aria-controls={`faq-answer-${i}`} onClick={() => setOpen(open === i ? null : i)}>{t(question)}<span className={`text-2xl font-normal text-[#0757a8] transition-transform ${open === i ? 'rotate-45' : ''}`} aria-hidden="true">+</span></button></h3><div id={`faq-answer-${i}`} hidden={open !== i} className="max-w-[620px] pb-6 text-sm leading-[1.75] text-slate-500">{t(answer)}</div></div>)}</div></div></section>;
}

function DemoForm() {
  const { t } = useLanguage();
  const [notice, setNotice] = useState('Isi data singkat, lalu lanjutkan permintaan demo melalui WhatsApp.');
  const [hasError, setHasError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!/^\d{10,16}$/.test(DEMO_WHATSAPP_NUMBER)) {
      setNotice('Kontak demo belum tersedia. Silakan coba kembali setelah pendaftaran dibuka.');
      setHasError(true);
      return;
    }
    const values = new FormData(form);
    const read = (key: string) => String(values.get(key) ?? '').trim();
    const message = [
      t('Halo tim AlumiFlow, saya ingin menjadwalkan demo.'),
      '',
      t('Nama:') + ' ' + read('name'),
      t('Workshop:') + ' ' + read('business'),
      t('Nomor WhatsApp:') + ' ' + read('phone'),
      t('Kota:') + ' ' + read('city'),
      t('Kebutuhan:') + ' ' + (read('needs') || t('Belum diisi')),
    ].join('\n');
    setNotice('WhatsApp terbuka dengan pesan permintaan demo. Tekan Kirim untuk menghubungi tim kami.');
    setHasError(false);
    window.location.assign(`https://wa.me/${DEMO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
  }

  return <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 text-[#102b4c] shadow-[0_28px_70px_rgba(0,8,34,.18)] sm:p-9"><div className="mb-6 flex items-center justify-between font-display text-xl font-extrabold tracking-tight"><span>{t('Permintaan demo')}</span><ArrowUpRight size={21} /></div><div className="grid gap-4 sm:grid-cols-2">
    <label className="form-field">{t('Nama kamu')} <span aria-hidden="true">*</span><input name="name" type="text" autoComplete="name" required maxLength={100} placeholder={t('Nama lengkap')} /></label>
    <label className="form-field">{t('Nama workshop')} <span aria-hidden="true">*</span><input name="business" type="text" autoComplete="organization" required maxLength={120} placeholder={t('Nama usaha')} /></label>
    <label className="form-field">{t('Nomor WhatsApp')} <span aria-hidden="true">*</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required minLength={9} maxLength={20} placeholder={t('Nomor yang bisa dihubungi')} /></label>
    <label className="form-field">{t('Kota')} <span aria-hidden="true">*</span><input name="city" type="text" autoComplete="address-level2" required maxLength={100} placeholder={t('Kota operasional')} /></label>
    <label className="form-field sm:col-span-2">{t('Yang ingin kamu rapikan')}<textarea name="needs" rows={3} maxLength={500} placeholder={t('Contoh: survei, penawaran, atau instalasi')} /></label>
  </div><button type="submit" className="mt-5 flex min-h-14 w-full items-center justify-between rounded-lg bg-[#13c4dd] px-5 text-sm font-extrabold text-[#072b4c] transition hover:bg-[#65e4ef]">{t('Jadwalkan Demo')} <ArrowUpRight size={17} /></button><p role="status" className={`mt-3 text-xs leading-relaxed ${hasError ? 'text-red-700' : 'text-slate-500'}`}>{t(notice)}</p></form>;
}

function Demo() {
  const { t } = useLanguage();
  return <section id="demo" className="section-space bg-[#061c43] text-white" aria-labelledby="demo-title"><div className="wrap grid items-start gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-22"><div className="lg:pt-8"><Eyebrow light>{t('Mulai dari obrolan')}</Eyebrow><h2 id="demo-title" className="section-title max-w-[620px]">{t('Lihat bagaimana AlumiFlow cocok dengan cara kerja workshopmu.')}</h2><p className="mt-5 max-w-[480px] leading-[1.8] text-[#bad2e6]">{t('Ceritakan sedikit kebutuhanmu. Kami akan menyiapkan percakapan awal dan menunjukkan alur yang relevan.')}</p><p className="mt-9 border-t border-white/20 pt-5 text-xs text-[#8aafca]">{t('Meminta demo tidak berarti kamu harus langsung berlangganan.')}</p></div><DemoForm /></div></section>;
}

function Footer() {
  const { t } = useLanguage();
  return <footer className="bg-[#f8fbfd]"><div className="wrap flex flex-col justify-between gap-7 py-11 sm:flex-row sm:items-center"><div><a href="#top" className="block w-44" aria-label={t('AlumiFlow, kembali ke atas')}><img src={brandWordmark} alt="AlumiFlow" width={480} height={160} /></a><p className="mt-2 max-w-62 text-sm leading-relaxed text-slate-500">{t('Operasional yang lebih jelas untuk usaha kaca dan aluminium.')}</p></div><a href="#top" className="text-sm font-bold text-[#0757a8] hover:underline">{t('Kembali ke atas ↑')}</a></div><div className="wrap flex flex-col justify-between gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row"><span>© {new Date().getFullYear()} AlumiFlow. {t('Semua hak dilindungi.')}</span><span>{t('Customer · Survey · Job · Payment')}</span></div></footer>;
}

export default function App() {
  const { t } = useLanguage();
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    targets.forEach(target => { target.classList.add('will-reveal'); observer.observe(target); });
    return () => observer.disconnect();
  }, []);
  return <><a href="#main" className="skip-link">{t('Langsung ke konten')}</a><ReadingProgress /><div id="top"><Header /></div><main id="main"><Hero /><Problems /><Story /><Features /><Viewpoints /><Guides /><Faq /><Demo /></main><Footer /></>;
}
