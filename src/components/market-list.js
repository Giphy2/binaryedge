import { derivApi } from './deriv-api.js';
import { writable } from '../store/app-store.js'; // simple reactive store

// Reactive store to hold markets by category
export const marketStore = writable({
  all: [],
  forex: [],
  synthetic: [],
  commodities: [],
  crypto: [],
});

// Service to fetch and organize markets
export const marketService = {
  async init() {
    // Ensure WebSocket is ready
    await derivApi.init();

    // Fetch active symbols
    const response = await derivApi.sendRequest({
      active_symbols: 'brief',
      product_type: 'basic',
    });

    if (!response.active_symbols) {
      console.error('Failed to fetch active symbols:', response);
      return;
    }

    const symbols = response.active_symbols;

    // Categorize symbols
    const categorized = {
      all: symbols,
      forex: symbols.filter(s => s.market === 'forex'),
      synthetic: symbols.filter(s => s.market === 'synthetic_index'),
      commodities: symbols.filter(s => s.market === 'commodities'),
      crypto: symbols.filter(s => s.market === 'cryptocurrency'),
    };

    // Update store
    marketStore.set(categorized);
    console.log('Markets loaded:', categorized);
  },

  // Optional: get a flat array for dropdowns
  getAllSymbols() {
    return marketStore.value.all;
  },

  getByMarket(marketName) {
    return marketStore.value[marketName] || [];
  },
};
