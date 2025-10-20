// top navigation component

import { LitElement, css, html } from 'lit';

class DerivNavbar extends LitElement {
  static styles = css`
    :host { display: block; background: #0b1220; color: white; }
    nav { display:flex; align-items:center; gap:16px; padding:12px 20px; }
    .logo { font-weight:700; letter-spacing:1px; }
    .spacer { flex:1; }
    button { background:transparent; color:inherit; border:1px solid rgba(255,255,255,0.12); padding:6px 10px; border-radius:6px; cursor:pointer; }
  `;

  render() {
    return html`
      <nav>
        <div class="logo">DerivClone</div>
        <div class="spacer"></div>
        <div>
          <button @click=${() => location.href = '/'}>Dashboard</button>
          <button @click=${() => location.href = '/login'}>Login</button>
        </div>
      </nav>
    `;
  }
}

customElements.define('deriv-navbar', DerivNavbar);
