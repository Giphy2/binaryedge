import { LitElement, html, css } from 'lit';
import { derivApi } from '../../services/deriv-api.js'; // your API wrapper
import { appStore } from '../../store/app-store.js';  // your centralized store

export class AppNavbar extends LitElement {
  static properties = {
    signedIn: { type: Boolean },
    balance: { type: Number },
    currency: { type: String },
    accountType: { type: String } // 'demo' | 'real'
  };

  static styles = css`
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      background-color: #1a1a1a;
      color: white;
    }
    button, select {
      margin-left: 10px;
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `;

  constructor() {
    super();
    this.signedIn = false;
    this.balance = 0;
    this.currency = 'USD';
    this.accountType = 'demo';

    // Listen to global store changes
    appStore.subscribe('user', (user) => {
      this.signedIn = !!user?.token;
      if (this.signedIn) this._fetchBalance();
    });
  }

  render() {
    return html`
      <nav>
        <div class="logo">MyApp</div>

        ${this.signedIn
          ? html`
              <div class="account-info">
                Balance: ${this.balance.toFixed(2)} ${this.currency}
                <select @change=${this._switchAccount}>
                  <option value="demo" ?selected=${this.accountType === 'demo'}>Demo</option>
                  <option value="real" ?selected=${this.accountType === 'real'}>Real</option>
                </select>
                <button @click=${this._logout}>Logout</button>
              </div>
            `
          : html`
              <button @click=${this._login}>Login</button>
              <button @click=${this._signup}>Sign Up</button>
            `}
      </nav>
    `;
  }

  async _fetchBalance() {
    try {
      const { balance, currency } = await derivApi.getBalance({ account: this.accountType });
      this.balance = balance;
      this.currency = currency;
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }

  _switchAccount(e) {
    this.accountType = e.target.value;
    appStore.setState('accountType', this.accountType);
    this._fetchBalance();
  }

  async _login() {
    const user = await derivApi.login(); // implement login dialog/API
    if (user) appStore.setState('user', user);
  }

  async _signup() {
    const user = await derivApi.signup(); // implement signup dialog/API
    if (user) appStore.setState('user', user);
  }

  _logout() {
    derivApi.logout();
    appStore.setState('user', null);
    this.signedIn = false;
    this.balance = 0;
    this.currency = 'USD';
  }
}

customElements.define('app-navbar', AppNavbar);
