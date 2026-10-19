import { useEffect, useRef, useState } from 'react';
import WorkshopWorld, { project } from './WorkshopWorld';
import { useLanguage } from './i18n';

const chapters = [
  { name: ['Customer', 'Customer'], title: ['Dari obrolan, jadi rencana.', 'From a conversation to a plan.'], body: ['Kebutuhan pelanggan, lokasi, dan jadwal survei masuk ke satu pekerjaan. Tim berikutnya tinggal melanjutkan.', 'Customer needs, location, and survey dates join one job. The next person can pick up right where you left off.'], tags: ['Customer', 'Survey schedule'], point: [135, 355], label: ['Kebutuhan dicatat', 'Needs captured'] },
  { name: ['Survei', 'Survey'], title: ['Ukuran tepat. Konteks lengkap.', 'Precise measurements. The full picture.'], body: ['Surveyor membawa tugas ke lokasi. Ukuran, foto, dan catatan kembali ke kantor dengan konteks yang sama.', 'Surveyors take their assignment on site. Measurements, photos, and notes return to the office with all the context.'], tags: ['AlumiFlow Field', 'Survey'], point: [130, 115], label: ['Hasil survei terhubung', 'Survey details connected'] },
  { name: ['Workshop', 'Workshop'], title: ['Siap dikerjakan, tanpa tebak-tebakan.', 'Ready to build. No guesswork.'], body: ['Hasil survei diteruskan ke penawaran dan persetujuan. Job dan kebutuhan material membantu workshop menentukan langkah berikutnya.', 'Survey findings flow into a quote and approval. Jobs and material needs help the workshop plan what comes next.'], tags: ['Quotation', 'Approval', 'Job'], point: [438, 125], label: ['Pekerjaan punya arah', 'Every job has a direction'] },
  { name: ['Instalasi', 'Installation'], title: ['Kantor dan lapangan, satu kabar.', 'Office and field. On the same page.'], body: ['Installer tahu tugasnya. Progres, kendala, dan bukti pemasangan mengikuti pekerjaan, supaya tim kantor tidak kehilangan kabar.', 'Installers know their assignment. Progress, issues, and installation evidence stay with the job, keeping the office informed.'], tags: ['Installation', 'AlumiFlow Field'], point: [437, 405], label: ['Bukti kerja tertata', 'Work evidence in place'] },
  { name: ['Pembayaran', 'Payment'], title: ['Selesai di lapangan. Rapi sampai pembayaran.', 'Done on site. Clear through payment.'], body: ['Pekerjaan yang sudah diverifikasi dilanjutkan ke invoice dan pembayaran. Dari pesan pertama sampai selesai, ceritanya tetap utuh.', 'Verified work continues to invoicing and payment. From the first message to the final step, the whole story stays connected.'], tags: ['Invoice', 'Payment'], point: [135, 590], label: ['Satu flow, sampai tuntas', 'One flow, all the way'] },
] as const;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function ScrollWorld() {
  const { locale } = useLanguage();
  const lang = locale === 'id' ? 0 : 1;
  const section = useRef<HTMLElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const manualActive = useRef(0);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shortScreen = window.matchMedia('(max-height: 600px)');
    const isStatic = () => media.matches || shortScreen.matches;
    let frame = 0;
    let current = 0;
    let target = 0;
    let lastTime = 0;
    let alive = true;
    const draw = (time: number) => {
      if (!alive || !section.current || !camera.current) return;
      const elapsed = Math.max(16, time - lastTime);
      lastTime = time;
      current += (target - current) * (1 - Math.exp(-elapsed / 65));
      if (Math.abs(current - target) < .0001) current = target;
      const step = current * (chapters.length - 1);
      const a = Math.floor(step);
      const b = Math.min(a + 1, chapters.length - 1);
      const mix = step - a;
      const ease = mix * mix * (3 - 2 * mix);
      const [ax, ay] = project(chapters[a].point[0], chapters[a].point[1]);
      const [bx, by] = project(chapters[b].point[0], chapters[b].point[1]);
      const x = ax + (bx - ax) * ease;
      const y = ay + (by - ay) * ease;
      // Pull back between destinations, then dive into the next part of the same world.
      const zoom = 1.62 - Math.sin(mix * Math.PI) * .52;
      camera.current.style.transform = isStatic() ? 'none' : `translate(${(610 - x) * zoom / 1380 * 100}%, ${(380 - y) * zoom / 920 * 100}%) scale(${zoom})`;
      const next = isStatic() ? manualActive.current : Math.round(step);
      setActive(previous => previous === next ? previous : next);
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${current})`;
      frame = Math.abs(current - target) > .0001 ? requestAnimationFrame(draw) : 0;
    };
    const update = () => {
      if (!section.current) return;
      const bounds = section.current.getBoundingClientRect();
      const header = document.querySelector('header')?.getBoundingClientRect().height ?? 80;
      target = isStatic() ? manualActive.current / (chapters.length - 1) : clamp((header - bounds.top) / (bounds.height - (window.innerHeight - header)));
      if (!frame) { lastTime = performance.now(); frame = requestAnimationFrame(draw); }
    };
    const preference = () => { setReduced(isStatic()); update(); };
    preference();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    media.addEventListener('change', preference);
    shortScreen.addEventListener('change', preference);
    return () => { alive = false; cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); media.removeEventListener('change', preference); shortScreen.removeEventListener('change', preference); };
  }, []);

  const goTo = (index: number) => {
    manualActive.current = index;
    if (reduced) { setActive(index); return; }
    if (!section.current) return;
    const header = document.querySelector('header')?.getBoundingClientRect().height ?? 80;
    const start = section.current.getBoundingClientRect().top + window.scrollY - header;
    const distance = section.current.offsetHeight - (window.innerHeight - header);
    window.scrollTo({ top: start + distance * index / (chapters.length - 1), behavior: 'smooth' });
  };

  return <section id="cara-kerja" ref={section} className={`scroll-world ${reduced ? 'is-reduced' : ''}`} aria-labelledby="world-title">
    <div className="world-viewport">
      <div className="world-grid" aria-hidden="true" />
      <div className="wrap world-topline"><span className="micro-label"><i /> {lang === 0 ? 'SATU ORDER. SATU PERJALANAN.' : 'ONE ORDER. ONE JOURNEY.'}</span><span className="world-mode">{lang === 0 ? 'JELAJAHI ALURNYA' : 'EXPLORE THE FLOW'} <span aria-hidden="true">↘</span></span></div>
      <div className="world-art-window"><div ref={camera} className="world-camera"><WorkshopWorld /></div><div className="world-location"><span className="location-dot" />{chapters[active].label[lang]}</div></div>
      <div className="world-shade" aria-hidden="true" />
      <div className="wrap world-content">
        <div className="world-chapter"><span className="world-chapter-count">0{active + 1}<small>/ 05</small></span><span>{chapters[active].name[lang]}</span></div>
        <h2 id="world-title" className="sr-only">{lang === 0 ? 'Jelajahi satu pekerjaan di AlumiFlow' : 'Explore one job in AlumiFlow'}</h2>
        {chapters.map((chapter, index) => <article key={chapter.name[1]} hidden={active !== index} className="world-copy">
          <h3>{chapter.title[lang]}</h3><p>{chapter.body[lang]}</p><div className="world-tags">{chapter.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          {index === chapters.length - 1 && <a className="world-cta" href="#demo">{lang === 0 ? 'Bahas alur workshopmu' : 'Discuss your workflow'} <span aria-hidden="true">↗</span></a>}
        </article>)}
      </div>
      <div className="world-bottom wrap"><nav className="world-nav" aria-label={lang === 0 ? 'Tahap perjalanan order' : 'Order journey stages'}>{chapters.map((chapter, index) => <button key={chapter.name[1]} type="button" aria-current={active === index ? 'step' : undefined} onClick={() => goTo(index)}><span>0{index + 1}</span><strong>{chapter.name[lang]}</strong><i /></button>)}</nav><div className="world-bottom-caption"><span>{lang === 0 ? 'Ilustrasi alur AlumiFlow' : 'Illustration of the AlumiFlow workflow'}</span><span>{reduced ? (lang === 0 ? 'Pilih tahap untuk menjelajah' : 'Select a stage to explore') : (lang === 0 ? 'Scroll untuk melanjutkan' : 'Scroll to continue')} <span aria-hidden="true">↓</span></span></div></div>
      <div className="world-scroll-progress" aria-hidden="true"><span ref={progressBar} /></div>
    </div>
    <noscript><style>{'.scroll-world{height:auto}.world-viewport{position:relative;top:0}'}</style><div className="wrap world-nojs">{chapters.map(chapter => <article key={chapter.name[1]}><h3>{chapter.title[lang]}</h3><p>{chapter.body[lang]}</p></article>)}</div></noscript>
  </section>;
}
