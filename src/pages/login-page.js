// login page (placeholder)

import { LitElement, css, html } from 'lit';

class LoginPage extends LitElement {
  static styles = css`
    :host { display:block; padding:24px; }
    .card { max-width:420px; margin:40px auto; padding:20px; border-radius:8px; box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
    input { width:100%; padding:8px; margin:8px 0; box-sizing:border-box; }
    button { padding:8px 12px; }
  `;

  render() {
    return html`
      <div class="card">
        <h2>Login</h2>
        <label>Email</label>
        <input type="email" placeholder="you@example.com" />
        <label>Password</label>
        <input type="password" placeholder="••••••••" />
        <div style="margin-top:12px;">
          <button @click=${this._login}>Login</button>
          <button style="margin-left:8px;" @click=${() => location.href='/'}>Back</button>
        </div>
      </div>
    `;
  }

  _login() {
    // placeholder: implement real auth later
    alert('Login placeholder — implement auth-service next.');
  }
}

customElements.define('login-page', LoginPage);
