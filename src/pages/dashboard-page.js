import { LitElement, html, css } from 'lit';
// Layout (navbar/sidebar) is provided by app-shell; pages should render only their inner content
import '../components/ui/deriv-card.js';
import '../components/ui/deriv-button.js';
import '../components/trading-chart.js';
import '../components/trade-panel.js';
import { marketService } from '../services/market-service.js';
import { appStore } from '../store/app-store.js';

export class DashboardPage extends LitElement {
  static styles = css`
    :host { display: block; font-family: var(--font-base); background: var(--color-bg); padding: 1rem; }
    .page { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; }
    .bottom-bar { height: 50px; background: var(--color-card); display: flex; justify-content: space-between; align-items: center; padding: 0 1rem; box-shadow: 0 -2px 4px rgba(0,0,0,0.05); }
  `;

  constructor() {
    super();
    this.sidebarItems = ['Dashboard', 'Markets', 'Trades', 'Portfolio', 'Reports', 'Settings'];
    this.state = appStore.getState();
  }

  connectedCallback() {
    super.connectedCallback();
    marketService.init();

    // subscribe to store updates
    this.unsubscribe = appStore.subscribe(state => {
      this.state = state;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) this.unsubscribe();
  }

  render() {
    return html`
      <div class="page">
        <div>
          <deriv-card>
            <h3>Market Chart</h3>
            <trading-chart
              id="chart"
              .ticks=${this.state.ticks[this.state.selectedSymbol] || []}>
            </trading-chart>
          </deriv-card>

          <deriv-card>
            <h3>Trade Panel</h3>
            <trade-panel
              .symbols=${this.state.activeSymbols}
              @symbol-selected=${e => marketService.selectSymbol(e.detail)}
              @tick=${e => document.getElementById('chart').dispatchEvent(new CustomEvent('tick', { detail: e.detail }))}>
            </trade-panel>
          </deriv-card>
        </div>

        <div>
         <deriv-card>
          <h3>Open Contracts</h3>
          ${appStore.getState().contracts?.length > 0 
            ? html`
                <ul>
                  ${appStore.getState().contracts.map(c => html`
                    <li>${c.symbol} | ${c.contract_type} | P/L: ${c.profit || 0}</li>
                  `)}
                </ul>`
            : html`<p>No active contracts</p>`}
        </deriv-card>
        </div>
      </div>

      <div class="bottom-bar">
        <span>Open Trades: 3</span>
        <span>Notifications: 2</span>
        <span>Status: Connected</span>
      </div>
    `;
  }
}

customElements.define('dashboard-page', DashboardPage);
