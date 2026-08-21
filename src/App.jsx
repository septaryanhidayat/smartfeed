import { useState, useEffect, Suspense } from 'react';
import LandingPage from './landing/LandingPage.jsx';
import lazyWithRetry from './lazyWithRetry.js';

// Studio & Halaman Statis di-code-split agar landing page tetap super ringan
const StudioApp = lazyWithRetry(() => import('./StudioApp.jsx'), 'studio');
const AboutUs = lazyWithRetry(() => import('./pages/AboutUs.jsx'), 'about');
const PrivacyPolicy = lazyWithRetry(() => import('./pages/PrivacyPolicy.jsx'), 'privacy');
const TermsConditions = lazyWithRetry(() => import('./pages/TermsConditions.jsx'), 'terms');
const ContactUs = lazyWithRetry(() => import('./pages/ContactUs.jsx'), 'contact');

function getRoute() {
  if (typeof window === 'undefined') return 'landing';
  const host = window.location.host || '';
  const pathname = (window.location.pathname || '').toLowerCase().replace(/\/$/, '');
  const hash = (window.location.hash || '').toLowerCase().replace(/\/$/, '');

  if (
    host.startsWith('app.') ||
    pathname === '/app' ||
    pathname.startsWith('/app/') ||
    hash === '#/app' ||
    hash.startsWith('#/app/')
  ) {
    return 'studio';
  }

  if (
    pathname === '/tentang-kami' ||
    pathname === '/about' ||
    pathname === '/about-us' ||
    hash === '#/tentang-kami' ||
    hash === '#/about'
  ) {
    return 'about';
  }

  if (
    pathname === '/kebijakan-privasi' ||
    pathname === '/privacy' ||
    pathname === '/privacy-policy' ||
    hash === '#/kebijakan-privasi' ||
    hash === '#/privacy' ||
    hash === '#/privacy-policy'
  ) {
    return 'privacy';
  }

  if (
    pathname === '/syarat-ketentuan' ||
    pathname === '/terms' ||
    pathname === '/terms-conditions' ||
    pathname === '/terms-of-service' ||
    hash === '#/syarat-ketentuan' ||
    hash === '#/terms' ||
    hash === '#/terms-conditions'
  ) {
    return 'terms';
  }

  if (
    pathname === '/kontak' ||
    pathname === '/contact' ||
    pathname === '/contact-us' ||
    pathname === '/hubungi-kami' ||
    hash === '#/kontak' ||
    hash === '#/contact' ||
    hash === '#/hubungi-kami'
  ) {
    return 'contact';
  }

  return 'landing';
}

// Splash sederhana saat chunk sedang diunduh
function PageLoading({ label = 'Memuat halaman...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg">
      <img
        src="/favicon.jpg"
        alt="Logo"
        className="w-12 h-12 rounded-xl object-contain shadow-[0_0_24px_rgba(var(--accent-rgb),0.55)] animate-pulse"
      />
      <div className="text-xs text-text-mut mono uppercase tracking-widest">{label}</div>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onRouteChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onRouteChange);
    window.addEventListener('popstate', onRouteChange);
    return () => {
      window.removeEventListener('hashchange', onRouteChange);
      window.removeEventListener('popstate', onRouteChange);
    };
  }, []);

  useEffect(() => {
    if (route === 'studio') {
      document.title = 'Smart Feed Studio | Generator Konten & Desain Visual AI';
    } else if (route === 'about') {
      document.title = 'Tentang Kami | Smart Feed - Beranda Teknologi Digital';
    } else if (route === 'privacy') {
      document.title = 'Kebijakan Privasi | Smart Feed - Beranda Teknologi Digital';
    } else if (route === 'terms') {
      document.title = 'Syarat & Ketentuan | Smart Feed - Beranda Teknologi Digital';
    } else if (route === 'contact') {
      document.title = 'Hubungi Kami | Smart Feed - Beranda Teknologi Digital';
    } else {
      document.title = 'Smart Feed | Studio Visual Instan - Beranda Teknologi Digital';
    }
  }, [route]);

  if (route === 'studio') {
    return (
      <Suspense fallback={<PageLoading label="Memuat studio..." />}>
        <StudioApp />
      </Suspense>
    );
  }

  if (route === 'about') {
    return (
      <Suspense fallback={<PageLoading />}>
        <AboutUs />
      </Suspense>
    );
  }

  if (route === 'privacy') {
    return (
      <Suspense fallback={<PageLoading />}>
        <PrivacyPolicy />
      </Suspense>
    );
  }

  if (route === 'terms') {
    return (
      <Suspense fallback={<PageLoading />}>
        <TermsConditions />
      </Suspense>
    );
  }

  if (route === 'contact') {
    return (
      <Suspense fallback={<PageLoading />}>
        <ContactUs />
      </Suspense>
    );
  }

  return <LandingPage />;
}
