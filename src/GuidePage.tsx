import { guides } from './guides';
import { guidePaths, type GuideKey } from './guideLinks';
import { useLanguage } from './i18n';

function Arrow({ back = false }: { back?: boolean }) {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{back ? <path d="m10 5-7 7 7 7M3 12h18" /> : <path d="M5 19 19 5M6 5h13v13" />}</svg>;
}

function Check() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>;
}

export default function GuidePage({ guideKey }: { guideKey: GuideKey }) {
  const { locale } = useLanguage();
  const guide = guides[guideKey][locale];
  const otherKey: GuideKey = guideKey === 'survey' ? 'progress' : 'survey';
  const other = guides[otherKey][locale];
  const home = locale === 'id' ? '/' : '/en/';
  const isId = locale === 'id';
  const number = guideKey === 'survey' ? '01' : '02';

  return <div className="guide-page" id="top">
    <a href="#main" className="skip-link">{isId ? 'Langsung ke konten' : 'Skip to content'}</a>
    <header className="guide-header">
      <div className="guide-wrap guide-header-inner">
        <a href={home} className="brand-link" aria-label={isId ? 'AlumiFlow, ke beranda' : 'AlumiFlow, home'}><img src="/assets/alumiflow-wordmark-ui.webp" width="480" height="160" alt="AlumiFlow" /></a>
        <nav aria-label={isId ? 'Navigasi panduan' : 'Guide navigation'}>
          <a href={`${home}#panduan`} className="guide-header-back"><Arrow back />{isId ? 'Semua panduan' : 'All guides'}</a>
          <div className="guide-language" role="group" aria-label={isId ? 'Pilih bahasa' : 'Choose language'}>
            <a href={guidePaths[guideKey].id} lang="id" hrefLang="id" aria-current={isId ? 'page' : undefined}>ID</a>
            <a href={guidePaths[guideKey].en} lang="en" hrefLang="en" aria-current={!isId ? 'page' : undefined}>EN</a>
          </div>
          <a href={`${home}#demo`} className="guide-header-demo">{isId ? 'Jadwalkan Demo' : 'Book a Demo'}<Arrow /></a>
        </nav>
      </div>
    </header>
    <main id="main">
      <section className="guide-hero" aria-labelledby="guide-title">
        <div className="guide-hero-drawing" aria-hidden="true"><svg viewBox="0 0 300 300" fill="none"><path d="m70 100 110-55 75 38-110 55-75-38Zm0 0v128l75 38V138m110-55v128l-110 55m-37-147v128m37-45 110-55" stroke="currentColor" strokeWidth="1.5" /><path d="m35 122 110-55 75 38m-185 17v128l75 38m0-128v128l110-55V105L110 160l-75-38Z" stroke="currentColor" strokeWidth="1" strokeDasharray="4 5" /></svg></div>
        <div className="guide-wrap">
          <nav className="guide-breadcrumb" aria-label={isId ? 'Jejak halaman' : 'Breadcrumb'}><a href={home}>{isId ? 'Beranda' : 'Home'}</a><span aria-hidden="true">/</span><a href={`${home}#panduan`}>{isId ? 'Panduan' : 'Guides'}</a><span aria-hidden="true">/</span><span aria-current="page">{number}</span></nav>
          <p className="guide-eyebrow"><span />{guide.eyebrow}</p>
          <h1 id="guide-title">{guide.title.split(' | ')[0]}</h1>
          <p className="guide-intro">{guide.intro}</p>
          <div className="guide-hero-meta"><span>{isId ? 'PANDUAN' : 'GUIDE'} {number}</span><span>{guide.steps.length} {isId ? 'langkah praktis' : 'practical steps'}</span><a href="#steps-title">{isId ? 'Mulai membaca' : 'Start reading'}<span aria-hidden="true">↓</span></a></div>
        </div>
      </section>
      <div className="guide-wrap guide-layout">
        <article className="guide-article" aria-label={guide.title.split(' | ')[0]}>
          <section aria-labelledby="summary-title" className="guide-summary">
            <p className="guide-section-label">{isId ? 'SEBELUM MULAI' : 'BEFORE YOU START'}</p>
            <h2 id="summary-title">{isId ? 'Inti panduan' : 'Key takeaways'}</h2>
            <ul>{guide.summary.map(item => <li key={item}><span className="guide-check"><Check /></span><span>{item}</span></li>)}</ul>
          </section>
          <section aria-labelledby="steps-title" className="guide-steps">
            <div className="guide-section-heading"><div><p className="guide-section-label">{isId ? 'DARI SATU TAHAP KE TAHAP BERIKUTNYA' : 'FROM ONE STAGE TO THE NEXT'}</p><h2 id="steps-title">{isId ? 'Langkah demi langkah' : 'Step by step'}</h2></div><span aria-hidden="true">01—{String(guide.steps.length).padStart(2, '0')}</span></div>
            <div>{guide.steps.map((step, index) => <section key={step.title} id={`langkah-${index + 1}`} className="guide-step" aria-labelledby={`step-title-${index + 1}`}>
              <span className="guide-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div><h3 id={`step-title-${index + 1}`}>{step.title}</h3><p>{step.body}</p><p className="guide-step-check"><strong>{isId ? 'Periksa: ' : 'Check: '}</strong>{step.check}</p></div>
            </section>)}</div>
          </section>
          <section className="guide-example" aria-labelledby="example-title"><p className="guide-section-label">{isId ? 'GAMBARAN DI LAPANGAN' : 'IN PRACTICE'}</p><h2 id="example-title">{guide.exampleTitle}</h2><p>{guide.example}</p></section>
          <section className="guide-practice" aria-labelledby="practice-title"><p className="guide-section-label">{isId ? 'BIAR TIDAK ADA YANG TERLEWAT' : 'KEEP EVERY DETAIL IN VIEW'}</p><h2 id="practice-title">{guide.practiceTitle}</h2><ul>{guide.practices.map(item => <li key={item}><span className="guide-check"><Check /></span><span>{item}</span></li>)}</ul></section>
          <p className="guide-closing">{guide.closing}</p>
          <a href={`${home}#panduan`} className="guide-back-link"><Arrow back />{isId ? 'Kembali ke semua panduan' : 'Back to all guides'}</a>
        </article>
        <aside className="guide-sidebar" aria-label={isId ? 'Navigasi artikel dan panduan lain' : 'Article navigation and more guides'}>
          <nav className="guide-toc" aria-label={isId ? 'Dalam panduan ini' : 'In this guide'}><p className="guide-section-label">{isId ? 'DALAM PANDUAN INI' : 'IN THIS GUIDE'}</p><ol>{guide.steps.map((step, index) => <li key={step.title}><a href={`#langkah-${index + 1}`}><span>{String(index + 1).padStart(2, '0')}</span>{step.title}</a></li>)}</ol><a className="guide-toc-checklist" href="#practice-title"><Check />{isId ? 'Checklist praktis' : 'Practical checklist'}</a></nav>
          <section className="guide-next" aria-labelledby="next-guide-title"><p className="guide-section-label">{isId ? 'BACA BERIKUTNYA' : 'READ NEXT'}</p><h2 id="next-guide-title"><a href={other.path}>{other.title.split(' | ')[0]}<Arrow /></a></h2><p>{other.description}</p></section>
          <section className="guide-demo" aria-labelledby="guide-demo-title"><span className="guide-demo-mark" aria-hidden="true">↗</span><h2 id="guide-demo-title">{isId ? 'Bawa alur ini ke workshopmu.' : 'Bring this flow to your workshop.'}</h2><p>{isId ? 'Ceritakan cara kerja timmu. Kita bahas alur yang paling relevan dalam demo AlumiFlow.' : 'Tell us how your team works. Explore a relevant workflow in an AlumiFlow demo.'}</p><a href={`${home}#demo`}>{isId ? 'Jadwalkan Demo' : 'Book a Demo'}<Arrow /></a></section>
        </aside>
      </div>
    </main>
    <footer className="guide-footer"><div className="guide-wrap"><div><a href={home} className="brand-link" aria-label={isId ? 'AlumiFlow, ke beranda' : 'AlumiFlow, home'}><img src="/assets/alumiflow-wordmark-ui.webp" width="480" height="160" alt="AlumiFlow" /></a><p>{isId ? 'Operasional yang lebih jelas untuk usaha kaca dan aluminium.' : 'Clearer operations for glass and aluminium businesses.'}</p></div><a href={home}>{isId ? 'Kembali ke beranda' : 'Back to home'}<Arrow /></a></div><div className="guide-wrap guide-footer-meta"><span>© AlumiFlow</span><span>Customer · Survey · Job · Payment</span></div></footer>
  </div>;
}
