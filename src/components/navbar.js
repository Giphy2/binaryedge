import { LitElement, html, css } from 'lit';
import { derivApi } from '../services/deriv-api.js';
import { appStore } from '../store/app-store.js';
// import { login } from '../pages/login-page.js';

export class AppNavbar extends LitElement {
  static styles = css`
    :host {
      display: block;
      background-color: #1e1e1e;
      color: white;
      font-family: Arial, sans-serif;
    }
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 2rem;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .links a {
      margin: 0 1rem;
      color: white;
      text-decoration: none;
      font-weight: 500;
    }
    .account {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .balance {
      background: #2a2a2a;
      padding: 0.3rem 0.8rem;
      border-radius: 5px;
    }
    button {
      padding: 0.3rem 0.8rem;
      background: #00bfa5;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      color: white;
      font-weight: bold;
    }
    button:hover {
      background: #00d5b3;
    }
    select {
      padding: 0.2rem 0.5rem;
      border-radius: 5px;
      border: none;
      background: #2a2a2a;
      color: white;
    }
  `;

  static properties = {
    user: { type: Object },
    balance: { type: Number },
    accountType: { type: String }, // 'demo' or 'real'
  };

  constructor() {
    super();
    this.user = null;
    this.balance = 0;
    this.accountType = 'demo';
    this.init();
  }

  async init() {
    // Subscribe to app store changes (login/logout)
    appStore.subscribe((state) => {
      this.user = state.user;
      this.balance = state.balance || 0;
      this.accountType = state.accountType || 'demo';
      this.requestUpdate();
    });

    // If user already has token, fetch balance
    if (this.user?.accessToken) {
      await this.fetchBalance();
    }
  }

  async fetchBalance() {
    try {
      const balanceData = await derivApi.getBalance(this.user.accessToken, this.accountType);
      this.balance = balanceData.balance;
    } catch (e) {
      console.error('Failed to fetch balance', e);
    }
  }

  async login() {
  // Open your custom login module instead of redirecting to Deriv OAuth
  // For example, navigate to /login page or open a modal
  window.location.href = '/login'; 
  // OR if it’s a modal you can trigger it like:
  // document.querySelector('login-module').open();
}

  logout() {
    appStore.setState({ user: null, balance: 0 });
  }

  async switchAccountType(e) {
    this.accountType = e.target.value;
    appStore.setState({ accountType: this.accountType });
    if (this.user?.accessToken) {
      await this.fetchBalance();
    }
  }

  render() {
    return html`
      <nav>
        <div class="logo">YourApp</div>
     
        <div class="account">
          ${this.user
            ? html`
                <div class="balance">
                  ${this.balance.toFixed(2)} USD
                </div>
                <select @change=${this.switchAccountType}>
                  <option value="demo" ?selected=${this.accountType === 'demo'}>Demo</option>
                  <option value="real" ?selected=${this.accountType === 'real'}>Real</option>
                </select>
                <button @click=${this.logout}>Logout</button>
              `
            : html`<button @click=${this.login}>Login / Sign Up</button>`}
        </div>
      </nav>
    `;
  }
}

customElements.define('app-navbar', AppNavbar);
