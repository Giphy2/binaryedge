// src/services/deriv-api.js
const DERIV_APP_ID = '108599'; // replace with your actual app id
const DERIV_URL = `wss://ws.derivws.com/websockets/v3?app_id=${DERIV_APP_ID}`;

class DerivAPI {
  constructor() {
    this.ws = null;
    this.isConnecting = false;
    this.queue = [];
    this._tickHandlers = {}; // { symbol: Set<callback> }
    this._reqId = 1; // numeric request id counter (Deriv expects integers)
    this.accountType = 'demo';
    this.balance = 0;
    this.token = null;
    this.connect();
  }

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

    console.log('Connecting to Deriv WebSocket...');
    this.isConnecting = true;
    this.ws = new WebSocket(DERIV_URL);

    this.ws.onopen = () => {
      console.log('✅ Connected to Deriv WebSocket');
      this.isConnecting = false;

      // Send queued requests
      this.queue.forEach(msg => this.ws.send(msg));
      this.queue = [];
    };

    this.ws.onclose = () => {
      console.warn('⚠️ WebSocket closed. Reconnecting in 2s...');
      setTimeout(() => this.connect(), 2000);
    };

    this.ws.onerror = err => {
      console.error('WebSocket error:', err);
    };

    this.ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        // Dispatch tick events to registered handlers
        if (data.tick && data.tick.symbol) {
          const symbol = data.tick.symbol;
          const set = this._tickHandlers[symbol];
          if (set) {
            set.forEach(cb => {
              try { cb(data.tick); } catch (er) { console.error('tick handler error', er); }
            });
          }
        }

        // optional: broadcast raw data globally for backwards compatibility
        console.log('WS data', data);
      } catch (err) {
        console.error('Failed to parse WS message', err);
      }
    };
  }
  
  async waitForConnection() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
    await new Promise(resolve => {
      const check = () => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) resolve();
        else setTimeout(check, 100);
      };
      check();
    });
  }

  async sendRequest(request) {
    await this.waitForConnection();
    // ensure a numeric req_id so responses can be correlated (Deriv requires integer req_id)
    if (!request.req_id) request.req_id = this._reqId++;
    const msg = JSON.stringify(request);
    console.log('➡️ Sending WS request', request);
    this.ws.send(msg);
    return new Promise(resolve => {
      const listener = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          // match by numeric req_id or echoed req id fields
          if ((typeof data.req_id !== 'undefined' && data.req_id === request.req_id) ||
              (data.echo_req && typeof data.echo_req.req_id !== 'undefined' && data.echo_req.req_id === request.req_id) ||
              (data.msg_type && data.msg_type === request.msg_type)) {
            this.ws.removeEventListener('message', listener);
            resolve(data);
          }
        } catch (err) {
          // ignore parse errors for unrelated messages
        }
      };
      this.ws.addEventListener('message', listener);
    });
  }

  async getActiveSymbols() {
  await this.waitForConnection();
  const request = { active_symbols: 'brief', product_type: 'basic' }; // ✅ removed msg_type
  try {
    const response = await this.sendRequest(request);
    if (response.error) {
      console.error('getActiveSymbols error:', response.error);
      return [];
    }
    console.log('✅ getActiveSymbols response:', response);
    return response.active_symbols || [];
  } catch (err) {
    console.error('getActiveSymbols failed:', err);
    return [];
  }
}

  // Subscribe to ticks for a specific symbol with a callback
  async subscribeTicks(symbol, cb) {
    if (!symbol) return;
    // ensure handler set exists
    if (!this._tickHandlers[symbol]) this._tickHandlers[symbol] = new Set();
    if (cb) this._tickHandlers[symbol].add(cb);

    // send subscription request (don't await)
    try {
      await this.sendRequest({ ticks: symbol, subscribe: 1 });
    } catch (err) {
      console.error('subscribeTicks request failed:', err);
    }

    // return unsubscribe helper
    return () => this.unsubscribeTicks(symbol, cb);
  }
  
  // Unsubscribe tick handlers for a symbol. If cb provided, remove just that callback, otherwise remove all.
  async unsubscribeTicks(symbol, cb) {
    if (!symbol || !this._tickHandlers[symbol]) return;
    if (cb) {
      this._tickHandlers[symbol].delete(cb);
      if (this._tickHandlers[symbol].size === 0) delete this._tickHandlers[symbol];
    } else {
      delete this._tickHandlers[symbol];
    }

    // Inform server to forget this subscription (best-effort)
    try {
      await this.sendRequest({ forget: symbol });
    } catch (err) {
      // not fatal
    }
  }

  // Fetch account balance for the current accountType
  async getBalance() {
    try {
      await this.waitForConnection();
      const request = { balance: 1, account: this.accountType };
      const resp = await this.sendRequest(request);
      // Deriv may return different shapes; try common fields
      let bal = 0;
      let currency = 'USD';
      if (resp) {
        if (typeof resp.balance === 'number') bal = resp.balance;
        else if (resp.balance && typeof resp.balance === 'object') bal = resp.balance[0]?.balance ?? bal;
        if (resp.currency) currency = resp.currency;
        if (resp.balance_currency) currency = resp.balance_currency;
      }
      this.balance = bal;
      return { balance: this.balance, currency };
    } catch (err) {
      console.error('getBalance failed:', err);
      return { balance: this.balance, currency: 'USD' };
    }
  }

  // Switch between demo and real account types and refresh balance
  async switchAccount(type) {
    if (type !== 'demo' && type !== 'real') throw new Error('Account type must be "demo" or "real"');
    this.accountType = type;
    return this.getBalance();
  }

  // Login — accepts credentials object. If credentials.token provided, authorize socket.
  async login(credentials = {}) {
    // Credentials may include a token or username/password depending on your flow
    if (credentials.token) {
      this.token = credentials.token;
      try {
        const resp = await this.sendRequest({ authorize: this.token });
        return resp;
      } catch (err) {
        console.error('authorize failed:', err);
        throw err;
      }
    }

    // Placeholder: accept login without token
    console.log('login called with credentials (placeholder)');
    return { success: true };
  }

  // Logout: clear token and reset account info
  async logout() {
    try {
      // best-effort: if server requires a revoke call, implement it here
      this.token = null;
      this.accountType = 'demo';
      this.balance = 0;
      return { success: true };
    } catch (err) {
      console.error('logout failed:', err);
      return { success: false };
    }
  }

}

export const derivApi = new DerivAPI();
