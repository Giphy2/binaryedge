// dashboard page composing components

import { LitElement, css, html } from 'lit';
import '../components/market-list.js';
import '../components/trading-chart.js';

class DashboardPage extends LitElement {
  static styles = css`
    :host { display:block; padding:16px; }
    .grid { display:grid; grid-template-columns: 320px 1fr; gap:16px; align-items:start; }
    @media (max-width: 800px) {
      .grid { grid-template-columns: 1fr; }
    }
  `;
  render() {
    return html`
      <div class="grid">
        <market-list></market-list>
        <div>
          <trading-chart></trading-chart>
          <!-- later: trade-panel, recent trades, etc. -->
        </div>
      </div>
    `;
  }
}

customElements.define('dashboard-page', DashboardPage);
