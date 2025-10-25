import { CRED } from './cred.js';

class DerivAPI {
  constructor() {
    this.ws = null;
    this.callbacks = {};
  }

  // Connect to WebSocket, return a Promise to ensure ready
  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return Promise.resolve();

    this.ws = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${CRED.APP_ID}`);

    return new Promise((resolve, reject) => {
      this.ws.addEventListener('open', () => {
        console.log('Connected to Deriv WebSocket');
        resolve();
      });

      this.ws.addEventListener('error', (err) => {
        console.error('WebSocket connection error:', err);
        reject(err);
      });

      this.ws.addEventListener('message', e => {
        const data = JSON.parse(e.data);

        // Call callback if request_id matches
        if (data.echo_req?.req_id && this.callbacks[data.echo_req.req_id]) {
          this.callbacks[data.echo_req.req_id](data);
          delete this.callbacks[data.echo_req.req_id];
        }

        // Dispatch tick events globally
        if (data.tick) {
          window.dispatchEvent(new CustomEvent('tick', { detail: data.tick }));
        }

        // Dispatch contract updates
        if (data.proposal_open_contract) {
          window.dispatchEvent(new CustomEvent('contract_update', { detail: data.proposal_open_contract }));
        }
      });

      this.ws.addEventListener('close', () => console.log('WebSocket closed'));
    });
  }

  // Generic request sender
  sendRequest(req) {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return reject('WebSocket not connected');

      const req_id = Math.random().toString(36).substr(2, 9);
      req.req_id = req_id;
      this.callbacks[req_id] = resolve;
      this.ws.send(JSON.stringify(req));
    });
  }

  // Fetch active symbols
  async getActiveSymbols() {
    try {
      const response = await this.sendRequest({ active_symbols: 'brief' });
      return response.active_symbols || [];
    } catch (err) {
      console.error('Failed to fetch active symbols:', err);
      return [];
    }
  }

  // Buy a contract
  async buyContract({ symbol, tradeType, amount, payoutMode }) {
    const request = {
      buy: 1,
      price: amount,
      parameters: {
        contract_type: tradeType,
        symbol: symbol
      }
    };

    if (payoutMode === 'payout') {
      request.parameters.amount = amount;
    }

    try {
      return await this.sendRequest(request);
    } catch (err) {
      console.error('Buy failed:', err);
      return { error: err };
    }
  }

  // Subscribe to ticks for a symbol
  async subscribeTicks(symbol) {
    return this.sendRequest({ ticks: symbol, subscribe: 1 });
  }
}

// Export a singleton instance
export const derivApi = new DerivAPI();
