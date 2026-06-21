/**
 * Entry point
 *
 * Order is significant:
 *   1. Import the GSAP setup so plugins (ScrollTrigger, useGSAP) are
 *      registered before any component runs.
 *   2. Import the i18n config so resources are loaded before <App> mounts.
 *   3. Wrap the tree with HelmetProvider (SEO) and BrowserRouter (routing).
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Side-effect imports — must come before anything that depends on them.
import '@/lib/gsap';
import '@/i18n';

import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
