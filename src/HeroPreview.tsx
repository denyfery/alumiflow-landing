import { useEffect, useState } from 'react';
import { useLanguage } from './i18n';

const steps = [
  { title: 'Customer & kebutuhan', detail: 'Kebutuhan dicatat, survei dijadwalkan.' },
  { title: 'Survei & pengukuran', detail: 'Ukuran, lokasi, dan foto masuk ke pekerjaan.' },
  { title: 'Penawaran & persetujuan', detail: 'Hasil survei menjadi penawaran untuk disetujui.' },
  { title: 'Pekerjaan & pemasangan', detail: 'Tim lapangan melanjutkan pekerjaan dan bukti pemasangan.' },
] as const;

function Check() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>;
}

export default function HeroPreview() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [playing, setPlaying] = useState(!reducedMotion);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (!playing || hovered || reducedMotion) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % steps.length), 4200);
    return () => window.clearInterval(timer);
  }, [playing, hovered, reducedMotion]);

  return <div className="hero-art relative mx-auto w-full max-w-[570px] lg:ml-auto" aria-label={t('SIMULASI SATU PEKERJAAN')}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setHovered(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovered(false); }}>
    <div className="absolute -inset-9 rounded-full border border-white/8" aria-hidden="true" />
    <div className="absolute -inset-19 rounded-full border border-white/6" aria-hidden="true" />
    <div className="absolute -top-5 right-3 z-10 flex items-center gap-2 rounded-lg bg-white px-3.5 py-2.5 text-[11px] font-bold text-[#092653] shadow-xl sm:right-0"><span className="grid h-5 w-5 place-items-center rounded bg-emerald-50 text-emerald-600"><Check /></span> {t('Informasi tetap terhubung')}</div>
    <div className="relative overflow-hidden rounded-[21px] border border-white/25 bg-white text-[#102b4c] shadow-[0_35px_90px_rgba(0,4,30,.35)] lg:rotate-[-2deg]">
      <div className="flex h-15 items-center justify-between border-b border-[#e9eef4] px-5 sm:px-7"><div className="flex items-center gap-2 font-display text-sm font-extrabold"><img src="/assets/alumiflow-mark.png" className="h-7 w-7 object-contain" alt="" /> AlumiFlow</div><span className="rounded-full bg-[#e9f6fa] px-2.5 py-1 text-[10px] font-bold text-[#0757a8]">{t('Overview')}</span></div>
      <div className="px-5 pt-7 pb-6 sm:px-8 sm:pt-8 sm:pb-8"><div className="mb-2 text-[10px] font-extrabold tracking-[.16em] text-[#0a93b7]">{t('SIMULASI SATU PEKERJAAN')}</div><h2 className="max-w-xs font-display text-[23px] leading-[1.3] font-extrabold tracking-[-.045em] sm:text-[27px]">{t('Satu pekerjaan, langkahnya terlihat jelas.')}</h2>
        <div className="mt-5 space-y-2.5">{steps.map((step, index) => {
          const done = index < active;
          const current = index === active;
          return <button type="button" key={step.title} aria-pressed={current} onClick={() => { setActive(index); setPlaying(false); }}
            className={'hero-step relative flex w-full items-center gap-3 overflow-hidden rounded-xl border px-3 py-3 text-left sm:px-4 ' + (current ? 'border-cyan-200 bg-[#eefdff]' : 'border-slate-100 bg-white')}>
            <span className={'grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[11px] font-extrabold ' + (current ? 'bg-[#092653] text-white' : 'bg-[#e9f6fa] text-[#0757a8]')}>{String(index + 1).padStart(2, '0')}</span>
            <span className="min-w-0 flex-1 truncate text-xs font-bold sm:text-sm">{t(step.title)}</span>
            <span className={'hidden text-[10px] font-bold sm:inline ' + (current ? 'text-[#0757a8]' : 'text-slate-400')}>{t(done ? 'Selesai' : current ? 'Sedang berjalan' : 'Berikutnya')}</span>
            {done ? <span className="text-emerald-500"><Check /></span> : current ? <span className="text-[#0757a8]" aria-hidden="true">↗</span> : null}
            {current && playing && <span key={index + '-' + (hovered ? 'paused' : 'playing')} className="hero-step-progress" style={{ animationPlayState: hovered ? 'paused' : 'running' }} aria-hidden="true" />}
          </button>;
        })}</div>
        <div className="hero-detail" aria-live={playing ? 'off' : 'polite'}><span className="hero-detail-dot" />{t(steps[active].detail)}</div>
        <div className="hero-preview-controls"><span>{t('Pilih tahap untuk melihat alurnya')}</span>{!reducedMotion && <button type="button" onClick={() => { setHovered(false); setPlaying(!playing); }} aria-label={t(playing ? 'Jeda animasi' : 'Putar animasi')}>{playing ? 'Ⅱ' : '▶'} <span>{t(playing ? 'Jeda animasi' : 'Putar animasi')}</span></button>}</div>
      </div>
    </div>
    <div className="absolute -bottom-5 -left-2 z-10 flex items-center gap-2 rounded-lg bg-white px-3.5 py-2.5 text-[11px] font-bold text-[#092653] shadow-xl sm:-left-7"><span className="grid h-5 w-5 place-items-center rounded bg-[#e5f8fd] text-[#0757a8]" aria-hidden="true">↗</span> {t('Dari kantor ke lapangan')}</div>
    <div className="mt-9 text-right text-[9px] font-bold tracking-[.18em] text-[#82a7c5]">{t('ILUSTRASI PRODUK')}</div>
  </div>;
}
