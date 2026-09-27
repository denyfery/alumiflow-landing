import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './i18n';

type Chapter = {
  label: string;
  title: string;
  body: string;
  steps: string;
  insight: string;
  stages: string[];
};

const chapters: Chapter[] = [
  {
    label: '01 / KEBUTUHAN',
    title: 'Semua dimulai dari cerita pelanggan.',
    body: 'Customer menghubungi workshop. Kebutuhan awal dicatat dan survei dijadwalkan. Saat surveyor berangkat, konteks pekerjaan sudah ikut dengannya.',
    steps: 'Customer → Survey',
    insight: 'Kebutuhan, lokasi, dan jadwal berada dalam konteks yang sama.',
    stages: ['Customer', 'Survey'],
  },
  {
    label: '02 / KEPUTUSAN',
    title: 'Hasil lapangan menjadi keputusan yang jelas.',
    body: 'Ukuran, foto, dan catatan survei diteruskan menjadi penawaran. Setelah disetujui, tim tahu kapan pekerjaan bisa dimulai.',
    steps: 'Quotation → Approval',
    insight: 'Penawaran punya dasar dari pengukuran dan dokumentasi.',
    stages: ['Quotation', 'Approval'],
  },
  {
    label: '03 / EKSEKUSI',
    title: 'Tim lapangan tahu apa yang harus dikerjakan.',
    body: 'Job, kebutuhan material, jadwal, dan instalasi terhubung. Tim mencatat progres, kendala, dan bukti kerja melalui AlumiFlow Field.',
    steps: 'Job → Installation',
    insight: 'Kabar dari lapangan kembali ke alur pekerjaan yang sama.',
    stages: ['Job', 'Installation'],
  },
  {
    label: '04 / PENYELESAIAN',
    title: 'Pekerjaan selesai. Ceritanya tetap utuh.',
    body: 'Setelah pekerjaan diverifikasi, tim melanjutkan ke invoice dan memantau pembayaran dengan jejak proses yang masih bisa diikuti.',
    steps: 'Invoice → Payment',
    insight: 'Status pekerjaan dan tagihan dapat ditelusuri bersama.',
    stages: ['Invoice', 'Payment'],
  },
];

function Tick() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>;
}

function FlowBoard({ active, compact = false }: { active: number; compact?: boolean }) {
  const { t } = useLanguage();
  return <div className={'story-board ' + (compact ? 'story-board-compact' : '')}>
    <div className="story-board-head"><span><img src="/assets/alumiflow-mark.png" alt="" /> AlumiFlow</span><small>{t('ILUSTRASI ALUR')}</small></div>
    <div className="story-board-content">
      <div className="story-board-label">{t('SATU PEKERJAAN · DARI AWAL SAMPAI AKHIR')}</div>
      <h3>{t('Langkah berikutnya')}<br /><span>{t('selalu terlihat.')}</span></h3>
      <div className="story-track">
        {chapters.map((item, index) => <div key={item.steps} className={'story-track-row ' + (index < active ? 'is-done' : '') + (index === active ? 'is-active' : '')}>
          <span className="story-track-index">{index < active ? <Tick /> : '0' + (index + 1)}</span>
          <span className="story-track-label"><strong>{t(item.steps)}</strong><small>{t(index < active ? 'Sudah dilalui' : index === active ? 'Sedang diceritakan' : 'Tahap berikutnya')}</small></span>
          {index === active && <span className="story-track-pulse" aria-hidden="true" />}
        </div>)}
      </div>
      <div className="story-board-insight"><span aria-hidden="true">↗</span>{t(chapters[active].insight)}</div>
    </div>
  </div>;
}

export default function Story() {
  const { t, locale } = useLanguage();
  const [active, setActive] = useState(0);
  const scenes = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const readingLine = window.innerHeight * .47;
        let closest = 0;
        let distance = Infinity;
        scenes.current.forEach((scene, index) => {
          if (!scene) return;
          const { top, bottom } = scene.getBoundingClientRect();
          const gap = top <= readingLine && bottom >= readingLine
            ? 0
            : Math.min(Math.abs(top - readingLine), Math.abs(bottom - readingLine));
          if (gap < distance) { distance = gap; closest = index; }
        });
        setActive(current => current === closest ? current : closest);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [locale]);

  return <section id="cara-kerja" className="story-section" aria-labelledby="story-title">
    <div className="wrap story-intro">
      <span className="story-eyebrow">{t('BAB 02 · BAGAIMANA ALUMIFLOW BEKERJA')}</span>
      <h2 id="story-title">{t('Ikuti satu pekerjaan')}<br /><em>{t('sampai tuntas.')}</em></h2>
      <p>{t('Gulir perlahan. Setiap bab menunjukkan bagaimana informasi bergerak dari satu tangan ke tangan berikutnya.')}</p>
    </div>
    <div className="wrap story-layout">
      <div className="story-sticky">
        <div className="story-count"><span>{t('ALUR PEKERJAAN')}</span><strong>0{active + 1} <small>/ 04</small></strong></div>
        <FlowBoard active={active} />
        <div className="story-nav" aria-label={t('Pilih bab cerita')}>
          {chapters.map((chapter, index) => <button key={chapter.steps} type="button" aria-current={active === index ? 'step' : undefined} className={active === index ? 'active' : ''} onClick={() => { setActive(index); scenes.current[index]?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' }); }}><span>0{index + 1}</span>{t(chapter.steps)}</button>)}
        </div>
      </div>
      <div className="story-scenes">
        {chapters.map((chapter, index) => <article className="story-scene" data-chapter={index} key={chapter.steps} ref={node => { scenes.current[index] = node; }}>
          <span className="scene-number">0{index + 1}<span /></span>
          <div className="scene-content">
            <span className="scene-label">{t(chapter.label)}</span>
            <h3>{t(chapter.title)}</h3>
            <p>{t(chapter.body)}</p>
            <div className="scene-stages">{chapter.stages.map(stage => <span key={stage}>{t(stage)}</span>)}</div>
            <div className="story-mobile-board"><FlowBoard active={index} compact /></div>
          </div>
        </article>)}
      </div>
    </div>
    <div className="wrap story-outro"><span className="outro-line" /><p>{t('Delapan tahap.')} <strong>{t('Satu cerita yang tersambung.')}</strong></p><a href="#untuk-tim">{t('Lihat dari sisi tim')} <span aria-hidden="true">→</span></a></div>
  </section>;
}
