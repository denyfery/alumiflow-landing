import { guides } from './guides';
import { guidePaths, type GuideKey } from './guideLinks';
import { useLanguage } from './i18n';

export default function GuidePage({ guideKey }: { guideKey: GuideKey }) {
  const { locale } = useLanguage();
  const guide = guides[guideKey][locale];
  const otherKey: GuideKey = guideKey === 'survey' ? 'progress' : 'survey';
  const other = guides[otherKey][locale];
  const home = locale === 'id' ? '/' : '/en/';
  const isId = locale === 'id';

  return <>
    <a href="#main" className="skip-link">{isId ? 'Langsung ke konten' : 'Skip to content'}</a>
    <header className="border-b border-slate-200 bg-white">
      <div className="wrap flex min-h-20 items-center justify-between gap-4 py-3">
        <a href={home} className="block w-38 sm:w-44" aria-label={isId ? 'AlumiFlow, ke beranda' : 'AlumiFlow, home'}><img src="/assets/alumiflow-wordmark-ui.webp" width="480" height="160" alt="AlumiFlow" /></a>
        <nav className="flex items-center gap-4 sm:gap-6" aria-label={isId ? 'Navigasi panduan' : 'Guide navigation'}>
          <a href={home} className="text-sm font-bold text-[#0757a8] hover:underline">{isId ? 'Beranda' : 'Home'}</a>
          <div className="lang-switch" role="group" aria-label={isId ? 'Pilih bahasa' : 'Choose language'}>
            <a href={guidePaths[guideKey].id} lang="id" hrefLang="id" aria-current={isId ? 'page' : undefined}>ID</a>
            <a href={guidePaths[guideKey].en} lang="en" hrefLang="en" aria-current={!isId ? 'page' : undefined}>EN</a>
          </div>
        </nav>
      </div>
    </header>
    <main id="main">
      <section className="bg-[#061c43] py-15 text-white sm:py-20">
        <div className="wrap max-w-5xl">
          <nav aria-label={isId ? 'Jejak halaman' : 'Breadcrumb'} className="mb-9 text-sm text-[#b9d5e6]"><a href={home} className="hover:underline">{isId ? 'Beranda' : 'Home'}</a><span aria-hidden="true"> / </span>{isId ? 'Panduan' : 'Guides'}</nav>
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[.14em] text-[#75deeb]">{guide.eyebrow}</p>
          <h1 className="font-display max-w-4xl text-[clamp(2.25rem,5vw,4.4rem)] leading-[1.14] font-extrabold tracking-[-.055em]">{guide.title.split(' | ')[0]}</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#c2d7e9] sm:text-lg">{guide.intro}</p>
        </div>
      </section>
      <div className="wrap grid max-w-6xl gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-18 lg:py-20">
        <article className="min-w-0">
          <section aria-labelledby="summary-title" className="rounded-2xl border border-[#cfe8f0] bg-[#eff9fc] p-6 sm:p-8">
            <h2 id="summary-title" className="font-display text-xl font-extrabold text-[#092653]">{isId ? 'Inti panduan' : 'Key takeaways'}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-[#294766] sm:text-base">{guide.summary.map(item => <li key={item}>{item}</li>)}</ul>
          </section>
          <section aria-labelledby="steps-title" className="mt-14">
            <h2 id="steps-title" className="font-display text-3xl font-extrabold tracking-tight text-[#092653]">{isId ? 'Langkah demi langkah' : 'Step by step'}</h2>
            <div className="mt-7 divide-y divide-slate-200 border-t border-slate-200">
              {guide.steps.map((step, index) => <section key={step.title} id={`langkah-${index + 1}`} className="scroll-mt-8 py-7">
                <div className="flex gap-5"><span className="pt-1 text-sm font-extrabold text-[#0784a8]">{String(index + 1).padStart(2, '0')}</span><div><h3 className="font-display text-xl font-extrabold text-[#102b4c]">{step.title}</h3><p className="mt-3 text-base leading-8 text-slate-600">{step.body}</p><p className="mt-4 border-l-2 border-[#13c4dd] pl-4 text-sm leading-7 text-[#315575]"><strong>{isId ? 'Periksa: ' : 'Check: '}</strong>{step.check}</p></div></div>
              </section>)}
            </div>
          </section>
          <section className="mt-8 rounded-2xl bg-[#092653] p-6 text-white sm:p-9" aria-labelledby="example-title"><h2 id="example-title" className="font-display text-2xl font-extrabold">{guide.exampleTitle}</h2><p className="mt-4 leading-8 text-[#d4e7f2]">{guide.example}</p></section>
          <section className="mt-13" aria-labelledby="practice-title"><h2 id="practice-title" className="font-display text-2xl font-extrabold text-[#092653]">{guide.practiceTitle}</h2><ul className="mt-5 list-disc space-y-3 pl-6 leading-8 text-slate-600">{guide.practices.map(item => <li key={item}>{item}</li>)}</ul></section>
          <p className="mt-12 border-t border-slate-200 pt-7 leading-8 text-slate-600">{guide.closing}</p>
        </article>
        <aside className="lg:self-start lg:sticky lg:top-7" aria-label={isId ? 'Panduan lain' : 'More guides'}>
          <div className="rounded-2xl border border-slate-200 p-6"><p className="text-xs font-extrabold uppercase tracking-widest text-[#0757a8]">{isId ? 'Baca berikutnya' : 'Read next'}</p><a href={other.path} className="mt-4 block font-display text-lg font-extrabold leading-7 text-[#102b4c] hover:text-[#0757a8]">{other.title.split(' | ')[0]} ↗</a><p className="mt-3 text-sm leading-6 text-slate-500">{other.description}</p></div>
          <div className="mt-5 rounded-2xl bg-[#e8f8fb] p-6"><p className="font-display text-lg font-extrabold text-[#092653]">{isId ? 'Lihat alurnya di AlumiFlow' : 'See the workflow in AlumiFlow'}</p><p className="mt-2 text-sm leading-6 text-[#315575]">{isId ? 'Ceritakan cara kerja workshopmu dalam sesi demo.' : 'Tell us how your workshop operates in a demo.'}</p><a href={`${home}#demo`} className="mt-4 inline-block font-bold text-[#0757a8] hover:underline">{isId ? 'Jadwalkan Demo ↗' : 'Book a Demo ↗'}</a></div>
        </aside>
      </div>
    </main>
    <footer className="border-t border-slate-200 bg-[#f8fbfd]"><div className="wrap flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-slate-600"><span>© AlumiFlow</span><a href={home} className="font-bold text-[#0757a8] hover:underline">{isId ? 'Kembali ke beranda' : 'Back to home'}</a></div></footer>
  </>;
}
