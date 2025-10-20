Project Scope & Purpose

Purpose: To develop a multi-device trading platform (web + mobile) that uses the Deriv API to allow users to view markets, trade contracts/options, monitor their portfolio, deposit/withdraw funds (if applicable), with light, fast UI (we’ll use a lightweight frontend framework such as LitElement) and full compliance/security based on Deriv’s base.
Audience: Retail traders (beginners to intermediate) across desktop browsers and mobile devices.
MVP goal: Deliver core trading functionality (market data, contract purchase, portfolio view) before extended features (bots, copy-trading, advanced analytics).
Platform use cases:

Sign up / log in / account linking

Browse and select tradeable assets

View live/up-to-date symbol lists and price streams

View historical data & simple chart (for context)

Build and execute trades/contracts (input amount, duration/expiry, type)

Monitor live open trades, see results when they close

View account balance, deposit/withdraw (or at least balance update)

Settings/security (profile, currency, preferences)

Mobile-friendly UI + responsive design.

2. Must-Have Features (MVP)

Below are key feature areas with sub-features, drawn from analysing platforms like those you referenced plus best-practice. We'll mark each feature with MVP or Phase 2/optional.

2.1 User & Account Management

User registration/login (email + password + 2FA) – MVP

Link/trade using Deriv account (via API authorisation)

User profile (name, residence, currency, risk profile) – MVP

Show user account status (verification, KYC, fund status) – MVP (since Deriv compliance)

Logout / session management.

2.2 Market & Asset Data

List of active tradeable symbols (assets: forex pairs, indices, commodities, synthetics etc.) via Deriv API endpoint like active_symbols. 
Deriv API
+1

Real-time streaming ticks for selected symbol(s) (via WebSocket) – MVP

Historical price data (ticks_history) for charting/trend context – MVP

Contract types & specifications for each symbol (via contracts_for_symbol or equivalent) – MVP

Filtering/sorting assets (by category, volatility, payout, etc.) – MVP

Optionally: favourites/watchlist – Phase 2

2.3 Trading / Contracts & Execution

Let user pick a symbol, contract type (e.g., up/down, digit, etc.), amount, duration/expiry – MVP

Show price proposal/quote for the contract before execution (via price_proposal or similar) – MVP

Send contract purchase/trade ("buy") to Deriv API – MVP

Display live open contracts, update status (via live stream or polling) – MVP

Show results when contract ends: win/loss, payout, profit/loss – MVP

Early close/cash-out option if Deriv supports it – Phase 2

History of past trades/contracts – MVP

Optional stop-loss / take-profit / advanced features – Phase 2

2.4 Account Balance & Cashier

Display user account balance, currency, trading funds – MVP

Show deposit/withdraw options or at least link to Deriv’s cashier – Phase 2

Exchange rates (if multi-currency) – Phase 2

Transaction history (deposits, withdrawals, fees) – Phase 2

2.5 UI / Frontend / Mobile & Web

Responsive UI that adapts for desktop & mobile web – MVP

Use lightweight framework (LitElement) for fast loading, smooth UI – MVP

Mobile-first considerations (touch input, simplified UI) – MVP

Dark/light theme toggle – Phase 2

Charting component (basic) to visualise asset movement – MVP

Customisable dashboard (for mobile: favourite symbols, recent trades) – Phase 2

2.6 Security & Compliance

Use Deriv’s authentication/authorization flows – MVP

Secure WebSocket connections (TLS), token management – MVP

Protect against common threats (XSS, CSRF, injection) – MVP

Encryption of sensitive data in transit + at rest – MVP

Logging / audit trails (trade actions, login/logout) – Phase 2

Data privacy compliance (GDPR/other applicable jurisdictions) – Phase 2

2.7 Administration & Monitoring (back-end)

Admin panel for monitoring users/trades (optional for MVP) – Phase 2

Real-time status monitoring of API connectivity and trade flows – MVP

Error alerting/monitoring (WebSocket disconnects, trade failures) – MVP

2.8 Miscellaneous/UX Enhancements

Demo mode (virtual funds) for user practice – Phase 2

Notifications/push alerts (for mobile) on trade results or market events – Phase 2

Multi-language support – Phase 2

Performance optimisation (lazy loading, code splitting) – MVP

Help/FAQ section – MVP

3. Feature Mapping to Deriv API Endpoints

Here we map the major features to the Deriv API endpoints we’ll utilise, so we know what to implement.

Feature	Deriv API Endpoint(s)	Notes
List active symbols	active_symbols	Fetch list of tradeable assets. 
Deriv API
+1

Symbol details & contracts	contracts_for_symbol	Get contract types, durations, payout etc.
Real-time ticks	ticks (subscribe)	Streaming asset prices.
Historical ticks	ticks_history	Charting and data context.
Price proposal for contract	price_proposal or proposal	Before purchase show expected payout.
Buy contract / place trade	buy (or buy_contract)	Execute the trade.
Monitor open contracts	portfolio (or equivalent)	Retrieve user’s active contracts.
Account balance/status	balance, get_account_status	Show user funds and verification state.
Transaction history	statement, account_profit, or custom	Past trades and fund movements.
Exchange rates	exchange_rates	If multiple currencies or conversions.
WebSocket control & subscriptions	forget, ping, logout, and website_status	For managing connections and health.
4. User Flows (High-Level)

