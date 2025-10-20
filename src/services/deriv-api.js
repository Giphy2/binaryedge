// placeholder service for WebSocket connection (we’ll implement next)

// src/services/deriv-api.js
// This is a skeletal service. We'll fully implement Deriv WebSocket integration next.
// For now, it exposes init(), connect(), and fake data generator to test UI.

import { appStore } from '../store/app-store.js';

let ws = null;
let fakeInterval = null;

export const derivApi = {
  init() {
    // placeholder - in next step we'll open real Deriv websocket
    // For now seed appStore with mock symbols
    const symbols = [
      { symbol: 'R_100', display_name: 'Synthetic 100', quote: '—' },
      { symbol: 'FRXEURUSD', display_name: 'EUR/USD', quote: '—' },
      { symbol: 'OTC_GOLD', display_name: 'Gold (OTC)', quote: '—' }
    ];
    appStore.setState({ activeSymbols: symbols });
  },

  connect() {
    // fake tick generator for development and UI testing
    if (fakeInterval) return;
    fakeInterval = setInterval(() => {
      const state = appStore.getState();
      const s = state.activeSymbols;
      if (!s || s.length === 0) return;
      s.forEach(sym => {
        // create fake price
        const base = 100 + Math.random() * 10;
        const price = (base + (Math.random()-0.5)).toFixed(5);
        appStore.updateTicks(sym.symbol, { epoch: Math.floor(Date.now()/1000), price });
        // update last quote for quick display
        sym.quote = price;
      });
      appStore.setState({ activeSymbols: s });
    }, 800);
  },

  disconnect() {
    if (fakeInterval) {
      clearInterval(fakeInterval);
      fakeInterval = null;
    }
    if (ws) {
      ws.close();
      ws = null;
    }
  }
};
