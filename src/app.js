// root component (handles router outlet)


import { LitElement, css, html } from 'lit';
import { Router } from '@vaadin/router';
import './components/navbar.js';
import './router.js';

class DerivApp extends LitElement {
  static styles = css`
    :host { display: block; min-height: 100vh; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
    main { padding: 16px; }
  `;

  render() {
    return html`
      <deriv-navbar></deriv-navbar>
      <main id="outlet" role="main"></main>
    `;
  }

  firstUpdated() {
    // Attach Vaadin Router to the outlet element
    const outlet = this.renderRoot.querySelector('#outlet');
    Router(outlet, (location) => {
      // router handled in src/router.js only; installRouter just wires navigation events.
    });
  }
}

customElements.define('deriv-app', DerivApp);

// mount to DOM
const root = document.getElementById('app');
if (root) root.appendChild(document.createElement('deriv-app'));
