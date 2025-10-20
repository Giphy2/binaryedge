// route definitions (using @vaadin/router)


import { Router } from '@vaadin/router';

// lazy import pages (good for performance)
const routes = [
  { path: '/', component: 'dashboard-page', action: async () => { await import('./pages/dashboard-page.js'); } },
  { path: '/login', component: 'login-page', action: async () => { await import('./pages/login-page.js'); } },
  // add more routes here:
  { path: '/portfolio', action: async () => { await import('./pages/dashboard-page.js'); }, component: 'portfolio-page' },
  { path: '(.*)', redirect: '/' } // catch-all
];

const outlet = document.querySelector('#outlet');
const router = new Router(outlet);
router.setRoutes(routes);

export default router;
