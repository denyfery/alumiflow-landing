import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { findGuide } from './guideLinks';
import { LanguageProvider } from './i18n';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

const guideRoute = findGuide(window.location.pathname);
const locale = guideRoute?.locale ?? (window.location.pathname.startsWith('/en/') || window.location.pathname === '/en' ? 'en' : 'id');
async function start() {
  const GuidePage = guideRoute ? (await import('./GuidePage')).default : null;
  const app = (
    <StrictMode>
      <LanguageProvider locale={locale}>{GuidePage && guideRoute ? <GuidePage guideKey={guideRoute.key} /> : <App />}</LanguageProvider>
    </StrictMode>
  );
  if (root!.hasChildNodes()) hydrateRoot(root!, app);
  else createRoot(root!).render(app);
}

void start();
