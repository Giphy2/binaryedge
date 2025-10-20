// simple canvas skeleton (will receive ticks later)

import { LitElement, css, html } from 'lit';
import { appStore } from '../store/app-store.js';

class TradingChart extends LitElement {
  static styles = css`
    :host { display:block; background:#fff; border-radius:8px; padding:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
    canvas { width:100%; height:320px; display:block; }
  `;

  constructor() {
    super();
    this.selectedSymbol = null;
    this.ticks = [];
    appStore.subscribe((state) => {
      // store will update selectedSymbol and latest ticks
      this.selectedSymbol = state.selectedSymbol;
      if (state.ticks && state.ticks[this.selectedSymbol]) {
        this.ticks = state.ticks[this.selectedSymbol].slice(-200); // keep last 200
        this._draw();
      }
    });
  }

  render() {
    return html`
      <h3>Chart ${this.selectedSymbol ? `— ${this.selectedSymbol}` : ''}</h3>
      <canvas id="chart"></canvas>
    `;
  }

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector('#chart');
    this.ctx = this.canvas.getContext('2d');
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const ratio = window.devicePixelRatio || 1;
    const { width } = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.floor(width * ratio);
    this.canvas.height = Math.floor(320 * ratio);
    if (this.ctx) this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this._draw();
  }

  _draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    // simple line chart drawing of ticks.price
    if (!this.ticks || this.ticks.length === 0) {
      ctx.fillStyle = '#666';
      ctx.fillText('No data', 12, 20);
      return;
    }
    const prices = this.ticks.map(t => Number(t.price || t.quote || t));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const w = this.canvas.width / (prices.length - 1);
    ctx.beginPath();
    ctx.strokeStyle = '#0b1220';
    ctx.lineWidth = 1.5;
    prices.forEach((p, i) => {
      const x = i * w;
      const y = this.canvas.height - ((p - min) / (max - min || 1) * this.canvas.height);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
}

customElements.define('trading-chart', TradingChart);
