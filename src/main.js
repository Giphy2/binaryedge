import './pages/dashboard-page.js';
import './pages/markets-page.js';
import './pages/market-detail-page.js';
import './pages/portfolio-page.js';
import './pages/reports-page.js';
import './pages/settings-page.js';
import { initRouter } from './router.js';

window.addEventListener('DOMContentLoaded', () => {
  const outlet = document.querySelector('#outlet');
  initRouter(outlet);
});