Here are a few core user flows we’ll support in MVP.

4.1 Sign-Up / Onboarding

User visits web/mobile site.

Clicks “Sign up” → enters email/password (plus 2FA setup) → selects residence & currency.

Link to Deriv account via OAuth/token or enter API token if required.

Show user dashboard with zero trades initially.

4.2 Browse & Select Asset

User logs in, lands on Dashboard (shows balance + “Browse assets” list).

Asset list shows categories (Forex, Indices, Commodities, synthetics) + real-time price, 24h change, volatility indicator.

User taps an asset → sees symbol detail view: contract types (Up/Down, Digits, etc.), durations, sample payouts, historical chart.

User chooses contract type, stake amount, duration/expiry.

4.3 Execute Trade / Contract

From symbol detail, user inputs stake amount, selects direction (Up/Down or other), selects expiry/duration, optionally barrier.

App fetches price proposal from API. Show expected payout, risk (stake), profit-loss projection.

User confirms “Buy Contract”.

Backend sends buy API call. If accepted, user sees open contract in “Open Trades”.

While contract is active, user can view countdown, current status (if streaming updates), profit/loss evolving.

At expiry/close: contract moves to “Closed Trades” with result (win/loss), amount returned, profit/loss.

4.4 Portfolio & History

“Open Trades” tab: List of active contracts, with asset, stake, expiry time, current potential payout/loss.

“History” tab: Past contracts/trades, showing stake, result, realised profit/loss, date/time.

“Balance” section: current trading funds, available funds, currency.

Optionally: “Deposits & Withdrawals” (if supported) – shows pending and completed cash flows.

4.5 Mobile Web Adaptation

On mobile, simplified nav: Dashboard, Browse, Trades, Profile.

Use simplified chart (mobile friendly), reduced clutter.

Touch interactions for selecting contract parameters.

Responsive layout for portrait and landscape.

5. Technical/Non-Functional Requirements

Performance: Real-time price updates with minimum latency; UI updates smoothly (target <200ms for tick update).

Scalability: Should handle simultaneous streaming for many users; backend should efficiently multiplex socket connections.

Security: Use encrypted connections (wss://), secure token storage (e.g., http-only cookies or secure storage on mobile).

Reliability & Availability: Graceful handling of API downtime, reconnect logic for WebSocket, show user friendly error messages.

Accessibility: Basic WCAG compliance (contrast, mobile usability).

Cross-Browser / Cross-Device: Support latest versions of major browsers, iOS and Android mobile browsers.

Maintainability: Modular architecture, separation of concerns (API layer, state management, UI components), clear documentation.

Compliance: Follow Deriv’s terms of use for API, abide by any regional regulatory requirements. Provide proper risk warnings (binary options/high-risk instruments) as required. 
Commodity Futures Trading Commission
+1

6. Assumptions & Constraints

We assume user already has or will create a Deriv account; our platform will act as a frontend over the Deriv API.

We assume the Deriv API provides all necessary endpoints (which from the docs it does) for contract operations. 
Deriv API

Regulatory risk: Binary options and derivatives trading may face strong regulation in your target markets; we must include appropriate disclaimers and ensure compliance. 
Commodity Futures Trading Commission
+1

For MVP, we may exclude or limit advanced features (e.g., bots, copy trading, deep analytics) to keep timeline reasonable.

UI framework: we commit to LitElement (or similar lightweight component library) for speed — may need to evaluate mobile performance.

Data caching & user analytics: initially minimal, expanded in later phases.

7. Success Metrics (MVP)

Platform can list and display at least 50 tradeable symbols with real-time price streaming.

User can successfully place a contract and see result (win/loss) via Deriv API.

Balance and portfolio view reflect actual Deriv account state (within acceptable latency).

Web version loads within ≤3 s on average; mobile version loads within ≤4 s.

No major security/authorization breaches; WebSocket reconnection rate under acceptable threshold.

User interface rating (via internal feedback) ≥4/5 for ease of use in initial pilot group.  

FOLDER DESCRIPTIONS
Folder/File	Description
public/	Holds static files like favicon, index.html, and logos.
src/components/	Small reusable LitElement components (widgets).
src/pages/	Full-page components, mapped to routes.
src/services/	Handles WebSocket logic, Deriv API calls, and token storage.
src/store/	Lightweight state management, observable stores for reactivity.
src/styles/	Theme variables, global styles, color palettes.
src/utils/	Helper utilities: data formatting, API helpers, etc.
tests/	Contains automated tests to ensure stability.
mobile/	Dedicated codebase for mobile layout (PWA or hybrid app).
vite.config.js	Build optimization and hot reload setup.