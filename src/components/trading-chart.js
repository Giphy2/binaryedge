import { LitElement, html, css } from 'lit';

class TradingChart extends LitElement {
  constructor() {
    super();
    this.data = [];
  }

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    this.addEventListener('tick', e => this.addTick(e.detail));
  }

  addTick(tick) {
    const price = tick.quote || tick.close || tick.bid || tick.ask;
    if (!price) return;

    this.data.push(price);
    if (this.data.length > 50) this.data.shift(); // last 50 ticks
    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);
    if (!this.data.length) return;

    const max = Math.max(...this.data);
    const min = Math.min(...this.data);

    ctx.beginPath();
    ctx.strokeStyle = '#4caf50';
    ctx.lineWidth = 2;

    this.data.forEach((price, i) => {
      const x = (i / (this.data.length - 1)) * width;
      const y = height - ((price - min) / (max - min)) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  }

  render() {
    return html`<canvas style="width:100%;height:300px;"></canvas>`;
  }
}

customElements.define('trading-chart', TradingChart);
