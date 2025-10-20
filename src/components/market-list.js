// symbol list component (skeleton)

import { LitElement, css, html } from 'lit';
import { appStore } from '../store/app-store.js';

class MarketList extends LitElement {
  static styles = css`
    :host { display:block; background:#fff; border-radius:8px; padding:12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .item { display:flex; justify-content:space-between; padding:8px 6px; border-bottom:1px solid #f1f1f1; cursor:pointer; }
    .item:last-child { border-bottom:none; }
    .symbol { font-weight:600; }
    .price { font-family: monospace; }
  `;

  constructor() {
    super();
    this.symbols = [];
    // subscribe to store updates later (we'll implement store)
    appStore.subscribe((state) => {
      if (state.activeSymbols) {
        this.symbols = state.activeSymbols;
        this.requestUpdate();
      }
    });
  }

  render() {
    return html`
      <h3>Markets</h3>
      <div>
        ${this.symbols.length === 0 ? html`<div>Loading symbols...</div>` : this.symbols.map(s => html`
          <div class="item" @click=${() => this._select(s)}>
            <div>
              <div class="symbol">${s.symbol}</div>
              <div class="desc">${s.display_name || s.symbol}</div>
            </div>
            <div class="price">${s.quote ?? '—'}</div>
          </div>`)}
      </div>
    `;
  }

  _select(symbol) {
    // emit event with selected symbol — trading-chart or trade-panel can listen
    this.dispatchEvent(new CustomEvent('symbol-selected', { detail: { symbol }, bubbles: true, composed: true }));
  }
}

customElements.define('market-list', MarketList);
