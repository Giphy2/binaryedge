// login page (placeholder)

import { LitElement, html, css } from 'lit';

class LoginPage extends LitElement {
    static styles = css`
    button {
      background: #ff444f;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
    }
  `;

  constructor() {
    super();
    this.appId = '108599'; //to-do : return id to environment variable later
    this.redirectUri = 'https://edgetrader.netlify.app/dashboard'; // 🔸 must match Deriv app config
  }

  firstUpdated() {
    // Listen for messages from popup (the callback page will send the token)
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return; // security check
      const token = event.data?.token;
      if (token) {
        localStorage.setItem('deriv_auth_token', token);
        console.log('✅ Token received:', token);
        alert('You are now logged in!');
      }
    });
  }

  handleLogin() {
    const oauthUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${this.appId}&redirect_uri=${this.redirectUri}`;
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    // open Deriv login popup
    window.open(
      oauthUrl,
      'Deriv Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  }

  render() {
    return html`
      <div>
        <h2>Login with Deriv</h2>
        <button @click=${this.handleLogin}>Login with Deriv</button>
      </div>
    `;
  }
}
customElements.define('login-page', LoginPage);