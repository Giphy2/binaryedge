import { appStore } from './../store/app-store.js';
import { derivApi } from './../services/deriv-api.js';

export const marketService = {
  init: async () => {
    try {
      // Connect to Deriv API
      await derivApi.connect();
      console.log('Connected to Deriv API');

      // Fetch active symbols
      const symbols = await derivApi.getActiveSymbols();
      console.log('Fetched symbols from derivApi:', symbols);

      // Map them with market type info (Deriv API provides market category)
      const formatted = symbols.map(s => ({
        symbol: s.symbol,
        display_name: s.display_name,
        // accept either 'market' or 'market_type' from API
        market_type: s.market || s.market_type || s.category || 'unknown',
        quote: s.ask || s.ask_price || s.bid || 0
      }));

      console.log('Formatted symbols:', formatted);

      appStore.setState({ activeSymbols: formatted });

      // Automatically select first symbol
      if (formatted.length > 0) {
        appStore.setState({ selectedSymbol: formatted[0].symbol });
        derivApi.subscribeTicks(formatted[0].symbol);
      }

    } catch (err) {
      console.error('Market service init failed:', err);
    }
  },

  subscribeToSymbol: async (symbol) => {
    try {
      await derivApi.subscribeTicks(symbol);
    } catch (err) {
      console.error(`Failed to subscribe to ticks for ${symbol}:`, err);
    }
  }
};
