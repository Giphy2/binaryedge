// route definitions (using @vaadin/router)

import { Router } from '@vaadin/router';

window.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('deriv-app');
  const outlet = app?.shadowRoot?.querySelector('#outlet');
  if (!outlet) {
    console.error('Router outlet not found in DerivApp');
    return;
  }

  const router = new Router(outlet);

  router.setRoutes([
    { path: '/', component: 'dashboard-page', action: async () => { await import('./pages/dashboard-page.js'); } },
    { path: '/login', component: 'login-page', action: async () => { await import('./pages/login-page.js'); } },
    { path: '/portfolio', component: 'portfolio-page', action: async () => { await import('./pages/portfolio-page.js'); } },
    { path: '(.*)', redirect: '/' }
  ]);
});
