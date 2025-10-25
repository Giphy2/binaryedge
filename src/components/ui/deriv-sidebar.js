// src/components/ui/deriv-sidebar.js
import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';

export class DerivSidebar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 220px;
      background: var(--color-card, #fff);
      border-right: 1px solid #ddd;
      padding: 1rem 0;
      box-shadow: 2px 0 4px rgba(0,0,0,0.05);
      height: 100%;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .item {
      padding: 0.75rem 1.25rem;
      cursor: pointer;
      font-weight: 500;
      color: var(--color-text, #333);
      border-left: 3px solid transparent;
      transition: all 0.2s ease;
    }

    .item:hover {
      background: var(--color-accent-light, #f6f8ff);
      border-left-color: var(--color-primary, #d32f2f);
      color: var(--color-primary, #d32f2f);
    }

    .active {
      background: var(--color-accent-light, #f6f8ff);
      border-left-color: var(--color-primary, #d32f2f);
      color: var(--color-primary, #d32f2f);
    }
  `;

  static properties = {
    activeRoute: { type: String },
  };

  constructor() {
    super();
    this.activeRoute = window.location.pathname;
  }

  navigate(path) {
    this.activeRoute = path;
    Router.go(path);
  }

  render() {
    const links = [
      { name: 'Dashboard', path: '/' },
      { name: 'Markets', path: '/markets' },
      { name: 'Portfolio', path: '/portfolio' },
      { name: 'Reports', path: '/reports' },
      { name: 'Settings', path: '/settings' },
    ];

    return html`
      <nav>
        ${links.map(
          (link) => html`
            <div
              class="item ${this.activeRoute === link.path ? 'active' : ''}"
              @click=${() => this.navigate(link.path)}
            >
              ${link.name}
            </div>
          `
        )}
      </nav>
    `;
  }
}

customElements.define('deriv-sidebar', DerivSidebar);
