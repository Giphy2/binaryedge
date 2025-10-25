// root component (handles router outlet)
import { LitElement, css, html } from 'lit';
import { Router } from '@vaadin/router';
import './router.js';

class DerivApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }
    main {
      padding: 16px;
    }
  `;

  render() {
    return html`
      <main id="outlet" role="main"></main>
    `;
  }

  firstUpdated() {
    // Attach Vaadin Router to the outlet element
    const outlet = this.renderRoot.querySelector('#outlet');

    if (!outlet) {
      console.error('Router outlet not found!');
      return;
    }

    // Create the router and pass it to your router.js setup
    const router = new Router(outlet);

    // Option 1: If your router.js defines routes globally, it can export a setup function:
    import('./router.js').then(module => {
      if (typeof module.setupRoutes === 'function') {
        module.setupRoutes(router);
      }
    });

    // Option 2 (simpler): If router.js sets routes directly on a global Router instance,
    // you can omit the above import and just rely on router.js doing it.
  }
}

customElements.define('deriv-app', DerivApp);

// mount to DOM
const root = document.getElementById('app');
if (root) {
  root.appendChild(document.createElement('deriv-app'));
}
