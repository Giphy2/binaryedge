import { LitElement, html, css } from 'lit';
import { marketStore, marketService } from '../services/market-service.js';

class MarketSelector extends LitElement {
  static styles = css`
    select {
      padding: 6px 10px;
      border-radius: 4px;
      border: 1px solid #ccc;
      font-size: 14px;
    }
  `;

  constructor() {
    super();
    this.markets = [];
    this.selectedSymbol = '';
  }

  connectedCallback() {
    super.connectedCallback();
    // Subscribe to reactive market store
    marketStore.subscribe(data => {
      this.markets = data.all; // or filter by category
      // Select first market by default
      if (this.markets.length && !this.selectedSymbol) {
        this.selectedSymbol = this.markets[0].symbol;
      }
      this.requestUpdate();
    });

    // Initialize markets (fetch from Deriv API)
    marketService.init();
  }

  handleChange(e) {
    this.selectedSymbol = e.target.value;
    // Emit event so trade panel or chart can react
    this.dispatchEvent(new CustomEvent('symbol-changed', {
      detail: { symbol: this.selectedSymbol },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <select @change=${this.handleChange}>
        ${this.markets.map(m => html`
          <option value="${m.symbol}" ?selected=${m.symbol === this.selectedSymbol}>
            ${m.display_name}
          </option>
        `)}
      </select>
    `;
  }
}

customElements.define('market-selector', MarketSelector);
