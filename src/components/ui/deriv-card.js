import { LitElement, html, css } from 'lit';

export class DerivCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: var(--color-card);
      border-radius: var(--border-radius);
      padding: 1rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      font-family: var(--font-base);
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('deriv-card', DerivCard);
