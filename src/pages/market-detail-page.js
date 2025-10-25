// src/pages/market-detail-page.js
import { LitElement, html, css } from 'lit';
import { appStore } from '../store/app-store.js';
import { derivApi } from '../services/deriv-api.js';
import '../components/trading-chart.js';
import '../components/trade-panel.js';

export class MarketDetailPage extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      color: var(--color-text);
      gap: 1rem;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .main {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
    }

    deriv-card {
      padding: 1rem;
      background: var(--color-card, #fff);
      border-radius: 8px;
    }
  `;

  static properties = {
    symbol: { type: String },
  };

  constructor() {
    super();
    this.symbol = '';
  }

  async connectedCallback() {
    super.connectedCallback();
    const url = new URL(window.location.href);
    this.symbol = url.pathname.split('/').pop();
    appStore.setState({ selectedSymbol: this.symbol });

    await derivApi.waitForConnection();
    derivApi.subscribeTicks(this.symbol);
  }

  render() {
    const symbolInfo =
      appStore.getState().activeSymbols.find((s) => s.symbol === this.symbol) || {};

    return html`
      <div class="header">
        <h2>${symbolInfo.display_name || this.symbol}</h2>
        <span>Market Type: ${symbolInfo.market_display_name || 'N/A'}</span>
      </div>

      <div class="main">
        <div>
          <trading-chart></trading-chart>
        </div>

        <div>
          <trade-panel></trade-panel>
        </div>
      </div>
    `;
  }
}

customElements.define('market-detail-page', MarketDetailPage);
