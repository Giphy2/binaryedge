import { LitElement, html, css } from 'lit';

export class DerivButton extends LitElement {
  static properties = {
    primary: { type: Boolean },
    disabled: { type: Boolean },
    size: { type: String }, // small, medium, large
  };

  static styles = css`
    button {
      font-family: var(--font-base);
      border-radius: var(--border-radius);
      border: none;
      padding: 0.75rem 1.25rem;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    button.primary {
      background: var(--color-primary);
      color: white;
    }

    button.primary:hover {
      background: #d63c46;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    button.small { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
    button.medium { padding: 0.75rem 1.25rem; font-size: 1rem; }
    button.large { padding: 1rem 1.5rem; font-size: 1.2rem; }
  `;

  render() {
    return html`
      <button class="${this.primary ? 'primary' : ''} ${this.size || 'medium'}" ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('deriv-button', DerivButton);
