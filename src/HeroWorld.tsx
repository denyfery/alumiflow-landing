import { useEffect, useRef, useState, type PointerEvent } from 'react';
import WorkshopWorld, { project } from './WorkshopWorld';
import { useLanguage } from './i18n';

const stops = [
  { name: ['Customer', 'Customer'], title: ['Berawal dari satu obrolan.', 'It starts with a conversation.'], body: ['Kebutuhan pelanggan dan jadwal survei punya tempat yang sama.', 'Customer needs and survey schedules share one place.'], point: [128, 353, 75] },
  { name: ['Survei', 'Survey'], title: ['Ukuran, foto, satu konteks.', 'Measurements. Photos. Context.'], body: ['Hasil lapangan ikut terhubung ke pekerjaan yang tepat.', 'Field findings stay connected to the right job.'], point: [135, 112, 80] },
  { name: ['Workshop', 'Workshop'], title: ['Setiap detail, terhubung.', 'Every detail, connected.'], body: ['Penawaran, job, dan material membantu tim melanjutkan pekerjaan.', 'Quotes, jobs, and materials help the team move work forward.'], point: [455, 140, 72] },
  { name: ['Instalasi', 'Installation'], title: ['Tim lapangan, satu kabar.', 'Field teams. On the same page.'], body: ['Progres dan bukti pemasangan kembali ke alur yang sama.', 'Progress and installation evidence return to the same flow.'], point: [450, 412, 60] },
  { name: ['Pembayaran', 'Payment'], title: ['Rapi sampai pembayaran.', 'Clear through payment.'], body: ['Lanjutkan pekerjaan terverifikasi ke invoice dan pembayaran.', 'Take verified work through invoicing and payment.'], point: [133, 595, 65] },
] as const;

