import { LitElement, html, css } from 'lit';
import { appStore } from '../store/app-store.js';
import { derivApi } from '../services/deriv-api.js';

export class TradePanel extends LitElement {
  static styles = css`
    :host { display: block; font-family: var(--font-base); }
    .panel { display: flex; flex-direction: column; gap: 0.5rem; }
    select, input { padding: 0.4rem; font-size: 1rem; width: 100%; }
    .payout-mode { display: flex; gap: 1rem; }
    .payout-mode label { cursor: pointer; }
    .pl-display { font-weight: bold; margin-top: 0.3rem; }
    button { margin-top: 0.5rem; padding: 0.5rem; font-size: 1rem; }
  `;

  static properties = {
    // New API: accept symbol as an attribute/property and render price
    symbol: { type: String },
    price: { type: Number },
    availableTradeTypes: { type: Array },
    tradeType: { type: String },
    amount: { type: Number },
    payoutMode: { type: String },
    latestTick: { type: Number },
    potentialPL: { type: Number }
  };

  constructor() {
    super();
  this.symbol = '';
    this.availableTradeTypes = [];
    this.tradeType = '';
    this.amount = 1;
    this.payoutMode = 'stake';
    this.latestTick = null;
    this.potentialPL = 0;
    this.tickListener = null;

    // Subscribe to appStore for initial symbol (keeps backward compatibility)
    appStore.subscribe(state => {
      if (state.selectedSymbol && !this.symbol) {
        this.symbol = state.selectedSymbol;
        this.updateTradeTypes();
        // subscribe via derivApi will be handled in connectedCallback/updated
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    // Subscribe if symbol already set
    if (this.symbol) this._subscribeSymbol(this.symbol);
  }

  updated(changedProps) {
    if (changedProps.has('symbol')) {
      const old = changedProps.get('symbol');
      if (old && old !== this.symbol) {
        // unsubscribe previous
        if (this._currentSub) {
          this._currentSub();
          this._currentSub = null;
          this._currentSubSymbol = null;
        }
      }
      if (this.symbol) this._subscribeSymbol(this.symbol);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._currentSub) {
      this._currentSub();
      this._currentSub = null;
      this._currentSubSymbol = null;
    }
  }

  updateTradeTypes() {
    if (!this.selectedSymbol) return;
    const symbolInfo = appStore.getState().activeSymbols.find(s => s.symbol === this.selectedSymbol);
    if (!symbolInfo) return;

    const marketType = symbolInfo.market_type || 'synthetic';

    const tradeMapping = {
      synthetic: [
        { value: 'rise_fall', label: 'Rise/Fall' },
        { value: 'ends_in_out', label: 'Ends In/Out' },
        { value: 'touch_no_touch', label: 'Touch/No Touch' }
      ],
      forex: [
        { value: 'rise_fall', label: 'Rise/Fall' },
        { value: 'touch_no_touch', label: 'Touch/No Touch' }
      ],
      commodities: [
        { value: 'rise_fall', label: 'Rise/Fall' }
      ],
      crypto: [
        { value: 'rise_fall', label: 'Rise/Fall' },
        { value: 'touch_no_touch', label: 'Touch/No Touch' }
      ]
    };

    this.availableTradeTypes = tradeMapping[marketType] || [{ value: 'rise_fall', label: 'Rise/Fall' }];
    this.tradeType = this.availableTradeTypes[0].value;
  }

  subscribeToTicks() {
    // Backward-compatible: no-op; modern flow subscribes per-symbol via derivApi with a direct callback
    // This method kept for compatibility with older code paths.
  }

  // Subscribe directly to derivApi for the given symbol with an internal handler
  _subscribeSymbol(symbol) {
    if (!symbol) return;
    // remove previous handler for a different symbol
    if (this._currentSub && this._currentSubSymbol === symbol) return;
    if (this._currentSub) {
      this._currentSub();
      this._currentSub = null;
      this._currentSubSymbol = null;
    }

    const handler = (tick) => {
      this.price = tick.quote ?? tick.bid ?? tick.ask ?? this.price;
    };

    this._currentSubSymbol = symbol;
    // derivApi.subscribeTicks returns an unsubscribe helper
    this._currentSub = derivApi.subscribeTicks(symbol, handler);
  }

  calculatePotentialPL() {
    if (!this.latestTick || !this.amount) {
      this.potentialPL = 0;
      return;
    }

    // Simplified P/L calculation
    if (this.payoutMode === 'stake') {
      this.potentialPL = this.amount * 0.8; // assume 80% payout for demo
    } else if (this.payoutMode === 'payout') {
      this.potentialPL = this.amount - this.amount * 0.2; // assume stake is 80% of payout
    }
  }

  handleTradeTypeChange(e) {
    this.tradeType = e.target.value;
  }

  handleAmountChange(e) {
    const val = parseFloat(e.target.value);
    this.amount = isNaN(val) || val <= 0 ? 1 : val;
    this.calculatePotentialPL();
  }

  handlePayoutModeChange(e) {
    this.payoutMode = e.target.value;
    this.calculatePotentialPL();
  }

  handleBuyContract() {
    if (!this.selectedSymbol) return;

    derivApi.buyContract({
      symbol: this.selectedSymbol,
      tradeType: this.tradeType,
      amount: this.amount,
      payoutMode: this.payoutMode
    }).then(res => {
      console.log('Contract bought:', res);
    });
  }

  render() {
    return html`
      <div class="panel">
        <div>Symbol: ${this.symbol} ${this.price ? html`— Price: ${this.price}` : ''}</div>
        <label>Market</label>
        <select @change=${e => appStore.setState({ selectedSymbol: e.target.value })}>
          ${appStore.getState().activeSymbols.map(s =>
            html`<option value=${s.symbol} ?selected=${s.symbol === this.symbol}>${s.display_name}</option>`
          )}
        </select>

        <label>Trade Type</label>
        <select @change=${this.handleTradeTypeChange}>
          ${this.availableTradeTypes.map(t =>
            html`<option value=${t.value} ?selected=${t.value === this.tradeType}>${t.label}</option>`
          )}
        </select>

        <label>Amount</label>
        <input type="number" .value=${this.amount} @input=${this.handleAmountChange} min="1" step="0.01" />

        <label>Payout Mode</label>
        <div class="payout-mode">
          <label>
            <input type="radio" name="payout" value="stake" ?checked=${this.payoutMode === 'stake'} @change=${this.handlePayoutModeChange} />
            Stake
          </label>
          <label>
            <input type="radio" name="payout" value="payout" ?checked=${this.payoutMode === 'payout'} @change=${this.handlePayoutModeChange} />
            Payout
          </label>
        </div>

        <div class="pl-display">
          Potential P/L: ${this.potentialPL.toFixed(2)}
        </div>

        <button @click=${this.handleBuyContract}>Buy Contract</button>
      </div>
    `;
  }
}

customElements.define('trade-panel', TradePanel);
