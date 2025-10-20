// tiny reactive store for app state

const listeners = new Set();
let state = {
  activeSymbols: [],     // array of { symbol, display_name, quote }
  selectedSymbol: null,  // current symbol
  ticks: {}              // { SYMBOL: [ { epoch, price } ] }
};

export const appStore = {
  getState: () => state,
  setState: (patch) => {
    state = { ...state, ...patch };
    for (const l of listeners) l(state);
  },
  subscribe: (cb) => {
    listeners.add(cb);
    // send initial
    cb(state);
    return () => listeners.delete(cb);
  },
  updateTicks: (symbol, tick) => {
    if (!state.ticks[symbol]) state.ticks[symbol] = [];
    state.ticks[symbol].push(tick);
    // keep small buffer
    if (state.ticks[symbol].length > 1000) state.ticks[symbol].shift();
    for (const l of listeners) l(state);
  }
};