export default function HeroWorld() {
  const { locale } = useLanguage();
  const lang = locale === 'id' ? 0 : 1;
  const [active, setActive] = useState(2);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const syncMotion = useRef<() => void>(() => {});
  const moveScene = useRef<(x: number, y: number) => void>(() => {});
  const bounds = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (!root.current || !scene.current) return;
    const container = root.current;
    const layer = scene.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const animations: Animation[] = [];
    let visible = false;
    let frame = 0;
    let lastTime = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const canMove = () => visible && !document.hidden && !pausedRef.current && !media.matches;
    const animate = (element: Element | null, frames: Keyframe[], duration: number, delay = 0) => {
      if (!element || typeof element.animate !== 'function') return;
      const animation = element.animate(frames, { duration, delay, iterations: Infinity, easing: 'ease-in-out' });
      animation.pause();
      animations.push(animation);
    };
    const route = container.querySelector<SVGPolylineElement>('.world-route');
    animate(route, [{ strokeDashoffset: '0' }, { strokeDashoffset: '-90' }], 4500);
    const packet = container.querySelector('.world-order-packet');
    if (route && packet && typeof packet.animate === 'function') {
      const length = route.getTotalLength();
      const frames = Array.from({ length: 121 }, (_, index) => {
        const point = route.getPointAtLength(length * index / 120);
        return { transform: `translate(${point.x}px, ${point.y}px)`, opacity: index === 0 || index === 120 ? 0 : 1 };
      });
      const animation = packet.animate(frames, { duration: 16000, iterations: Infinity, easing: 'linear' });
      animation.pause();
      animations.push(animation);
    }
    animate(container.querySelector('.world-delivery-van'), [
      { transform: 'translate(0, 0)', offset: 0 },
      { transform: 'translate(-24px, -12px)', offset: .4 },
      { transform: 'translate(-24px, -12px)', offset: .6 },
      { transform: 'translate(0, 0)', offset: 1 },
    ], 12000);
    container.querySelectorAll('.world-worker-arms').forEach((arms, index) => {
      if (index !== 0 && index !== 1 && index !== 5) return;
      animate(arms, [{ transform: 'rotate(-6deg)' }, { transform: 'rotate(7deg)', offset: .5 }, { transform: 'rotate(-6deg)' }], 2800 + index * 250, index * 400);
    });

    const draw = (time: number) => {
      frame = 0;
      if (!canMove() || !finePointer.matches) return;
      const blend = 1 - Math.exp(-Math.max(16, time - lastTime) / 120);
      lastTime = time;
      currentX += (targetX - currentX) * blend;
      currentY += (targetY - currentY) * blend;
      layer.style.transform = `translate3d(${currentX * 7}px, ${currentY * 5}px, 0) rotate(${currentX * .45}deg)`;
      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > .001) frame = requestAnimationFrame(draw);
    };
    moveScene.current = (x, y) => {
      if (!canMove() || !finePointer.matches) return;
      targetX = x;
      targetY = y;
      if (!frame) { lastTime = performance.now(); frame = requestAnimationFrame(draw); }
    };
    const sync = () => {
      setReduced(media.matches);
      const moving = canMove();
      animations.forEach(animation => {
        if (moving) animation.play();
        else { animation.pause(); if (media.matches) animation.currentTime = 0; }
      });
      if (!moving) {
        cancelAnimationFrame(frame); frame = 0;
        currentX = currentY = targetX = targetY = 0;
        layer.style.transform = 'none';
      }
    };
    syncMotion.current = sync;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .1 });
    observer.observe(container);
    media.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      observer.disconnect();
      media.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      cancelAnimationFrame(frame);
      animations.forEach(animation => animation.cancel());
      layer.style.transform = 'none';
      syncMotion.current = () => {};
      moveScene.current = () => {};
    };
  }, []);

  useEffect(() => { pausedRef.current = paused; syncMotion.current(); }, [paused]);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !bounds.current) return;
    const rect = bounds.current;
    moveScene.current(Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)), Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)));
  };

  return <div ref={root} className="hero-world hero-world-interactive" data-active-stage={active} role="group" aria-label={lang === 0 ? 'Jelajahi dunia workshop AlumiFlow' : 'Explore the AlumiFlow workshop world'}
    onPointerEnter={event => { bounds.current = event.currentTarget.getBoundingClientRect(); }} onPointerMove={onPointerMove} onPointerLeave={() => { bounds.current = null; moveScene.current(0, 0); }}>
    <div className="hero-world-orbit orbit-one" aria-hidden="true" /><div className="hero-world-orbit orbit-two" aria-hidden="true" />
    <div ref={scene} className="hero-world-motion"><div className="hero-world-canvas">
      <WorkshopWorld />
      <div className="hero-world-spots" role="group" aria-label={lang === 0 ? 'Pilih area workshop' : 'Choose a workshop area'}>
        {stops.map((stop, index) => {
          const [x, y] = project(stop.point[0], stop.point[1], stop.point[2]);
          return <button key={stop.name[1]} type="button" className="hero-world-spot" aria-label={`${lang === 0 ? 'Jelajahi' : 'Explore'} ${stop.name[lang]}`} aria-pressed={active === index} aria-controls="hero-world-detail" style={{ left: `${(x + 80) / 1380 * 100}%`, top: `${(y + 80) / 920 * 100}%` }} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, '0')}</span></button>;
        })}
      </div>
    </div></div>
    <div id="hero-world-detail" className="world-pin pin-workshop hero-world-detail" role="status" aria-live="polite" aria-atomic="true">
      <span className="pin-icon" aria-hidden="true">0{active + 1}</span><div><small>{stops[active].name[lang]}</small><strong>{stops[active].title[lang]}</strong><p>{stops[active].body[lang]}</p></div><i aria-hidden="true" />
    </div>
    <div className="world-pin pin-order"><span className="pin-check" aria-hidden="true">✓</span><span><small>{lang === 0 ? 'SATU PEKERJAAN' : 'ONE CONNECTED JOB'}</small><strong>Customer <span>→</span> Payment</strong></span></div>
    <div className="hero-world-controls"><span>{lang === 0 ? 'Klik angka. Kenali alurnya.' : 'Pick a number. Explore the flow.'}</span>{reduced ? <span className="hero-motion-note">{lang === 0 ? 'Gerakan dikurangi' : 'Reduced motion'}</span> : <button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">{paused ? <path d="m5 3 8 5-8 5Z" /> : <path d="M4 3h3v10H4zm5 0h3v10H9z" />}</svg>{lang === 0 ? paused ? 'Putar animasi' : 'Jeda animasi' : paused ? 'Play animation' : 'Pause animation'}</button>}</div>
  </div>;
}
