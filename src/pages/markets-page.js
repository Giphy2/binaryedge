// src/pages/markets-page.js
import { LitElement, html, css } from 'lit';
import { derivApi } from '../services/deriv-api.js';
import { appStore } from '../store/app-store.js';
import { Router } from '@vaadin/router';

export class MarketsPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      color: var(--color-text);
    }

    h2 {
      margin-bottom: 1rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .market-card {
      background: var(--color-card, #fff);
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      cursor: pointer;
      transition: 0.2s ease;
    }

    .market-card:hover {
      background: var(--color-accent-light, #f6f8ff);
      transform: translateY(-2px);
    }

    .price {
      font-size: 1.2rem;
      color: var(--color-primary, #d32f2f);
      margin-top: 0.5rem;
    }
  `;

  static properties = {
    markets: { type: Array },
  };

  constructor() {
    super();
    this.markets = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    await derivApi.waitForConnection();

    const symbols = await derivApi.getActiveSymbols();
    this.markets = symbols || [];
    appStore.setState({ activeSymbols: this.markets });
  }

  handleSelectMarket(symbol) {
    appStore.setState({ selectedSymbol: symbol });
    Router.go(`/market/${symbol}`);
  }

  render() {
    return html`
      <h2>Available Markets</h2>
      <div class="grid">
        ${this.markets.map(
          (m) => html`
            <div class="market-card" @click=${() => this.handleSelectMarket(m.symbol)}>
              <strong>${m.display_name}</strong>
              <div class="price">${m.quote ?? '--'}</div>
              <div>${m.market_display_name}</div>
            </div>
          `
        )}
      </div>
    `;
  }
}

customElements.define('markets-page', MarketsPage);
