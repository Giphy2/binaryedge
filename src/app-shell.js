// src/app-shell.js
import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import './components/ui/deriv-sidebar.js';
import './components/navbar.js';

export class AppShell extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      font-family: var(--font-base, 'Inter', sans-serif);
    }

    .content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    main {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      background: var(--color-bg, #fafafa);
    }

    #outlet {
      display: block;
      height: 100%;
    }
  `;

  firstUpdated() {
    const outlet = this.renderRoot.querySelector('#outlet');
    const router = new Router(outlet);

      router.setRoutes([
    { path: '/', component: 'dashboard-page', action: async () => { await import('./pages/dashboard-page.js'); } },
    { path: '/login', component: 'login-page', action: async () => { await import('./pages/login-page.js'); } },
    { path: '/markets', component: 'markets-page', action: async () => { await import('./pages/markets-page.js'); } },
    { path: '/market/:symbol', component: 'market-detail-page', action: async () => { await import('./pages/market-detail-page.js'); } },
    { path: '/portfolio', component: 'portfolio-page', action: async () => { await import('./pages/portfolio-page.js'); } },
    { path: '(.*)', redirect: '/' }
  ]);
  }

  render() {
    return html`
      <app-navbar></app-navbar>
      <div class="content">
        <deriv-sidebar></deriv-sidebar>
        <main id="outlet"></main>
      </div>
    `;
  }
}

customElements.define('app-shell', AppShell);
