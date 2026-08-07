/**
 * FinTech & Quant Trading Coding Problem Bank — Volume 3
 * Companies: Stripe, Block, PayPal, Plaid, Robinhood, Coinbase, Affirm, Brex,
 *            Jane Street, Citadel, Two Sigma, Hudson River Trading, Jump Trading,
 *            D.E. Shaw, Bloomberg
 * 15 problems per company = 225 total
 */

import type { StaticProblem } from "./problem-bank"

export const FINTECH_PROBLEM_BANK: Record<string, StaticProblem & { company: string; pattern: string }> = {

// =============================================================================
// STRIPE (15 problems)
// =============================================================================

"Stripe: Accept Language Header Parser": {
  company: "stripe", pattern: "String Parsing",
  title: "Accept Language Header Parser",
  difficulty: "Medium",
  desc: "Parse an HTTP Accept-Language header value. Given a string `header` (e.g. 'en-US,en;q=0.9,fr;q=0.8') and a list of supported locales, return the best matching locale. Matching is done by quality factor (q value, default 1.0) in descending order. Return the first supported locale that matches.",
  examples: [
    { input: 'header = "en-US,en;q=0.9,fr;q=0.8", supported = ["fr","en"]', output: '"en"', explanation: "en-US has q=1.0, en has q=0.9. fr has q=0.8. Best supported match is 'en'" },
    { input: 'header = "fr;q=0.9,en;q=0.8", supported = ["en","de"]', output: '"en"' }
  ],
  constraints: ["1 <= header.length <= 500", "1 <= supported.length <= 20", "Each locale is 2-5 lowercase letters"],
  functionSignature: "def bestLocale(self, header: str, supported: List[str]) -> str:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def bestLocale(self, header: str, supported: List[str]) -> str:\n        pass",
    JavaScript: "var bestLocale = function(header, supported) {\n    \n};",
    TypeScript: "function bestLocale(header: string, supported: string[]): string {\n    \n};",
    Java: "class Solution {\n    public String bestLocale(String header, String[] supported) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    string bestLocale(string header, vector<string>& supported) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.bestLocale("en-US,en;q=0.9,fr;q=0.8", ["fr","en"]))', expected: "en", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.bestLocale("fr;q=0.9,en;q=0.8", ["en","de"]))', expected: "en", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.bestLocale("de,en;q=0.5", ["fr","de","en"]))', expected: "de", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.bestLocale("zh;q=0.9", ["en","fr"]))', expected: "", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.bestLocale("en", ["en"]))', expected: "en", isPublic: false },
  ],
},

"Stripe: Design Key-Value Store with Transactions": {
  company: "stripe", pattern: "Stack / Hash Map Design",
  title: "Key-Value Store with Transactions",
  difficulty: "Hard",
  desc: "Design a key-value store that supports transactions. Implement: set(key, val), get(key), delete(key), begin(), commit(), rollback(). Nested transactions are supported. Changes within an uncommitted transaction are invisible outside it.",
  examples: [
    { input: "begin, set('a',1), get('a') -> 1, rollback, get('a') -> null" , output: "1, null" },
    { input: "set('a',1), begin, set('a',2), commit, get('a') -> 2", output: "2" }
  ],
  constraints: ["Keys and values are non-empty strings", "At most 10^4 operations", "begin/commit/rollback may be called without prior context"],
  functionSignature: "def get(self, key: str) -> Optional[str]:",
  starters: {
    Python: "from typing import Optional\n\nclass KeyValueStore:\n    def __init__(self):\n        pass\n\n    def set(self, key: str, val: str) -> None:\n        pass\n\n    def get(self, key: str) -> Optional[str]:\n        pass\n\n    def delete(self, key: str) -> None:\n        pass\n\n    def begin(self) -> None:\n        pass\n\n    def commit(self) -> None:\n        pass\n\n    def rollback(self) -> None:\n        pass",
    JavaScript: "class KeyValueStore {\n    constructor() {}\n    set(key, val) {}\n    get(key) { return null; }\n    delete(key) {}\n    begin() {}\n    commit() {}\n    rollback() {}\n}",
    TypeScript: "class KeyValueStore {\n    constructor() {}\n    set(key: string, val: string): void {}\n    get(key: string): string | null { return null; }\n    delete(key: string): void {}\n    begin(): void {}\n    commit(): void {}\n    rollback(): void {}\n}",
    Java: "class KeyValueStore {\n    public void set(String key, String val) {}\n    public String get(String key) { return null; }\n    public void delete(String key) {}\n    public void begin() {}\n    public void commit() {}\n    public void rollback() {}\n}",
    "C++": "class KeyValueStore {\npublic:\n    void set(string key, string val) {}\n    string get(string key) { return \"\"; }\n    void del(string key) {}\n    void begin() {}\n    void commit() {}\n    void rollback() {}\n};",
  },
  testCases: [
    { script: "kvs = KeyValueStore()\nkvs.set('a','1')\nprint(kvs.get('a'))", expected: "1", isPublic: true },
    { script: "kvs = KeyValueStore()\nkvs.begin()\nkvs.set('a','1')\nkvs.rollback()\nprint(kvs.get('a'))", expected: "None", isPublic: true },
    { script: "kvs = KeyValueStore()\nkvs.set('a','1')\nkvs.begin()\nkvs.set('a','2')\nkvs.commit()\nprint(kvs.get('a'))", expected: "2", isPublic: false },
    { script: "kvs = KeyValueStore()\nkvs.set('a','1')\nkvs.begin()\nkvs.delete('a')\nkvs.rollback()\nprint(kvs.get('a'))", expected: "1", isPublic: false },
    { script: "kvs = KeyValueStore()\nkvs.begin()\nkvs.begin()\nkvs.set('x','10')\nkvs.rollback()\nprint(kvs.get('x'))", expected: "None", isPublic: false },
  ],
},

"Stripe: Determine Min Penalty for Shop Closing": {
  company: "stripe", pattern: "Prefix Sum / Sliding Window",
  title: "Minimum Penalty for a Shop",
  difficulty: "Medium",
  desc: "You are given the `customers` string where customers[i] is 'Y' if there is a customer at hour i and 'N' if no customer. If the shop closes at hour j, the penalty is: number of 'Y' in hours >= j (missed customers) + number of 'N' in hours < j (open when nobody came). Find the hour j (0..n) that minimizes penalty.",
  examples: [
    { input: 'customers = "YYNY"', output: "2" },
    { input: 'customers = "NNNNN"', output: "0" }
  ],
  constraints: ["1 <= customers.length <= 10^5", "customers[i] is 'Y' or 'N'"],
  functionSignature: "def bestClosingTime(self, customers: str) -> int:",
  starters: {
    Python: "class Solution:\n    def bestClosingTime(self, customers: str) -> int:\n        pass",
    JavaScript: "var bestClosingTime = function(customers) {\n    \n};",
    TypeScript: "function bestClosingTime(customers: string): number {\n    \n};",
    Java: "class Solution {\n    public int bestClosingTime(String customers) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int bestClosingTime(string customers) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.bestClosingTime("YYNY"))', expected: "2", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.bestClosingTime("NNNNN"))', expected: "0", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.bestClosingTime("YYYY"))', expected: "4", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.bestClosingTime("YYNYNYYY"))', expected: "7", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.bestClosingTime("N"))', expected: "0", isPublic: false },
  ],
},

"Stripe: Rate Limiter Design": {
  company: "stripe", pattern: "Sliding Window / Design",
  title: "Design Rate Limiter",
  difficulty: "Medium",
  desc: "Design a rate limiter that allows at most `maxRequests` requests per `windowMs` milliseconds per user. Implement: isAllowed(userId, timestamp). Return true if the request is within the limit, false otherwise. Timestamps are in milliseconds and arrive in non-decreasing order.",
  examples: [
    { input: "maxRequests=2, windowMs=1000, calls: isAllowed('u1',100), isAllowed('u1',200), isAllowed('u1',300)", output: "[true, true, false]" },
    { input: "maxRequests=1, windowMs=500, calls: isAllowed('u1',0), isAllowed('u1',499), isAllowed('u1',500)", output: "[true, false, true]" }
  ],
  constraints: ["1 <= maxRequests <= 100", "1 <= windowMs <= 10^6", "0 <= timestamp <= 10^9"],
  functionSignature: "def isAllowed(self, userId: str, timestamp: int) -> bool:",
  starters: {
    Python: "from collections import defaultdict, deque\n\nclass RateLimiter:\n    def __init__(self, maxRequests: int, windowMs: int):\n        pass\n\n    def isAllowed(self, userId: str, timestamp: int) -> bool:\n        pass",
    JavaScript: "class RateLimiter {\n    constructor(maxRequests, windowMs) {}\n    isAllowed(userId, timestamp) { return true; }\n}",
    TypeScript: "class RateLimiter {\n    constructor(private maxRequests: number, private windowMs: number) {}\n    isAllowed(userId: string, timestamp: number): boolean { return true; }\n}",
    Java: "class RateLimiter {\n    public RateLimiter(int maxRequests, long windowMs) {}\n    public boolean isAllowed(String userId, long timestamp) { return true; }\n}",
    "C++": "class RateLimiter {\npublic:\n    RateLimiter(int maxReq, long long windowMs) {}\n    bool isAllowed(string userId, long long ts) { return true; }\n};",
  },
  testCases: [
    { script: "rl = RateLimiter(2, 1000)\nprint(rl.isAllowed('u1', 100))", expected: "True", isPublic: true },
    { script: "rl = RateLimiter(2, 1000)\nrl.isAllowed('u1',100)\nrl.isAllowed('u1',200)\nprint(rl.isAllowed('u1',300))", expected: "False", isPublic: true },
    { script: "rl = RateLimiter(2, 1000)\nrl.isAllowed('u1',100)\nrl.isAllowed('u1',200)\nprint(rl.isAllowed('u1',1101))", expected: "True", isPublic: false },
    { script: "rl = RateLimiter(1, 500)\nrl.isAllowed('u1',0)\nprint(rl.isAllowed('u1',499))", expected: "False", isPublic: false },
    { script: "rl = RateLimiter(3, 1000)\nrl.isAllowed('u1',0)\nrl.isAllowed('u1',100)\nrl.isAllowed('u1',200)\nprint(rl.isAllowed('u2',200))", expected: "True", isPublic: false },
  ],
},

"Stripe: Billing Cycle Proration": {
  company: "stripe", pattern: "Math / Date Arithmetic",
  title: "Subscription Proration Calculator",
  difficulty: "Medium",
  desc: "A customer upgrades their subscription mid-cycle. Given the current plan price `oldPrice` (per month), new plan price `newPrice`, `cycleStart` (day 1-28), `upgradeDay` (day in month, >= cycleStart), and `cycleLength` (days in month, 28-31). Calculate the prorated charge: credit unused days of old plan, charge remaining days of new plan. Return the net charge rounded to 2 decimal places.",
  examples: [
    { input: "oldPrice=10, newPrice=30, cycleStart=1, upgradeDay=11, cycleLength=30", output: "13.33", explanation: "Credit 20/30 of $10=$6.67, charge 20/30 of $30=$20, net=$13.33" },
    { input: "oldPrice=20, newPrice=20, cycleStart=1, upgradeDay=15, cycleLength=30", output: "0.00" }
  ],
  constraints: ["0 < oldPrice, newPrice <= 1000", "1 <= cycleStart <= upgradeDay <= cycleLength <= 31"],
  functionSignature: "def proratedCharge(self, oldPrice: float, newPrice: float, cycleStart: int, upgradeDay: int, cycleLength: int) -> float:",
  starters: {
    Python: "class Solution:\n    def proratedCharge(self, oldPrice: float, newPrice: float, cycleStart: int, upgradeDay: int, cycleLength: int) -> float:\n        pass",
    JavaScript: "var proratedCharge = function(oldPrice, newPrice, cycleStart, upgradeDay, cycleLength) {\n    \n};",
    TypeScript: "function proratedCharge(oldPrice: number, newPrice: number, cycleStart: number, upgradeDay: number, cycleLength: number): number {\n    \n};",
    Java: "class Solution {\n    public double proratedCharge(double oldPrice, double newPrice, int cycleStart, int upgradeDay, int cycleLength) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    double proratedCharge(double old_, double new_, int start, int upgrade, int len) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(round(sol.proratedCharge(10, 30, 1, 11, 30), 2))", expected: "13.33", isPublic: true },
    { script: "sol = Solution()\nprint(round(sol.proratedCharge(20, 20, 1, 15, 30), 2))", expected: "0.0", isPublic: true },
    { script: "sol = Solution()\nprint(round(sol.proratedCharge(0, 30, 1, 1, 31), 2))", expected: "30.0", isPublic: false },
    { script: "sol = Solution()\nprint(round(sol.proratedCharge(10, 30, 1, 30, 30), 2))", expected: "0.67", isPublic: false },
    { script: "sol = Solution()\nprint(round(sol.proratedCharge(10, 30, 1, 1, 30), 2))", expected: "20.0", isPublic: false },
  ],
},

"Stripe: Webhook Signature Verification": {
  company: "stripe", pattern: "Cryptography / String",
  title: "Verify Webhook Signature",
  difficulty: "Medium",
  desc: "Given a webhook payload string and a list of recent timestamps, verify whether a signed payload is valid. A signed payload is formed as 'timestamp.payload'. An HMAC-SHA256 is computed over signed_payload using a secret key. Given `payload`, `timestamp`, `signature` (hex), `secret`, and `tolerance` (max seconds old), return True if valid and within tolerance. Simulate HMAC with: hash = sum(ord(c) for c in (str(timestamp) + '.' + payload + secret)) % (10**8).",
  examples: [
    { input: "payload='{}', timestamp=1000, signature='expected', secret='sk', tolerance=300, now=1200", output: "true" },
    { input: "payload='{}', timestamp=1000, signature='wrong', secret='sk', tolerance=300, now=1200", output: "false" }
  ],
  constraints: ["payload is valid JSON string", "tolerance >= 0", "now >= timestamp"],
  functionSignature: "def verifyWebhook(self, payload: str, timestamp: int, signature: int, secret: str, tolerance: int, now: int) -> bool:",
  starters: {
    Python: "class Solution:\n    def verifyWebhook(self, payload: str, timestamp: int, signature: int, secret: str, tolerance: int, now: int) -> bool:\n        pass",
    JavaScript: "var verifyWebhook = function(payload, timestamp, signature, secret, tolerance, now) {\n    \n};",
    TypeScript: "function verifyWebhook(payload: string, timestamp: number, signature: number, secret: string, tolerance: number, now: number): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean verifyWebhook(String payload, int timestamp, int signature, String secret, int tolerance, int now) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool verifyWebhook(string payload, int ts, int sig, string secret, int tol, int now) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nts,pl,sec=1000,'{}','sk'\nexpected=sum(ord(c) for c in (str(ts)+'.'+pl+sec))%(10**8)\nprint(sol.verifyWebhook(pl,ts,expected,sec,300,1200))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.verifyWebhook('{}',1000,99999,'sk',300,1200))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nts,pl,sec=1000,'{}','sk'\nexpected=sum(ord(c) for c in (str(ts)+'.'+pl+sec))%(10**8)\nprint(sol.verifyWebhook(pl,ts,expected,sec,300,1400))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nts,pl,sec=500,'data','key'\nexpected=sum(ord(c) for c in (str(ts)+'.'+pl+sec))%(10**8)\nprint(sol.verifyWebhook(pl,ts,expected,sec,600,1000))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nts,pl,sec=0,'test','abc'\nexpected=sum(ord(c) for c in (str(ts)+'.'+pl+sec))%(10**8)\nprint(sol.verifyWebhook(pl,ts,expected,sec,0,0))", expected: "True", isPublic: false },
  ],
},

"Stripe: Parse and Execute Discount Codes": {
  company: "stripe", pattern: "String Parsing / Design",
  title: "Discount Code Engine",
  difficulty: "Medium",
  desc: "Given a list of discount rules (each rule is a string like 'SAVE10:percent:10', 'FLAT5:flat:5', 'HALF:percent:50') and a list of transactions (each is [code, amount]), apply the discount if code matches a rule, else apply 0 discount. Return list of final amounts after discount, rounded to 2 decimal places.",
  examples: [
    { input: "rules=[['SAVE10','percent',10]], txns=[['SAVE10',100],['NONE',50]]", output: "[90.0, 50.0]" },
    { input: "rules=[['FLAT5','flat',5]], txns=[['FLAT5',20]]", output: "[15.0]" }
  ],
  constraints: ["1 <= rules.length <= 100", "1 <= txns.length <= 1000", "0 < amount <= 10^6"],
  functionSignature: "def applyDiscounts(self, rules: List[List], txns: List[List]) -> List[float]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def applyDiscounts(self, rules: List[List], txns: List[List]) -> List[float]:\n        pass",
    JavaScript: "var applyDiscounts = function(rules, txns) {\n    \n};",
    TypeScript: "function applyDiscounts(rules: any[][], txns: any[][]): number[] {\n    \n};",
    Java: "class Solution {\n    public List<Double> applyDiscounts(List<List<Object>> rules, List<List<Object>> txns) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<double> applyDiscounts(vector<vector<string>>& rules, vector<pair<string,double>>& txns) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.applyDiscounts([['SAVE10','percent',10]], [['SAVE10',100],['NONE',50]]))", expected: "[90.0, 50.0]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.applyDiscounts([['FLAT5','flat',5]], [['FLAT5',20]]))", expected: "[15.0]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.applyDiscounts([['HALF','percent',50]], [['HALF',200]]))", expected: "[100.0]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.applyDiscounts([['A','flat',3],['B','percent',25]], [['B',100],['A',10]]))", expected: "[75.0, 7.0]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.applyDiscounts([], [['X',50]]))", expected: "[50.0]", isPublic: false },
  ],
},

"Stripe: Idempotency Key Deduplication": {
  company: "stripe", pattern: "Hash Map / Design",
  title: "Idempotent Request Handler",
  difficulty: "Easy",
  desc: "Implement an IdempotentHandler that processes payment requests. Each request has an idempotency key. If the same key is seen again, return the cached result instead of processing again. processPayment(key, amount) returns amount*1.03 (processing fee) rounded to 2 decimal places on first call; subsequent calls with same key return the cached value. Also implement clearExpired(currentTime, ttl) to remove keys older than ttl seconds.",
  examples: [
    { input: "processPayment('k1',100) -> 103.0, processPayment('k1',200) -> 103.0 (cached)", output: "103.0, 103.0" },
    { input: "processPayment('k1',100) at t=0, clearExpired(t=301, ttl=300), processPayment('k1',200) -> 206.0", output: "206.0" }
  ],
  constraints: ["Keys are unique strings", "0 < amount <= 10^6", "ttl >= 0"],
  functionSignature: "def processPayment(self, key: str, amount: float) -> float:",
  starters: {
    Python: "class IdempotentHandler:\n    def __init__(self):\n        pass\n\n    def processPayment(self, key: str, amount: float, timestamp: int = 0) -> float:\n        pass\n\n    def clearExpired(self, currentTime: int, ttl: int) -> None:\n        pass",
    JavaScript: "class IdempotentHandler {\n    constructor() {}\n    processPayment(key, amount, timestamp = 0) { return 0; }\n    clearExpired(currentTime, ttl) {}\n}",
    TypeScript: "class IdempotentHandler {\n    constructor() {}\n    processPayment(key: string, amount: number, timestamp: number = 0): number { return 0; }\n    clearExpired(currentTime: number, ttl: number): void {}\n}",
    Java: "class IdempotentHandler {\n    public double processPayment(String key, double amount, int ts) { return 0; }\n    public void clearExpired(int now, int ttl) {}\n}",
    "C++": "class IdempotentHandler {\npublic:\n    double processPayment(string key, double amount, int ts = 0) { return 0; }\n    void clearExpired(int now, int ttl) {}\n};",
  },
  testCases: [
    { script: "h = IdempotentHandler()\nprint(h.processPayment('k1', 100))", expected: "103.0", isPublic: true },
    { script: "h = IdempotentHandler()\nh.processPayment('k1', 100)\nprint(h.processPayment('k1', 200))", expected: "103.0", isPublic: true },
    { script: "h = IdempotentHandler()\nh.processPayment('k1', 100, 0)\nh.clearExpired(301, 300)\nprint(h.processPayment('k1', 200, 301))", expected: "206.0", isPublic: false },
    { script: "h = IdempotentHandler()\nprint(h.processPayment('k2', 50))", expected: "51.5", isPublic: false },
    { script: "h = IdempotentHandler()\nh.processPayment('k1', 100, 0)\nh.processPayment('k2', 200, 100)\nh.clearExpired(350, 300)\nprint(h.processPayment('k1', 999, 350))", expected: "1028.97", isPublic: false },
  ],
},

"Stripe: Currency Conversion Chain": {
  company: "stripe", pattern: "Graph / BFS",
  title: "Currency Exchange Rate Chain",
  difficulty: "Medium",
  desc: "Given a list of direct currency pairs and their exchange rates, find the conversion rate from `src` to `dst`. If no path exists, return -1.0. Use BFS/DFS over the currency graph. Each edge (a->b) has rate r, meaning 1 unit of a = r units of b.",
  examples: [
    { input: "pairs=[['USD','EUR',0.9],['EUR','GBP',0.8]], src='USD', dst='GBP'", output: "0.72" },
    { input: "pairs=[['A','B',2.0]], src='A', dst='C'", output: "-1.0" }
  ],
  constraints: ["1 <= pairs.length <= 100", "All rates > 0", "src and dst are valid currency codes"],
  functionSignature: "def convertCurrency(self, pairs: List[List], src: str, dst: str) -> float:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def convertCurrency(self, pairs: List[List], src: str, dst: str) -> float:\n        pass",
    JavaScript: "var convertCurrency = function(pairs, src, dst) {\n    \n};",
    TypeScript: "function convertCurrency(pairs: any[][], src: string, dst: string): number {\n    \n};",
    Java: "class Solution {\n    public double convertCurrency(List<List<Object>> pairs, String src, String dst) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    double convertCurrency(vector<tuple<string,string,double>>& pairs, string src, string dst) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(round(sol.convertCurrency([['USD','EUR',0.9],['EUR','GBP',0.8]],'USD','GBP'),4))", expected: "0.72", isPublic: true },
    { script: "sol = Solution()\nprint(sol.convertCurrency([['A','B',2.0]],'A','C'))", expected: "-1.0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.convertCurrency([['A','B',2.0]],'A','A'))", expected: "1.0", isPublic: false },
    { script: "sol = Solution()\nprint(round(sol.convertCurrency([['A','B',2.0],['B','C',3.0],['C','D',4.0]],'A','D'),2))", expected: "24.0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.convertCurrency([['X','Y',1.5]],'Y','X'))", expected: "0.6666666666666666", isPublic: false },
  ],
},

"Stripe: Detect Fraudulent Transactions": {
  company: "stripe", pattern: "Sliding Window / Hash Map",
  title: "Detect Suspicious Transactions",
  difficulty: "Medium",
  desc: "Given a list of transactions [userId, amount, timestamp] and thresholds `maxAmount` and `windowSecs`, mark a transaction as suspicious if: (1) its amount > maxAmount, OR (2) there are >= 3 transactions from the same user within any `windowSecs`-second window. Return list of indices of suspicious transactions.",
  examples: [
    { input: "txns=[['u1',200,0],['u1',10,1],['u1',10,2],['u1',10,3]], maxAmount=100, windowSecs=5", output: "[0, 1, 2, 3]" },
    { input: "txns=[['u1',10,0],['u2',10,1]], maxAmount=100, windowSecs=5", output: "[]" }
  ],
  constraints: ["1 <= txns.length <= 10^4", "Timestamps are non-decreasing", "0 < maxAmount <= 10^6"],
  functionSignature: "def detectFraud(self, txns: List[List], maxAmount: float, windowSecs: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def detectFraud(self, txns: List[List], maxAmount: float, windowSecs: int) -> List[int]:\n        pass",
    JavaScript: "var detectFraud = function(txns, maxAmount, windowSecs) {\n    \n};",
    TypeScript: "function detectFraud(txns: any[][], maxAmount: number, windowSecs: number): number[] {\n    \n};",
    Java: "class Solution {\n    public List<Integer> detectFraud(List<List<Object>> txns, double maxAmount, int windowSecs) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> detectFraud(vector<tuple<string,double,int>>& txns, double maxAmt, int winSecs) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.detectFraud([['u1',200,0],['u1',10,1],['u1',10,2],['u1',10,3]],100,5))", expected: "[0, 1, 2, 3]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.detectFraud([['u1',10,0],['u2',10,1]],100,5))", expected: "[]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.detectFraud([['u1',500,0]],100,5))", expected: "[0]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.detectFraud([['u1',10,0],['u1',10,10],['u1',10,20]],100,5))", expected: "[]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.detectFraud([['u1',10,0],['u1',10,1],['u1',10,2],['u1',10,100]],100,5))", expected: "[0, 1, 2]", isPublic: false },
  ],
},

"Stripe: Retry Logic with Exponential Backoff": {
  company: "stripe", pattern: "Simulation / Math",
  title: "Exponential Backoff Simulator",
  difficulty: "Easy",
  desc: "Given initial delay `base` (ms), multiplier `factor`, max retries `maxRetries`, and `jitter` (boolean), compute the sequence of wait times before each retry attempt. If jitter is true, each delay is randomly reduced by up to 50% (simulate with delay * 0.75 for determinism). Return list of delays (rounded to nearest integer).",
  examples: [
    { input: "base=100, factor=2, maxRetries=4, jitter=false", output: "[100, 200, 400, 800]" },
    { input: "base=100, factor=2, maxRetries=3, jitter=true", output: "[75, 150, 300]" }
  ],
  constraints: ["1 <= base <= 10^4", "1 <= factor <= 10", "1 <= maxRetries <= 10"],
  functionSignature: "def backoffDelays(self, base: int, factor: int, maxRetries: int, jitter: bool) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def backoffDelays(self, base: int, factor: int, maxRetries: int, jitter: bool) -> List[int]:\n        pass",
    JavaScript: "var backoffDelays = function(base, factor, maxRetries, jitter) {\n    \n};",
    TypeScript: "function backoffDelays(base: number, factor: number, maxRetries: number, jitter: boolean): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] backoffDelays(int base, int factor, int maxRetries, boolean jitter) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> backoffDelays(int base, int factor, int maxRetries, bool jitter) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.backoffDelays(100, 2, 4, False))", expected: "[100, 200, 400, 800]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.backoffDelays(100, 2, 3, True))", expected: "[75, 150, 300]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.backoffDelays(200, 3, 3, False))", expected: "[200, 600, 1800]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.backoffDelays(100, 2, 1, False))", expected: "[100]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.backoffDelays(50, 2, 5, True))", expected: "[38, 75, 150, 300, 600]", isPublic: false },
  ],
},

"Stripe: Invoice Line Item Aggregation": {
  company: "stripe", pattern: "Hash Map / Aggregation",
  title: "Aggregate Invoice Line Items",
  difficulty: "Easy",
  desc: "Given a list of line items [product, quantity, unitPrice], group by product and return a list of [product, totalQuantity, totalRevenue] sorted by product name alphabetically. totalRevenue = sum(quantity * unitPrice) for each product.",
  examples: [
    { input: "items=[['api',2,10.0],['api',3,10.0],['webhook',1,5.0]]", output: "[['api', 5, 50.0], ['webhook', 1, 5.0]]" },
    { input: "items=[['plan',1,99.0]]", output: "[['plan', 1, 99.0]]" }
  ],
  constraints: ["1 <= items.length <= 10^4", "product names are lowercase strings", "quantity >= 1", "unitPrice > 0"],
  functionSignature: "def aggregateItems(self, items: List[List]) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def aggregateItems(self, items: List[List]) -> List[List]:\n        pass",
    JavaScript: "var aggregateItems = function(items) {\n    \n};",
    TypeScript: "function aggregateItems(items: any[][]): any[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Object>> aggregateItems(List<List<Object>> items) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<tuple<string,int,double>> aggregateItems(vector<tuple<string,int,double>>& items) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.aggregateItems([['api',2,10.0],['api',3,10.0],['webhook',1,5.0]]))", expected: "[['api', 5, 50.0], ['webhook', 1, 5.0]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.aggregateItems([['plan',1,99.0]]))", expected: "[['plan', 1, 99.0]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.aggregateItems([['b',1,1.0],['a',2,2.0]]))", expected: "[['a', 2, 4.0], ['b', 1, 1.0]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.aggregateItems([['x',3,5.0],['x',2,5.0],['y',1,10.0]]))", expected: "[['x', 5, 25.0], ['y', 1, 10.0]]", isPublic: false },
    { script: "sol = Solution()\nresult = sol.aggregateItems([['c',1,1.0],['b',1,2.0],['a',1,3.0]])\nprint([r[0] for r in result])", expected: "['a', 'b', 'c']", isPublic: false },
  ],
},

// =============================================================================
// BLOCK / SQUARE (15 problems)
// =============================================================================

"Block: Cash App P2P Transfer Validation": {
  company: "block", pattern: "Graph / Fraud Detection",
  title: "P2P Transfer Chain Validation",
  difficulty: "Medium",
  desc: "Given a list of peer-to-peer transfers [sender, receiver, amount] and a daily limit per user, determine which transfers are invalid. A transfer is invalid if the sender's total sent amount for the day exceeds `dailyLimit`. Process transfers in order; once invalid, that transfer is skipped (not counted). Return list of invalid transfer indices.",
  examples: [
    { input: "transfers=[['A','B',300],['A','C',200],['A','D',100]], dailyLimit=400", output: "[1, 2]" },
    { input: "transfers=[['A','B',100]], dailyLimit=500", output: "[]" }
  ],
  constraints: ["1 <= transfers.length <= 10^4", "0 < amount <= 10^6", "0 < dailyLimit <= 10^7"],
  functionSignature: "def invalidTransfers(self, transfers: List[List], dailyLimit: float) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def invalidTransfers(self, transfers: List[List], dailyLimit: float) -> List[int]:\n        pass",
    JavaScript: "var invalidTransfers = function(transfers, dailyLimit) {\n    \n};",
    TypeScript: "function invalidTransfers(transfers: any[][], dailyLimit: number): number[] {\n    \n};",
    Java: "class Solution {\n    public List<Integer> invalidTransfers(List<List<Object>> transfers, double dailyLimit) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> invalidTransfers(vector<tuple<string,string,double>>& t, double lim) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.invalidTransfers([['A','B',300],['A','C',200],['A','D',100]], 400))", expected: "[1, 2]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.invalidTransfers([['A','B',100]], 500))", expected: "[]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.invalidTransfers([['A','B',400],['A','C',1]], 400))", expected: "[1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.invalidTransfers([['A','B',100],['B','C',600],['A','C',200]], 500))", expected: "[1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.invalidTransfers([['X','Y',250],['X','Y',250],['X','Y',250]], 500))", expected: "[2]", isPublic: false },
  ],
},

"Block: Bitcoin UTXO Selection": {
  company: "block", pattern: "Greedy / DP",
  title: "UTXO Coin Selection",
  difficulty: "Hard",
  desc: "Given a list of UTXO amounts and a target amount, select the minimum number of UTXOs whose sum equals exactly `target`. UTXOs cannot be partially spent. Return the selected UTXO amounts, or empty list if impossible. If multiple selections have same count, return the one with the smallest sum of selected amounts.",
  examples: [
    { input: "utxos=[1,5,10,25], target=30", output: "[5, 25]" },
    { input: "utxos=[1,2,3], target=7", output: "[]" }
  ],
  constraints: ["1 <= utxos.length <= 20", "1 <= utxo <= 10^6", "1 <= target <= 10^7"],
  functionSignature: "def selectUTXOs(self, utxos: List[int], target: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def selectUTXOs(self, utxos: List[int], target: int) -> List[int]:\n        pass",
    JavaScript: "var selectUTXOs = function(utxos, target) {\n    \n};",
    TypeScript: "function selectUTXOs(utxos: number[], target: number): number[] {\n    \n};",
    Java: "class Solution {\n    public List<Integer> selectUTXOs(int[] utxos, int target) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> selectUTXOs(vector<int>& utxos, int target) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sorted(sol.selectUTXOs([1,5,10,25], 30)))", expected: "[5, 25]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.selectUTXOs([1,2,3], 7))", expected: "[]", isPublic: true },
    { script: "sol = Solution()\nprint(sorted(sol.selectUTXOs([5,5,5], 10)))", expected: "[5, 5]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.selectUTXOs([10], 10))", expected: "[10]", isPublic: false },
    { script: "sol = Solution()\nprint(sorted(sol.selectUTXOs([1,2,5,10,20], 15)))", expected: "[5, 10]", isPublic: false },
  ],
},

"Block: Square Register Receipt Parser": {
  company: "block", pattern: "String Parsing",
  title: "Receipt Line Item Parser",
  difficulty: "Easy",
  desc: "Parse a receipt text. Each line is either: (1) an item line 'NAME: $PRICE' or (2) a discount line 'DISCOUNT: -$AMOUNT'. Return dict with keys: 'items' (list of [name, price]), 'total' (sum of items - discounts), 'discounts' (total discount amount). All prices are positive floats.",
  examples: [
    { input: 'receipt = "Coffee: $4.50\\nMuffin: $3.00\\nDISCOUNT: -$1.50"', output: "{'items':[['Coffee',4.5],['Muffin',3.0]],'total':6.0,'discounts':1.5}" },
    { input: 'receipt = "Tea: $2.00"', output: "{'items':[['Tea',2.0]],'total':2.0,'discounts':0.0}" }
  ],
  constraints: ["receipt has 1-50 lines", "Prices have up to 2 decimal places"],
  functionSignature: "def parseReceipt(self, receipt: str) -> dict:",
  starters: {
    Python: "class Solution:\n    def parseReceipt(self, receipt: str) -> dict:\n        pass",
    JavaScript: "var parseReceipt = function(receipt) {\n    \n};",
    TypeScript: "function parseReceipt(receipt: string): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String, Object> parseReceipt(String receipt) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string, double> parseReceipt(string receipt) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.parseReceipt('Coffee: $4.50\\nMuffin: $3.00\\nDISCOUNT: -$1.50')\nprint(r['total'])", expected: "6.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.parseReceipt('Tea: $2.00')\nprint(r['discounts'])", expected: "0.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.parseReceipt('A: $10.00\\nB: $5.00\\nDISCOUNT: -$2.00')\nprint(len(r['items']))", expected: "2", isPublic: false },
    { script: "sol = Solution()\nr = sol.parseReceipt('X: $100.00\\nDISCOUNT: -$50.00')\nprint(r['total'])", expected: "50.0", isPublic: false },
    { script: "sol = Solution()\nr = sol.parseReceipt('A: $1.99\\nB: $2.99\\nC: $3.99')\nprint(round(r['total'],2))", expected: "8.97", isPublic: false },
  ],
},

"Block: Seller Dashboard Metrics": {
  company: "block", pattern: "Array / Statistics",
  title: "Compute Seller Metrics",
  difficulty: "Easy",
  desc: "Given a list of daily sales amounts for a seller, compute: 'mean' (average, rounded to 2dp), 'median', 'max_day' (index of max, 0-based), 'growth' (last - first). Return as a dict.",
  examples: [
    { input: "sales = [100, 200, 150, 300]", output: "{'mean': 187.5, 'median': 175.0, 'max_day': 3, 'growth': 200}" },
    { input: "sales = [50]", output: "{'mean': 50.0, 'median': 50.0, 'max_day': 0, 'growth': 0}" }
  ],
  constraints: ["1 <= sales.length <= 365", "0 <= sales[i] <= 10^6"],
  functionSignature: "def sellerMetrics(self, sales: List[int]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def sellerMetrics(self, sales: List[int]) -> dict:\n        pass",
    JavaScript: "var sellerMetrics = function(sales) {\n    \n};",
    TypeScript: "function sellerMetrics(sales: number[]): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String, Double> sellerMetrics(int[] sales) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> sellerMetrics(vector<int>& sales) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.sellerMetrics([100,200,150,300])\nprint(r['mean'])", expected: "187.5", isPublic: true },
    { script: "sol = Solution()\nr = sol.sellerMetrics([100,200,150,300])\nprint(r['median'])", expected: "175.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.sellerMetrics([100,200,150,300])\nprint(r['max_day'])", expected: "3", isPublic: false },
    { script: "sol = Solution()\nr = sol.sellerMetrics([50])\nprint(r['growth'])", expected: "0", isPublic: false },
    { script: "sol = Solution()\nr = sol.sellerMetrics([10,20,30])\nprint(r['median'])", expected: "20.0", isPublic: false },
  ],
},

"Block: Tip Distribution Algorithm": {
  company: "block", pattern: "Math / Greedy",
  title: "Fair Tip Distribution",
  difficulty: "Easy",
  desc: "Given a tip amount and a list of workers with hours worked, distribute the tip proportionally to hours (floor each worker's share, give remainder cents to workers with most hours, breaking ties by index). Return list of tip amounts per worker (in cents to avoid floats).",
  examples: [
    { input: "tipCents=10, hours=[1,1,1]", output: "[4, 3, 3]", explanation: "10/3=3 each, 1 remainder to first worker" },
    { input: "tipCents=100, hours=[2,3,5]", output: "[20, 30, 50]" }
  ],
  constraints: ["1 <= workers <= 20", "1 <= hours[i] <= 40", "0 <= tipCents <= 10^6"],
  functionSignature: "def distributeTip(self, tipCents: int, hours: List[int]) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def distributeTip(self, tipCents: int, hours: List[int]) -> List[int]:\n        pass",
    JavaScript: "var distributeTip = function(tipCents, hours) {\n    \n};",
    TypeScript: "function distributeTip(tipCents: number, hours: number[]): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] distributeTip(int tipCents, int[] hours) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> distributeTip(int tipCents, vector<int>& hours) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.distributeTip(10, [1,1,1]))", expected: "[4, 3, 3]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.distributeTip(100, [2,3,5]))", expected: "[20, 30, 50]", isPublic: true },
    { script: "sol = Solution()\nprint(sum(sol.distributeTip(99, [1,2,3])))", expected: "99", isPublic: false },
    { script: "sol = Solution()\nprint(sol.distributeTip(0, [1,2]))", expected: "[0, 0]", isPublic: false },
    { script: "sol = Solution()\nresult = sol.distributeTip(7, [3,3,4])\nprint(sum(result))", expected: "7", isPublic: false },
  ],
},

"Block: QR Code Data Encoding": {
  company: "block", pattern: "Bit Manipulation / Encoding",
  title: "Encode Payment QR Data",
  difficulty: "Easy",
  desc: "Given a dict with 'amount' (integer cents), 'currency' (3-char string), 'merchant' (string up to 20 chars), encode it as a pipe-separated string 'amount|currency|merchant'. Then decode a given string back to a dict. Implement encode(data) and decode(s).",
  examples: [
    { input: "data = {'amount': 1050, 'currency': 'USD', 'merchant': 'CoffeeCo'}", output: '"1050|USD|CoffeeCo"' },
    { input: 's = "2000|EUR|BakeryPlus"', output: "{'amount':2000,'currency':'EUR','merchant':'BakeryPlus'}" }
  ],
  constraints: ["amount >= 0", "currency is exactly 3 uppercase letters", "merchant has no | characters"],
  functionSignature: "def encode(self, data: dict) -> str:",
  starters: {
    Python: "class Solution:\n    def encode(self, data: dict) -> str:\n        pass\n\n    def decode(self, s: str) -> dict:\n        pass",
    JavaScript: "class Solution {\n    encode(data) { return ''; }\n    decode(s) { return {}; }\n}",
    TypeScript: "class Solution {\n    encode(data: Record<string,any>): string { return ''; }\n    decode(s: string): Record<string,any> { return {}; }\n}",
    Java: "class Solution {\n    public String encode(Map<String,Object> data) { return \"\"; }\n    public Map<String,Object> decode(String s) { return new HashMap<>(); }\n}",
    "C++": "class Solution {\npublic:\n    string encode(map<string,string> data) { return \"\"; }\n    map<string,string> decode(string s) { return {}; }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.encode({'amount':1050,'currency':'USD','merchant':'CoffeeCo'}))", expected: "1050|USD|CoffeeCo", isPublic: true },
    { script: "sol = Solution()\nprint(sol.decode('2000|EUR|BakeryPlus')['amount'])", expected: "2000", isPublic: true },
    { script: "sol = Solution()\nd = {'amount':0,'currency':'JPY','merchant':'M'}\nprint(sol.decode(sol.encode(d))['currency'])", expected: "JPY", isPublic: false },
    { script: "sol = Solution()\nprint(sol.decode('500|GBP|ShopName')['merchant'])", expected: "ShopName", isPublic: false },
    { script: "sol = Solution()\nd = {'amount':9999,'currency':'AUD','merchant':'Test Store'}\nprint(sol.encode(d))", expected: "9999|AUD|Test Store", isPublic: false },
  ],
},

"Block: Tidal Wave Fraud Score": {
  company: "block", pattern: "Weighted Scoring / Rule Engine",
  title: "Transaction Fraud Scoring",
  difficulty: "Medium",
  desc: "Given transaction features dict (amount, isInternational, isNewDevice, hourOfDay) and scoring rules: amount > 500 adds 30 pts, isInternational adds 25 pts, isNewDevice adds 20 pts, hourOfDay outside 6-22 adds 15 pts. Score >= 50 is fraud. Return dict with 'score' and 'isFraud'.",
  examples: [
    { input: "txn = {'amount':600,'isInternational':True,'isNewDevice':False,'hourOfDay':14}", output: "{'score':55,'isFraud':True}" },
    { input: "txn = {'amount':100,'isInternational':False,'isNewDevice':False,'hourOfDay':10}", output: "{'score':0,'isFraud':False}" }
  ],
  constraints: ["0 <= amount <= 10^6", "0 <= hourOfDay <= 23"],
  functionSignature: "def fraudScore(self, txn: dict) -> dict:",
  starters: {
    Python: "class Solution:\n    def fraudScore(self, txn: dict) -> dict:\n        pass",
    JavaScript: "var fraudScore = function(txn) {\n    \n};",
    TypeScript: "function fraudScore(txn: Record<string, any>): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String, Object> fraudScore(Map<String, Object> txn) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,int> fraudScore(map<string,int>& txn) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.fraudScore({'amount':600,'isInternational':True,'isNewDevice':False,'hourOfDay':14})['score'])", expected: "55", isPublic: true },
    { script: "sol = Solution()\nprint(sol.fraudScore({'amount':100,'isInternational':False,'isNewDevice':False,'hourOfDay':10})['isFraud'])", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.fraudScore({'amount':200,'isInternational':True,'isNewDevice':True,'hourOfDay':3})['isFraud'])", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.fraudScore({'amount':200,'isInternational':True,'isNewDevice':True,'hourOfDay':3})['score'])", expected: "60", isPublic: false },
    { script: "sol = Solution()\nprint(sol.fraudScore({'amount':600,'isInternational':False,'isNewDevice':False,'hourOfDay':23})['score'])", expected: "45", isPublic: false },
  ],
},

"Block: Merchant Category Rollup": {
  company: "block", pattern: "Tree / Recursion",
  title: "Category Revenue Rollup",
  difficulty: "Medium",
  desc: "Given a category tree (parent-child relations) and leaf-level revenues, compute total revenue for each category including all descendants. Return dict of category -> total revenue. Category '-' means root.",
  examples: [
    { input: "edges=[['root','food'],['root','tech'],['food','bakery']], revenues={'bakery':100,'tech':200}", output: "{'bakery':100,'food':100,'tech':200,'root':300}" },
    { input: "edges=[], revenues={'a':50}", output: "{'a':50}" }
  ],
  constraints: ["Tree has at most 1000 nodes", "revenues only at leaf nodes"],
  functionSignature: "def rollupRevenue(self, edges: List[List[str]], revenues: dict) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def rollupRevenue(self, edges: List[List[str]], revenues: dict) -> dict:\n        pass",
    JavaScript: "var rollupRevenue = function(edges, revenues) {\n    \n};",
    TypeScript: "function rollupRevenue(edges: string[][], revenues: Record<string,number>): Record<string,number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Integer> rollupRevenue(List<List<String>> edges, Map<String,Integer> revenues) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,int> rollupRevenue(vector<pair<string,string>>& edges, map<string,int>& revenues) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.rollupRevenue([['root','food'],['root','tech'],['food','bakery']],{'bakery':100,'tech':200})\nprint(r['root'])", expected: "300", isPublic: true },
    { script: "sol = Solution()\nr = sol.rollupRevenue([],{'a':50})\nprint(r['a'])", expected: "50", isPublic: true },
    { script: "sol = Solution()\nr = sol.rollupRevenue([['A','B'],['A','C']],{'B':10,'C':20})\nprint(r['A'])", expected: "30", isPublic: false },
    { script: "sol = Solution()\nr = sol.rollupRevenue([['A','B'],['B','C']],{'C':100})\nprint(r['A'])", expected: "100", isPublic: false },
    { script: "sol = Solution()\nr = sol.rollupRevenue([['r','x'],['r','y'],['x','a'],['x','b']],{'a':5,'b':10,'y':20})\nprint(r['r'])", expected: "35", isPublic: false },
  ],
},

"Block: Wallet Balance Reconciliation": {
  company: "block", pattern: "Hash Map / Running Sum",
  title: "Wallet Balance Tracker",
  difficulty: "Easy",
  desc: "Given a list of transactions [userId, type, amount] where type is 'credit' or 'debit', compute final balance per user. Debit cannot exceed balance (skip if it would go negative). Return dict of userId -> balance.",
  examples: [
    { input: "txns=[['u1','credit',100],['u1','debit',30],['u1','debit',80]]", output: "{'u1':70}" },
    { input: "txns=[['a','credit',50],['b','credit',20],['a','debit',10]]", output: "{'a':40,'b':20}" }
  ],
  constraints: ["1 <= txns.length <= 10^4", "amount > 0", "Initial balance = 0"],
  functionSignature: "def walletBalances(self, txns: List[List]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def walletBalances(self, txns: List[List]) -> dict:\n        pass",
    JavaScript: "var walletBalances = function(txns) {\n    \n};",
    TypeScript: "function walletBalances(txns: any[][]): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Integer> walletBalances(List<List<Object>> txns) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,int> walletBalances(vector<tuple<string,string,int>>& txns) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.walletBalances([['u1','credit',100],['u1','debit',30],['u1','debit',80]]))", expected: "{'u1': 70}", isPublic: true },
    { script: "sol = Solution()\nprint(sol.walletBalances([['a','credit',50],['b','credit',20],['a','debit',10]])['a'])", expected: "40", isPublic: true },
    { script: "sol = Solution()\nprint(sol.walletBalances([['u1','debit',100]]))", expected: "{'u1': 0}", isPublic: false },
    { script: "sol = Solution()\nprint(sol.walletBalances([['u1','credit',10],['u1','debit',10],['u1','debit',1]]))", expected: "{'u1': 0}", isPublic: false },
    { script: "sol = Solution()\nr = sol.walletBalances([['a','credit',100],['a','credit',50],['a','debit',200]])\nprint(r['a'])", expected: "150", isPublic: false },
  ],
},

"Block: Afterpay Installment Scheduler": {
  company: "block", pattern: "Math / Date",
  title: "BNPL Installment Schedule",
  difficulty: "Easy",
  desc: "Given a purchase amount, number of installments `n`, and first payment due day, generate the payment schedule. Each installment is amount/n (distribute remainder cents to first installment). Return list of [installment_number, amount_cents] pairs.",
  examples: [
    { input: "amountCents=100, n=4", output: "[[1,25],[2,25],[3,25],[4,25]]" },
    { input: "amountCents=101, n=4", output: "[[1,26],[2,25],[3,25],[4,25]]" }
  ],
  constraints: ["1 <= amountCents <= 10^6", "1 <= n <= 12"],
  functionSignature: "def installmentSchedule(self, amountCents: int, n: int) -> List[List[int]]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def installmentSchedule(self, amountCents: int, n: int) -> List[List[int]]:\n        pass",
    JavaScript: "var installmentSchedule = function(amountCents, n) {\n    \n};",
    TypeScript: "function installmentSchedule(amountCents: number, n: number): number[][] {\n    \n};",
    Java: "class Solution {\n    public int[][] installmentSchedule(int amountCents, int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<int>> installmentSchedule(int amountCents, int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.installmentSchedule(100, 4))", expected: "[[1, 25], [2, 25], [3, 25], [4, 25]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.installmentSchedule(101, 4))", expected: "[[1, 26], [2, 25], [3, 25], [4, 25]]", isPublic: true },
    { script: "sol = Solution()\nprint(sum(x[1] for x in sol.installmentSchedule(99, 4)))", expected: "99", isPublic: false },
    { script: "sol = Solution()\nprint(sol.installmentSchedule(10, 3))", expected: "[[1, 4], [2, 3], [3, 3]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.installmentSchedule(1000, 4)[0][1])", expected: "250", isPublic: false },
  ],
},

// =============================================================================
// PAYPAL (15 problems)
// =============================================================================

"PayPal: Buyer Protection Claim Scorer": {
  company: "paypal", pattern: "Rule Engine / Scoring",
  title: "Buyer Protection Eligibility Score",
  difficulty: "Easy",
  desc: "Score a buyer protection claim based on: +30 if transaction is digital goods, +25 if seller has < 10 disputes, +20 if buyer account age > 90 days, +15 if transaction < 14 days ago. Return score and verdict: score >= 60 -> 'approve', 40-59 -> 'review', < 40 -> 'deny'.",
  examples: [
    { input: "isDigital=True, sellerDisputes=5, buyerAgeDays=100, transactionAgeDays=7", output: "{'score':90,'verdict':'approve'}" },
    { input: "isDigital=False, sellerDisputes=15, buyerAgeDays=30, transactionAgeDays=20", output: "{'score':0,'verdict':'deny'}" }
  ],
  constraints: ["All inputs are non-negative integers or booleans"],
  functionSignature: "def scoreCliam(self, isDigital: bool, sellerDisputes: int, buyerAgeDays: int, transactionAgeDays: int) -> dict:",
  starters: {
    Python: "class Solution:\n    def scoreClaim(self, isDigital: bool, sellerDisputes: int, buyerAgeDays: int, transactionAgeDays: int) -> dict:\n        pass",
    JavaScript: "var scoreClaim = function(isDigital, sellerDisputes, buyerAgeDays, transactionAgeDays) {\n    \n};",
    TypeScript: "function scoreClaim(isDigital: boolean, sellerDisputes: number, buyerAgeDays: number, transactionAgeDays: number): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> scoreClaim(boolean isDigital, int sellerDisputes, int buyerAgeDays, int transactionAgeDays) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,int> scoreClaim(bool isDig, int sd, int ba, int ta) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.scoreClaim(True,5,100,7)['verdict'])", expected: "approve", isPublic: true },
    { script: "sol = Solution()\nprint(sol.scoreClaim(False,15,30,20)['score'])", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.scoreClaim(True,15,100,7)['score'])", expected: "65", isPublic: false },
    { script: "sol = Solution()\nprint(sol.scoreClaim(False,5,100,7)['verdict'])", expected: "approve", isPublic: false },
    { script: "sol = Solution()\nprint(sol.scoreClaim(False,5,30,7)['verdict'])", expected: "review", isPublic: false },
  ],
},

"PayPal: Currency Rounding Rules": {
  company: "paypal", pattern: "Math / Precision",
  title: "Apply Currency Rounding",
  difficulty: "Easy",
  desc: "Given an amount in minor units (e.g. cents) and a currency code, return the formatted amount string. Currencies: 'USD','EUR','GBP' -> 2 decimal places; 'JPY','KRW' -> 0 decimal places; 'KWD','BHD' -> 3 decimal places. Convert from minor units to major: divide by 10^(decimal places).",
  examples: [
    { input: "minorAmount=10050, currency='USD'", output: '"100.50"' },
    { input: "minorAmount=1000, currency='JPY'", output: '"1000"' },
    { input: "minorAmount=10050, currency='KWD'", output: '"10.050"' }
  ],
  constraints: ["minorAmount >= 0", "currency in [USD,EUR,GBP,JPY,KRW,KWD,BHD]"],
  functionSignature: "def formatAmount(self, minorAmount: int, currency: str) -> str:",
  starters: {
    Python: "class Solution:\n    def formatAmount(self, minorAmount: int, currency: str) -> str:\n        pass",
    JavaScript: "var formatAmount = function(minorAmount, currency) {\n    \n};",
    TypeScript: "function formatAmount(minorAmount: number, currency: string): string {\n    \n};",
    Java: "class Solution {\n    public String formatAmount(int minorAmount, String currency) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    string formatAmount(int amt, string currency) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.formatAmount(10050, 'USD'))", expected: "100.50", isPublic: true },
    { script: "sol = Solution()\nprint(sol.formatAmount(1000, 'JPY'))", expected: "1000", isPublic: true },
    { script: "sol = Solution()\nprint(sol.formatAmount(10050, 'KWD'))", expected: "10.050", isPublic: false },
    { script: "sol = Solution()\nprint(sol.formatAmount(0, 'EUR'))", expected: "0.00", isPublic: false },
    { script: "sol = Solution()\nprint(sol.formatAmount(99, 'GBP'))", expected: "0.99", isPublic: false },
  ],
},

"PayPal: Smart Payment Button Routing": {
  company: "paypal", pattern: "Greedy / Priority Queue",
  title: "Optimal Payment Method Selection",
  difficulty: "Medium",
  desc: "Given available payment methods with fee rates and limits [name, feePercent, maxAmount], and a payment amount, select the cheapest valid method (lowest fee for given amount). If tie, pick alphabetically first. Return method name and fee amount (rounded to 2dp). Return 'NONE' if no method can handle the amount.",
  examples: [
    { input: "methods=[['card',2.9,10000],['bank',0.8,5000]], amount=3000", output: "['bank', 24.0]" },
    { input: "methods=[['card',2.9,1000]], amount=2000", output: "['NONE', 0]" }
  ],
  constraints: ["1 <= methods.length <= 50", "0 < amount <= 10^6", "0 < feePercent <= 10"],
  functionSignature: "def bestPaymentMethod(self, methods: List[List], amount: float) -> List:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def bestPaymentMethod(self, methods: List[List], amount: float) -> List:\n        pass",
    JavaScript: "var bestPaymentMethod = function(methods, amount) {\n    \n};",
    TypeScript: "function bestPaymentMethod(methods: any[][], amount: number): any[] {\n    \n};",
    Java: "class Solution {\n    public List<Object> bestPaymentMethod(List<List<Object>> methods, double amount) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    pair<string,double> bestPaymentMethod(vector<tuple<string,double,double>>& m, double amount) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.bestPaymentMethod([['card',2.9,10000],['bank',0.8,5000]], 3000)\nprint(result[0])", expected: "bank", isPublic: true },
    { script: "sol = Solution()\nprint(sol.bestPaymentMethod([['card',2.9,1000]], 2000)[0])", expected: "NONE", isPublic: true },
    { script: "sol = Solution()\nresult = sol.bestPaymentMethod([['card',2.9,10000],['bank',0.8,5000]], 3000)\nprint(result[1])", expected: "24.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.bestPaymentMethod([['a',1.0,100],['b',1.0,100]], 50)\nprint(result[0])", expected: "a", isPublic: false },
    { script: "sol = Solution()\nresult = sol.bestPaymentMethod([['paypal',2.9,10000],['venmo',1.9,500]], 1000)\nprint(result[0])", expected: "paypal", isPublic: false },
  ],
},

"PayPal: One Touch Login Token Validator": {
  company: "paypal", pattern: "String / Crypto Simulation",
  title: "One-Time Login Token Validator",
  difficulty: "Easy",
  desc: "Implement a one-time token system. generateToken(userId, timestamp) creates a token = str(hash(userId + str(timestamp)) % 1000000).zfill(6). validateToken(userId, token, currentTime, validitySeconds) returns True if token matches and currentTime - timestamp <= validitySeconds. Tokens can only be used once.",
  examples: [
    { input: "userId='user1', timestamp=1000, token=generateToken('user1',1000), current=1030, validity=60", output: "True" },
    { input: "validate same token twice", output: "True, False" }
  ],
  constraints: ["userId is non-empty string", "timestamp >= 0", "validitySeconds >= 0"],
  functionSignature: "def generateToken(self, userId: str, timestamp: int) -> str:",
  starters: {
    Python: "class OneTimeTokenSystem:\n    def __init__(self):\n        self.used = set()\n        self.tokens = {}\n\n    def generateToken(self, userId: str, timestamp: int) -> str:\n        pass\n\n    def validateToken(self, userId: str, token: str, currentTime: int, validitySeconds: int) -> bool:\n        pass",
    JavaScript: "class OneTimeTokenSystem {\n    constructor() { this.used = new Set(); this.tokens = {}; }\n    generateToken(userId, timestamp) { return ''; }\n    validateToken(userId, token, currentTime, validitySeconds) { return false; }\n}",
    TypeScript: "class OneTimeTokenSystem {\n    private used = new Set<string>();\n    private tokens: Record<string,number> = {};\n    generateToken(userId: string, timestamp: number): string { return ''; }\n    validateToken(userId: string, token: string, currentTime: number, validitySeconds: number): boolean { return false; }\n}",
    Java: "class OneTimeTokenSystem {\n    public String generateToken(String userId, int ts) { return \"\"; }\n    public boolean validateToken(String userId, String token, int now, int validity) { return false; }\n}",
    "C++": "class OneTimeTokenSystem {\npublic:\n    string generateToken(string userId, int ts) { return \"\"; }\n    bool validateToken(string userId, string token, int now, int validity) { return false; }\n};",
  },
  testCases: [
    { script: "sys = OneTimeTokenSystem()\ntoken = sys.generateToken('u1', 1000)\nprint(sys.validateToken('u1', token, 1030, 60))", expected: "True", isPublic: true },
    { script: "sys = OneTimeTokenSystem()\ntoken = sys.generateToken('u1', 1000)\nsys.validateToken('u1', token, 1030, 60)\nprint(sys.validateToken('u1', token, 1031, 60))", expected: "False", isPublic: true },
    { script: "sys = OneTimeTokenSystem()\ntoken = sys.generateToken('u1', 1000)\nprint(sys.validateToken('u1', token, 1070, 60))", expected: "False", isPublic: false },
    { script: "sys = OneTimeTokenSystem()\ntoken = sys.generateToken('u1', 1000)\nprint(sys.validateToken('u2', token, 1010, 60))", expected: "False", isPublic: false },
    { script: "sys = OneTimeTokenSystem()\nprint(len(sys.generateToken('x', 0)))", expected: "6", isPublic: false },
  ],
},

"PayPal: Chargeback Risk Assessment": {
  company: "paypal", pattern: "Statistics / Sliding Window",
  title: "Merchant Chargeback Rate Monitor",
  difficulty: "Medium",
  desc: "Given a list of merchant transactions [merchantId, isChargeback, timestamp] and a window size in days, compute each merchant's chargeback rate (chargebacks/total) within the most recent window. Flag merchants with rate > threshold. Return list of flagged merchant ids.",
  examples: [
    { input: "txns=[['m1',False,1],['m1',True,2],['m1',True,3]], windowDays=30, threshold=0.5", output: "['m1']" },
    { input: "txns=[['m1',False,1],['m1',False,2]], windowDays=30, threshold=0.5", output: "[]" }
  ],
  constraints: ["1 <= txns.length <= 10^4", "0 < threshold <= 1", "windowDays >= 1"],
  functionSignature: "def flaggedMerchants(self, txns: List[List], windowDays: int, threshold: float) -> List[str]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def flaggedMerchants(self, txns: List[List], windowDays: int, threshold: float) -> List[str]:\n        pass",
    JavaScript: "var flaggedMerchants = function(txns, windowDays, threshold) {\n    \n};",
    TypeScript: "function flaggedMerchants(txns: any[][], windowDays: number, threshold: number): string[] {\n    \n};",
    Java: "class Solution {\n    public List<String> flaggedMerchants(List<List<Object>> txns, int windowDays, double threshold) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<string> flaggedMerchants(vector<tuple<string,bool,int>>& t, int w, double thr) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.flaggedMerchants([['m1',False,1],['m1',True,2],['m1',True,3]],30,0.5))", expected: "['m1']", isPublic: true },
    { script: "sol = Solution()\nprint(sol.flaggedMerchants([['m1',False,1],['m1',False,2]],30,0.5))", expected: "[]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.flaggedMerchants([['m1',True,1],['m2',False,1]],30,0.5))", expected: "['m1']", isPublic: false },
    { script: "sol = Solution()\nresult = sol.flaggedMerchants([['m1',True,100],['m1',False,1]],10,0.5)\nprint(result)", expected: "['m1']", isPublic: false },
    { script: "sol = Solution()\nprint(sol.flaggedMerchants([],30,0.5))", expected: "[]", isPublic: false },
  ],
},

"PayPal: Split Payment Calculator": {
  company: "paypal", pattern: "Math / Array",
  title: "Split Payment Among Friends",
  difficulty: "Easy",
  desc: "Given total amount, list of participants and their custom split ratios (if empty list, split equally), compute each person's share in cents. Distribute remainder to first participant. Return dict of name -> cents.",
  examples: [
    { input: "total=100, participants=['A','B','C'], ratios=[]", output: "{'A':34,'B':33,'C':33}" },
    { input: "total=100, participants=['A','B'], ratios=[3,1]", output: "{'A':75,'B':25}" }
  ],
  constraints: ["1 <= participants.length <= 20", "total >= 0", "ratios sum > 0 or empty"],
  functionSignature: "def splitPayment(self, total: int, participants: List[str], ratios: List[int]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def splitPayment(self, total: int, participants: List[str], ratios: List[int]) -> dict:\n        pass",
    JavaScript: "var splitPayment = function(total, participants, ratios) {\n    \n};",
    TypeScript: "function splitPayment(total: number, participants: string[], ratios: number[]): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Integer> splitPayment(int total, String[] participants, int[] ratios) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,int> splitPayment(int total, vector<string>& p, vector<int>& r) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.splitPayment(100,['A','B','C'],[]))", expected: "{'A': 34, 'B': 33, 'C': 33}", isPublic: true },
    { script: "sol = Solution()\nprint(sol.splitPayment(100,['A','B'],[3,1]))", expected: "{'A': 75, 'B': 25}", isPublic: true },
    { script: "sol = Solution()\nprint(sum(sol.splitPayment(99,['A','B','C'],[]).values()))", expected: "99", isPublic: false },
    { script: "sol = Solution()\nprint(sol.splitPayment(0,['A','B'],[]))", expected: "{'A': 0, 'B': 0}", isPublic: false },
    { script: "sol = Solution()\nprint(sol.splitPayment(10,['X'],[]))", expected: "{'X': 10}", isPublic: false },
  ],
},

"PayPal: Subscription Renewal Forecast": {
  company: "paypal", pattern: "Date Math / Simulation",
  title: "Subscription Renewal Date Generator",
  difficulty: "Easy",
  desc: "Given a subscription start date (YYYY-MM-DD string), billing cycle ('monthly' or 'annual'), and number of renewals to forecast, return list of renewal dates as strings. For monthly: add 1 month each time. For annual: add 1 year. If day doesn't exist in month, use last day of month.",
  examples: [
    { input: "start='2024-01-31', cycle='monthly', count=3", output: "['2024-02-29','2024-03-31','2024-04-30']" },
    { input: "start='2024-01-15', cycle='annual', count=2", output: "['2025-01-15','2026-01-15']" }
  ],
  constraints: ["valid date string", "count >= 1", "cycle is 'monthly' or 'annual'"],
  functionSignature: "def renewalDates(self, start: str, cycle: str, count: int) -> List[str]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def renewalDates(self, start: str, cycle: str, count: int) -> List[str]:\n        pass",
    JavaScript: "var renewalDates = function(start, cycle, count) {\n    \n};",
    TypeScript: "function renewalDates(start: string, cycle: string, count: number): string[] {\n    \n};",
    Java: "class Solution {\n    public List<String> renewalDates(String start, String cycle, int count) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<string> renewalDates(string start, string cycle, int count) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.renewalDates('2024-01-15','annual',2))", expected: "['2025-01-15', '2026-01-15']", isPublic: true },
    { script: "sol = Solution()\nprint(sol.renewalDates('2024-01-31','monthly',3))", expected: "['2024-02-29', '2024-03-31', '2024-04-30']", isPublic: true },
    { script: "sol = Solution()\nprint(len(sol.renewalDates('2024-06-01','monthly',12)))", expected: "12", isPublic: false },
    { script: "sol = Solution()\nprint(sol.renewalDates('2023-02-28','monthly',1))", expected: "['2023-03-28']", isPublic: false },
    { script: "sol = Solution()\nprint(sol.renewalDates('2024-03-31','monthly',2))", expected: "['2024-04-30', '2024-05-31']", isPublic: false },
  ],
},

"PayPal: Two-Factor Auth Code Generator": {
  company: "paypal", pattern: "Math / String",
  title: "TOTP-like OTP Generator",
  difficulty: "Easy",
  desc: "Implement a simple time-based OTP: otp = str((seed * timestamp // interval) % 1000000).zfill(6) where interval=30. verifyOtp(seed, otp, timestamp, drift) checks current window and ±drift windows. Return True if valid.",
  examples: [
    { input: "seed=12345, timestamp=90, drift=1", output: "True (for the generated OTP)" },
    { input: "seed=12345, otp='000000', timestamp=90, drift=0", output: "likely False" }
  ],
  constraints: ["seed > 0", "drift >= 0", "timestamp >= 0"],
  functionSignature: "def generateOtp(self, seed: int, timestamp: int) -> str:",
  starters: {
    Python: "class OTPSystem:\n    INTERVAL = 30\n\n    def generateOtp(self, seed: int, timestamp: int) -> str:\n        pass\n\n    def verifyOtp(self, seed: int, otp: str, timestamp: int, drift: int = 1) -> bool:\n        pass",
    JavaScript: "class OTPSystem {\n    generateOtp(seed, timestamp) { return ''; }\n    verifyOtp(seed, otp, timestamp, drift = 1) { return false; }\n}",
    TypeScript: "class OTPSystem {\n    generateOtp(seed: number, timestamp: number): string { return ''; }\n    verifyOtp(seed: number, otp: string, timestamp: number, drift: number = 1): boolean { return false; }\n}",
    Java: "class OTPSystem {\n    public String generateOtp(int seed, int timestamp) { return \"\"; }\n    public boolean verifyOtp(int seed, String otp, int timestamp, int drift) { return false; }\n}",
    "C++": "class OTPSystem {\npublic:\n    string generateOtp(int seed, int ts) { return \"\"; }\n    bool verifyOtp(int seed, string otp, int ts, int drift) { return false; }\n};",
  },
  testCases: [
    { script: "s = OTPSystem()\notp = s.generateOtp(12345, 90)\nprint(len(otp))", expected: "6", isPublic: true },
    { script: "s = OTPSystem()\notp = s.generateOtp(12345, 90)\nprint(s.verifyOtp(12345, otp, 90, 1))", expected: "True", isPublic: true },
    { script: "s = OTPSystem()\notp = s.generateOtp(12345, 90)\nprint(s.verifyOtp(12345, otp, 90+30, 1))", expected: "True", isPublic: false },
    { script: "s = OTPSystem()\notp = s.generateOtp(12345, 90)\nprint(s.verifyOtp(99999, otp, 90, 0))", expected: "False", isPublic: false },
    { script: "s = OTPSystem()\nprint(s.verifyOtp(12345, '000000', 90, 0))", expected: "False", isPublic: false },
  ],
},

// =============================================================================
// PLAID (15 problems)
// =============================================================================

"Plaid: Bank Account Categorization": {
  company: "plaid", pattern: "String Matching / Classification",
  title: "Transaction Category Classifier",
  difficulty: "Easy",
  desc: "Classify transactions based on merchant name keywords. Rules: if name contains any of ['uber','lyft','taxi'] -> 'Transport'; ['amazon','walmart','target'] -> 'Shopping'; ['netflix','spotify','hulu'] -> 'Entertainment'; ['starbucks','mcdonalds','subway'] -> 'Food'; else -> 'Other'. Return list of categories (case-insensitive matching).",
  examples: [
    { input: "merchants=['Uber Eats','Amazon Prime','Random Store']", output: "['Transport','Shopping','Other']" },
    { input: "merchants=['STARBUCKS','Netflix']", output: "['Food','Entertainment']" }
  ],
  constraints: ["1 <= merchants.length <= 1000"],
  functionSignature: "def categorize(self, merchants: List[str]) -> List[str]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def categorize(self, merchants: List[str]) -> List[str]:\n        pass",
    JavaScript: "var categorize = function(merchants) {\n    \n};",
    TypeScript: "function categorize(merchants: string[]): string[] {\n    \n};",
    Java: "class Solution {\n    public List<String> categorize(String[] merchants) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<string> categorize(vector<string>& merchants) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.categorize(['Uber Eats','Amazon Prime','Random Store']))", expected: "['Transport', 'Shopping', 'Other']", isPublic: true },
    { script: "sol = Solution()\nprint(sol.categorize(['STARBUCKS','Netflix']))", expected: "['Food', 'Entertainment']", isPublic: true },
    { script: "sol = Solution()\nprint(sol.categorize(['Lyft']))", expected: "['Transport']", isPublic: false },
    { script: "sol = Solution()\nprint(sol.categorize(['Unknown Corp']))", expected: "['Other']", isPublic: false },
    { script: "sol = Solution()\nprint(sol.categorize(['SPOTIFY Premium','McDONALDS','Target Stores']))", expected: "['Entertainment', 'Food', 'Shopping']", isPublic: false },
  ],
},

"Plaid: Account Balance Aggregator": {
  company: "plaid", pattern: "Hash Map / Aggregation",
  title: "Multi-Account Balance Summary",
  difficulty: "Easy",
  desc: "Given a list of accounts [accountId, type, balance, currency], aggregate: total by type, total by currency, and overall total (assume all same currency if currencies differ, just sum). Return dict with 'byType', 'byCurrency', 'total'.",
  examples: [
    { input: "accounts=[['a1','checking',500,'USD'],['a2','savings',1000,'USD'],['a3','checking',200,'USD']]", output: "{'byType':{'checking':700,'savings':1000},'byCurrency':{'USD':1700},'total':1700}" }
  ],
  constraints: ["1 <= accounts.length <= 1000", "balance >= 0"],
  functionSignature: "def aggregateBalances(self, accounts: List[List]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def aggregateBalances(self, accounts: List[List]) -> dict:\n        pass",
    JavaScript: "var aggregateBalances = function(accounts) {\n    \n};",
    TypeScript: "function aggregateBalances(accounts: any[][]): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> aggregateBalances(List<List<Object>> accounts) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> aggregateBalances(vector<tuple<string,string,double,string>>& accts) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.aggregateBalances([['a1','checking',500,'USD'],['a2','savings',1000,'USD'],['a3','checking',200,'USD']])\nprint(r['total'])", expected: "1700", isPublic: true },
    { script: "sol = Solution()\nr = sol.aggregateBalances([['a1','checking',500,'USD'],['a2','savings',1000,'USD'],['a3','checking',200,'USD']])\nprint(r['byType']['checking'])", expected: "700", isPublic: true },
    { script: "sol = Solution()\nr = sol.aggregateBalances([['a1','savings',300,'EUR']])\nprint(r['byCurrency']['EUR'])", expected: "300", isPublic: false },
    { script: "sol = Solution()\nr = sol.aggregateBalances([['a1','checking',0,'USD']])\nprint(r['total'])", expected: "0", isPublic: false },
    { script: "sol = Solution()\nr = sol.aggregateBalances([['a1','cd',100,'USD'],['a2','cd',200,'USD'],['a3','ira',50,'USD']])\nprint(r['byType']['cd'])", expected: "300", isPublic: false },
  ],
},

"Plaid: Income Verification Analyzer": {
  company: "plaid", pattern: "Statistical Analysis",
  title: "Recurring Income Detector",
  difficulty: "Medium",
  desc: "Given a list of transactions [amount, date_days, description], identify recurring income. A transaction is recurring income if: amount > 0, same description appears >= 3 times, and time gaps between occurrences are within ±7 days of average gap. Return list of recurring income descriptions.",
  examples: [
    { input: "txns=[[1000,1,'payroll'],[1000,31,'payroll'],[1000,61,'payroll'],[500,5,'random']]", output: "['payroll']" },
    { input: "txns=[[100,1,'a'],[100,50,'a'],[100,120,'a']]", output: "[]" }
  ],
  constraints: ["1 <= txns.length <= 1000", "amount > 0 for income transactions"],
  functionSignature: "def detectRecurringIncome(self, txns: List[List]) -> List[str]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def detectRecurringIncome(self, txns: List[List]) -> List[str]:\n        pass",
    JavaScript: "var detectRecurringIncome = function(txns) {\n    \n};",
    TypeScript: "function detectRecurringIncome(txns: any[][]): string[] {\n    \n};",
    Java: "class Solution {\n    public List<String> detectRecurringIncome(List<List<Object>> txns) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<string> detectRecurringIncome(vector<tuple<int,int,string>>& t) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.detectRecurringIncome([[1000,1,'payroll'],[1000,31,'payroll'],[1000,61,'payroll'],[500,5,'random']]))", expected: "['payroll']", isPublic: true },
    { script: "sol = Solution()\nprint(sol.detectRecurringIncome([[100,1,'a'],[100,50,'a'],[100,120,'a']]))", expected: "[]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.detectRecurringIncome([[500,1,'rent'],[500,31,'rent'],[500,60,'rent']]))", expected: "['rent']", isPublic: false },
    { script: "sol = Solution()\nprint(sol.detectRecurringIncome([[100,1,'x'],[100,15,'x']]))", expected: "[]", isPublic: false },
    { script: "sol = Solution()\nresult = sol.detectRecurringIncome([[200,1,'a'],[200,15,'a'],[200,29,'a'],[300,1,'b'],[300,31,'b'],[300,62,'b']])\nprint(sorted(result))", expected: "['a', 'b']", isPublic: false },
  ],
},

"Plaid: Spending Trend Analyzer": {
  company: "plaid", pattern: "Sliding Window / Aggregation",
  title: "Monthly Spending Trend",
  difficulty: "Medium",
  desc: "Given transactions [amount, month] (month 1-12), compute month-over-month percentage change in spending. Return list of changes (rounded to 1dp) starting from month 2. Positive means increase. If previous month has 0 spending, use 'inf'.",
  examples: [
    { input: "txns=[[100,1],[150,2],[120,3]]", output: "[50.0, -20.0]" },
    { input: "txns=[[0,1],[50,2]]", output: "['inf']" }
  ],
  constraints: ["1 <= txns.length <= 10^4", "month in 1..12"],
  functionSignature: "def spendingTrend(self, txns: List[List]) -> List:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def spendingTrend(self, txns: List[List]) -> List:\n        pass",
    JavaScript: "var spendingTrend = function(txns) {\n    \n};",
    TypeScript: "function spendingTrend(txns: any[][]): any[] {\n    \n};",
    Java: "class Solution {\n    public List<Object> spendingTrend(List<List<Object>> txns) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<double> spendingTrend(vector<pair<double,int>>& txns) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.spendingTrend([[100,1],[150,2],[120,3]]))", expected: "[50.0, -20.0]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.spendingTrend([[0,1],[50,2]]))", expected: "['inf']", isPublic: true },
    { script: "sol = Solution()\nprint(sol.spendingTrend([[100,1],[100,2]]))", expected: "[0.0]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.spendingTrend([[200,1],[100,2]]))", expected: "[-50.0]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.spendingTrend([[100,1]]))", expected: "[]", isPublic: false },
  ],
},

"Plaid: Account Ownership Verification": {
  company: "plaid", pattern: "String / Validation",
  title: "Bank Account Number Validator",
  difficulty: "Easy",
  desc: "Validate a bank account number string. Rules: must be 8-12 digits only, Luhn-like check: from right, double every second digit; if > 9, subtract 9; sum all digits; valid if sum % 10 == 0. Return True/False.",
  examples: [
    { input: 'account = "49927398716"', output: "True" },
    { input: 'account = "1234567812"', output: "False" }
  ],
  constraints: ["account is a string of digits", "length 8-12"],
  functionSignature: "def validateAccount(self, account: str) -> bool:",
  starters: {
    Python: "class Solution:\n    def validateAccount(self, account: str) -> bool:\n        pass",
    JavaScript: "var validateAccount = function(account) {\n    \n};",
    TypeScript: "function validateAccount(account: string): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean validateAccount(String account) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool validateAccount(string account) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.validateAccount('49927398716'))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.validateAccount('1234567812'))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.validateAccount('123'))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.validateAccount('4539148803436467'))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.validateAccount('79927398713'))", expected: "True", isPublic: false },
  ],
},

"Plaid: Recurring Subscription Detector": {
  company: "plaid", pattern: "Pattern Recognition / Hash Map",
  title: "Detect Recurring Subscriptions",
  difficulty: "Medium",
  desc: "Given transactions [merchant, amount, dayOfMonth], detect subscriptions: same merchant + same amount + dayOfMonth within ±3 days, appearing >= 2 months. Return list of [merchant, amount] pairs.",
  examples: [
    { input: "txns=[['Netflix',15,1],['Netflix',15,1],['Amazon',10,15]]", output: "[['Netflix', 15]]" },
    { input: "txns=[['Netflix',15,1]]", output: "[]" }
  ],
  constraints: ["1 <= txns.length <= 1000", "amount > 0"],
  functionSignature: "def detectSubscriptions(self, txns: List[List]) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def detectSubscriptions(self, txns: List[List]) -> List[List]:\n        pass",
    JavaScript: "var detectSubscriptions = function(txns) {\n    \n};",
    TypeScript: "function detectSubscriptions(txns: any[][]): any[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Object>> detectSubscriptions(List<List<Object>> txns) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<pair<string,double>> detectSubscriptions(vector<tuple<string,double,int>>& t) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.detectSubscriptions([['Netflix',15,1],['Netflix',15,1],['Amazon',10,15]]))", expected: "[['Netflix', 15]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.detectSubscriptions([['Netflix',15,1]]))", expected: "[]", isPublic: true },
    { script: "sol = Solution()\nresult = sol.detectSubscriptions([['Spotify',10,5],['Spotify',10,6],['Spotify',10,5]])\nprint(len(result))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.detectSubscriptions([['A',5,1],['A',10,1]]))", expected: "[]", isPublic: false },
    { script: "sol = Solution()\nresult = sol.detectSubscriptions([['X',20,15],['X',20,17],['X',20,15]])\nprint(result[0][0] if result else 'none')", expected: "X", isPublic: false },
  ],
},

"Plaid: Financial Health Score": {
  company: "plaid", pattern: "Scoring / Statistics",
  title: "Compute Financial Health Score",
  difficulty: "Medium",
  desc: "Given monthly income, monthly expenses, savings, debt: score = (savings/income*30) + ((income-expenses)/income*40) + max(0,(1-debt/income)*30), capped at 100, rounded to 1dp. Return score and grade: >=80->'A', >=60->'B', >=40->'C', else->'D'.",
  examples: [
    { input: "income=5000, expenses=3000, savings=1000, debt=2000", output: "{'score':52.0,'grade':'C'}" },
    { input: "income=10000, expenses=4000, savings=3000, debt=1000", output: "{'score':94.0,'grade':'A'}" }
  ],
  constraints: ["income > 0", "expenses, savings, debt >= 0"],
  functionSignature: "def healthScore(self, income: float, expenses: float, savings: float, debt: float) -> dict:",
  starters: {
    Python: "class Solution:\n    def healthScore(self, income: float, expenses: float, savings: float, debt: float) -> dict:\n        pass",
    JavaScript: "var healthScore = function(income, expenses, savings, debt) {\n    \n};",
    TypeScript: "function healthScore(income: number, expenses: number, savings: number, debt: number): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> healthScore(double income, double expenses, double savings, double debt) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> healthScore(double i, double e, double s, double d) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.healthScore(5000,3000,1000,2000)['grade'])", expected: "C", isPublic: true },
    { script: "sol = Solution()\nprint(sol.healthScore(10000,4000,3000,1000)['grade'])", expected: "A", isPublic: true },
    { script: "sol = Solution()\nprint(sol.healthScore(1000,1000,0,0)['score'])", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.healthScore(5000,2000,2000,0)['grade'])", expected: "A", isPublic: false },
    { script: "sol = Solution()\nprint(sol.healthScore(3000,2800,100,5000)['grade'])", expected: "D", isPublic: false },
  ],
},

"Plaid: Multi-bank Data Normalization": {
  company: "plaid", pattern: "String / Data Transformation",
  title: "Normalize Bank Transaction Formats",
  difficulty: "Easy",
  desc: "Different banks return transactions in different formats. Normalize all to standard format [date_iso, description_upper, amount_cents]. Bank A: [MM/DD/YYYY, desc, $X.XX]. Bank B: [YYYYMMDD, desc, X.XX debit/credit]. Bank C: [DD-Mon-YYYY, desc, (X.XX) for debit else X.XX]. Return normalized list.",
  examples: [
    { input: "bankA=[['01/15/2024','coffee','$3.50']]", output: "[['2024-01-15','COFFEE',350]]" },
    { input: "bankB=[['20240115','lunch','5.00 debit']]", output: "[['2024-01-15','LUNCH',-500]]" }
  ],
  constraints: ["All dates are valid", "amounts have 2 decimal places"],
  functionSignature: "def normalizeA(self, txns: List[List[str]]) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def normalizeA(self, txns: List[List[str]]) -> List[List]:\n        pass\n\n    def normalizeB(self, txns: List[List[str]]) -> List[List]:\n        pass",
    JavaScript: "class Solution {\n    normalizeA(txns) { return []; }\n    normalizeB(txns) { return []; }\n}",
    TypeScript: "class Solution {\n    normalizeA(txns: string[][]): any[][] { return []; }\n    normalizeB(txns: string[][]): any[][] { return []; }\n}",
    Java: "class Solution {\n    public List<List<Object>> normalizeA(List<List<String>> txns) { return new ArrayList<>(); }\n    public List<List<Object>> normalizeB(List<List<String>> txns) { return new ArrayList<>(); }\n}",
    "C++": "class Solution {\npublic:\n    vector<tuple<string,string,int>> normalizeA(vector<vector<string>>& txns) { return {}; }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.normalizeA([['01/15/2024','coffee','$3.50']]))", expected: "[['2024-01-15', 'COFFEE', 350]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.normalizeB([['20240115','lunch','5.00 debit']]))", expected: "[['2024-01-15', 'LUNCH', -500]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.normalizeA([['12/31/2023','dinner','$25.00']]))", expected: "[['2023-12-31', 'DINNER', 2500]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.normalizeB([['20240601','salary','3000.00 credit']]))", expected: "[['2024-06-01', 'SALARY', 300000]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.normalizeA([['06/01/2024','GAS','$50.99']])[0][2])", expected: "5099", isPublic: false },
  ],
},

// =============================================================================
// ROBINHOOD (15 problems)
// =============================================================================

"Robinhood: Stock Portfolio P&L Calculator": {
  company: "robinhood", pattern: "Array / Finance Math",
  title: "Portfolio Profit and Loss",
  difficulty: "Easy",
  desc: "Given a portfolio as list of [ticker, shares, avgCostBasis] and current prices dict, compute per-position and total P&L. Return dict with 'positions' (list of [ticker, unrealizedPnL, pnlPercent]) and 'totalPnL', 'totalValue'. Round to 2dp.",
  examples: [
    { input: "portfolio=[['AAPL',10,150.0],['GOOG',5,2000.0]], prices={'AAPL':180.0,'GOOG':1900.0}", output: "{'totalPnL':300.0,...}" }
  ],
  constraints: ["shares > 0", "prices exist for all tickers"],
  functionSignature: "def calculatePnL(self, portfolio: List[List], prices: dict) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def calculatePnL(self, portfolio: List[List], prices: dict) -> dict:\n        pass",
    JavaScript: "var calculatePnL = function(portfolio, prices) {\n    \n};",
    TypeScript: "function calculatePnL(portfolio: any[][], prices: Record<string, number>): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> calculatePnL(List<List<Object>> portfolio, Map<String,Double> prices) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> calculatePnL(vector<tuple<string,int,double>>& p, map<string,double>& prices) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.calculatePnL([['AAPL',10,150.0]],{'AAPL':180.0})\nprint(result['totalPnL'])", expected: "300.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.calculatePnL([['X',5,100.0]],{'X':80.0})\nprint(result['totalPnL'])", expected: "-100.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.calculatePnL([['A',1,100.0]],{'A':150.0})\nprint(result['positions'][0][2])", expected: "50.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.calculatePnL([['A',2,50.0],['B',3,100.0]],{'A':60.0,'B':90.0})\nprint(result['totalPnL'])", expected: "-10.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.calculatePnL([['X',10,10.0]],{'X':10.0})\nprint(result['totalPnL'])", expected: "0.0", isPublic: false },
  ],
},

"Robinhood: Options Chain Parser": {
  company: "robinhood", pattern: "String Parsing / Data Structures",
  title: "Parse Options Symbol",
  difficulty: "Easy",
  desc: "Parse an OCC options symbol string of format 'TICKER YYMMDD C/P STRIKE' (e.g. 'AAPL 240119 C 185'). Return dict with 'ticker', 'expiry' (YYYY-MM-DD), 'type' ('call' or 'put'), 'strike' (float). Handle any valid symbol.",
  examples: [
    { input: '"AAPL 240119 C 185"', output: "{'ticker':'AAPL','expiry':'2024-01-19','type':'call','strike':185.0}" },
    { input: '"TSLA 241220 P 250"', output: "{'ticker':'TSLA','expiry':'2024-12-20','type':'put','strike':250.0}" }
  ],
  constraints: ["Symbol is well-formed"],
  functionSignature: "def parseOption(self, symbol: str) -> dict:",
  starters: {
    Python: "class Solution:\n    def parseOption(self, symbol: str) -> dict:\n        pass",
    JavaScript: "var parseOption = function(symbol) {\n    \n};",
    TypeScript: "function parseOption(symbol: string): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> parseOption(String symbol) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,string> parseOption(string symbol) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.parseOption('AAPL 240119 C 185')['type'])", expected: "call", isPublic: true },
    { script: "sol = Solution()\nprint(sol.parseOption('TSLA 241220 P 250')['expiry'])", expected: "2024-12-20", isPublic: true },
    { script: "sol = Solution()\nprint(sol.parseOption('GOOG 240315 C 140')['ticker'])", expected: "GOOG", isPublic: false },
    { script: "sol = Solution()\nprint(sol.parseOption('AMZN 241231 P 180')['strike'])", expected: "180.0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.parseOption('SPY 240620 C 500')['expiry'])", expected: "2024-06-20", isPublic: false },
  ],
},

"Robinhood: Price Alert System": {
  company: "robinhood", pattern: "Design / Event Processing",
  title: "Stock Price Alert Manager",
  difficulty: "Medium",
  desc: "Implement a price alert system. addAlert(ticker, condition, threshold) registers an alert where condition is 'above' or 'below'. processPrice(ticker, price) triggers and removes all matching alerts, returning list of triggered alert descriptions 'TICKER condition threshold'. Alerts fire once then get removed.",
  examples: [
    { input: "addAlert('AAPL','above',180), processPrice('AAPL',185)", output: "['AAPL above 180']" },
    { input: "addAlert('AAPL','below',150), processPrice('AAPL',160)", output: "[]" }
  ],
  constraints: ["1 <= alerts <= 10^4", "prices are positive"],
  functionSignature: "def processPrice(self, ticker: str, price: float) -> List[str]:",
  starters: {
    Python: "from typing import List\n\nclass PriceAlertSystem:\n    def __init__(self):\n        pass\n\n    def addAlert(self, ticker: str, condition: str, threshold: float) -> None:\n        pass\n\n    def processPrice(self, ticker: str, price: float) -> List[str]:\n        pass",
    JavaScript: "class PriceAlertSystem {\n    constructor() {}\n    addAlert(ticker, condition, threshold) {}\n    processPrice(ticker, price) { return []; }\n}",
    TypeScript: "class PriceAlertSystem {\n    constructor() {}\n    addAlert(ticker: string, condition: string, threshold: number): void {}\n    processPrice(ticker: string, price: number): string[] { return []; }\n}",
    Java: "class PriceAlertSystem {\n    public void addAlert(String ticker, String cond, double threshold) {}\n    public List<String> processPrice(String ticker, double price) { return new ArrayList<>(); }\n}",
    "C++": "class PriceAlertSystem {\npublic:\n    void addAlert(string ticker, string cond, double threshold) {}\n    vector<string> processPrice(string ticker, double price) { return {}; }\n};",
  },
  testCases: [
    { script: "s = PriceAlertSystem()\ns.addAlert('AAPL','above',180)\nprint(s.processPrice('AAPL',185))", expected: "['AAPL above 180']", isPublic: true },
    { script: "s = PriceAlertSystem()\ns.addAlert('AAPL','below',150)\nprint(s.processPrice('AAPL',160))", expected: "[]", isPublic: true },
    { script: "s = PriceAlertSystem()\ns.addAlert('X','above',100)\ns.processPrice('X',110)\nprint(s.processPrice('X',120))", expected: "[]", isPublic: false },
    { script: "s = PriceAlertSystem()\ns.addAlert('X','above',100)\ns.addAlert('X','below',50)\nprint(len(s.processPrice('X',30)))", expected: "1", isPublic: false },
    { script: "s = PriceAlertSystem()\ns.addAlert('A','above',10)\ns.addAlert('B','above',20)\nprint(len(s.processPrice('A',15)))", expected: "1", isPublic: false },
  ],
},

"Robinhood: Order Book Matching Engine": {
  company: "robinhood", pattern: "Priority Queue / Design",
  title: "Simple Order Book",
  difficulty: "Hard",
  desc: "Implement a basic order book. addOrder(side, price, quantity) adds a buy or sell order. processOrders() matches the highest buy price with lowest sell price when buy >= sell. Execute min(buy_qty, sell_qty) shares. Return list of executed trades as [price, quantity]. Use midpoint price for trade.",
  examples: [
    { input: "addOrder('buy',100,10), addOrder('sell',99,5), processOrders()", output: "[[99.5, 5]]" },
    { input: "addOrder('buy',95,10), addOrder('sell',100,5), processOrders()", output: "[]" }
  ],
  constraints: ["price > 0", "quantity > 0"],
  functionSignature: "def processOrders(self) -> List[List]:",
  starters: {
    Python: "from typing import List\nimport heapq\n\nclass OrderBook:\n    def __init__(self):\n        self.buys = []  # max heap (negate price)\n        self.sells = []  # min heap\n\n    def addOrder(self, side: str, price: float, quantity: int) -> None:\n        pass\n\n    def processOrders(self) -> List[List]:\n        pass",
    JavaScript: "class OrderBook {\n    constructor() { this.buys = []; this.sells = []; }\n    addOrder(side, price, quantity) {}\n    processOrders() { return []; }\n}",
    TypeScript: "class OrderBook {\n    private buys: number[][] = [];\n    private sells: number[][] = [];\n    addOrder(side: string, price: number, quantity: number): void {}\n    processOrders(): number[][] { return []; }\n}",
    Java: "class OrderBook {\n    public void addOrder(String side, double price, int qty) {}\n    public List<List<Double>> processOrders() { return new ArrayList<>(); }\n}",
    "C++": "class OrderBook {\npublic:\n    void addOrder(string side, double price, int qty) {}\n    vector<vector<double>> processOrders() { return {}; }\n};",
  },
  testCases: [
    { script: "ob = OrderBook()\nob.addOrder('buy',100,10)\nob.addOrder('sell',99,5)\nresult = ob.processOrders()\nprint(result[0][0])", expected: "99.5", isPublic: true },
    { script: "ob = OrderBook()\nob.addOrder('buy',95,10)\nob.addOrder('sell',100,5)\nprint(ob.processOrders())", expected: "[]", isPublic: true },
    { script: "ob = OrderBook()\nob.addOrder('buy',100,10)\nob.addOrder('sell',99,5)\nprint(ob.processOrders()[0][1])", expected: "5", isPublic: false },
    { script: "ob = OrderBook()\nob.addOrder('buy',100,3)\nob.addOrder('sell',90,3)\nresult = ob.processOrders()\nprint(result[0][1])", expected: "3", isPublic: false },
    { script: "ob = OrderBook()\nob.addOrder('buy',110,5)\nob.addOrder('buy',100,5)\nob.addOrder('sell',105,3)\nresult = ob.processOrders()\nprint(len(result))", expected: "1", isPublic: false },
  ],
},

"Robinhood: Dividend Reinvestment Calculator": {
  company: "robinhood", pattern: "Math / Simulation",
  title: "DRIP Compound Growth Simulator",
  difficulty: "Easy",
  desc: "Simulate dividend reinvestment (DRIP). Given initial_shares, share_price, annual_dividend_per_share, years, and quarterly compounding: each quarter, add shares = (shares * quarterly_dividend) / current_price. Price grows by annual_growth/4 each quarter. Return final shares and portfolio value after years, rounded to 2dp.",
  examples: [
    { input: "shares=100, price=50, annualDiv=2.0, annualGrowth=0.1, years=1", output: "depends on calculation" }
  ],
  constraints: ["shares > 0", "price > 0", "0 <= annualDiv, annualGrowth"],
  functionSignature: "def simulateDRIP(self, shares: float, price: float, annualDiv: float, annualGrowth: float, years: int) -> List[float]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def simulateDRIP(self, shares: float, price: float, annualDiv: float, annualGrowth: float, years: int) -> List[float]:\n        pass",
    JavaScript: "var simulateDRIP = function(shares, price, annualDiv, annualGrowth, years) {\n    \n};",
    TypeScript: "function simulateDRIP(shares: number, price: number, annualDiv: number, annualGrowth: number, years: number): number[] {\n    \n};",
    Java: "class Solution {\n    public double[] simulateDRIP(double shares, double price, double annualDiv, double annualGrowth, int years) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<double> simulateDRIP(double shares, double price, double div, double growth, int years) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.simulateDRIP(100, 50, 0, 0, 1)\nprint(result[0])", expected: "100.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.simulateDRIP(100, 50, 0, 0.1, 0)\nprint(result[1])", expected: "5000.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.simulateDRIP(100, 10, 1.0, 0, 1)\nprint(result[0] > 100)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nresult = sol.simulateDRIP(1000, 100, 4.0, 0.0, 1)\nprint(round(result[1], 2) > 100000)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nresult = sol.simulateDRIP(100, 50, 2.0, 0.1, 5)\nprint(len(result))", expected: "2", isPublic: false },
  ],
},

"Robinhood: Margin Call Calculator": {
  company: "robinhood", pattern: "Finance Math",
  title: "Margin Call Threshold",
  difficulty: "Easy",
  desc: "Given portfolio value, borrowed amount, and maintenance margin (default 25%), compute: equity = portfolio_value - borrowed, margin_ratio = equity/portfolio_value, margin_call_price = borrowed / (1 - maintenance_margin). Return dict with 'equity', 'marginRatio', 'marginCallPrice', 'isMarginCall' (True if margin_ratio < maintenance_margin).",
  examples: [
    { input: "portfolioValue=10000, borrowed=5000, maintenanceMargin=0.25", output: "{'equity':5000,'marginRatio':0.5,'marginCallPrice':6666.67,'isMarginCall':False}" },
    { input: "portfolioValue=6000, borrowed=5000, maintenanceMargin=0.25", output: "{'isMarginCall':True,...}" }
  ],
  constraints: ["portfolioValue > borrowed >= 0", "0 < maintenanceMargin < 1"],
  functionSignature: "def marginCall(self, portfolioValue: float, borrowed: float, maintenanceMargin: float) -> dict:",
  starters: {
    Python: "class Solution:\n    def marginCall(self, portfolioValue: float, borrowed: float, maintenanceMargin: float) -> dict:\n        pass",
    JavaScript: "var marginCall = function(portfolioValue, borrowed, maintenanceMargin) {\n    \n};",
    TypeScript: "function marginCall(portfolioValue: number, borrowed: number, maintenanceMargin: number): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> marginCall(double pv, double borrowed, double mm) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> marginCall(double pv, double b, double mm) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.marginCall(10000,5000,0.25)['isMarginCall'])", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.marginCall(6000,5000,0.25)['isMarginCall'])", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.marginCall(10000,0,0.25)['equity'])", expected: "10000", isPublic: false },
    { script: "sol = Solution()\nprint(round(sol.marginCall(10000,5000,0.25)['marginCallPrice'],2))", expected: "6666.67", isPublic: false },
    { script: "sol = Solution()\nprint(sol.marginCall(8000,6000,0.25)['isMarginCall'])", expected: "True", isPublic: false },
  ],
},

"Robinhood: Tax Lot Selection FIFO LIFO": {
  company: "robinhood", pattern: "Stack / Queue / Tax Optimization",
  title: "Tax Lot Selector for Capital Gains",
  difficulty: "Medium",
  desc: "Given a list of buy lots [price, quantity] in order, and a sell quantity, compute capital gains under FIFO and LIFO methods. FIFO sells oldest lots first, LIFO sells newest. Return dict with 'fifoGains' and 'lifoGains' given current_price.",
  examples: [
    { input: "lots=[[50,10],[60,10]], sellQty=15, currentPrice=70", output: "{'fifoGains':250,'lifoGains':200}" },
    { input: "lots=[[100,5]], sellQty=5, currentPrice=150", output: "{'fifoGains':250,'lifoGains':250}" }
  ],
  constraints: ["total lot quantity >= sellQty", "price > 0", "sellQty > 0"],
  functionSignature: "def taxLotGains(self, lots: List[List], sellQty: int, currentPrice: float) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def taxLotGains(self, lots: List[List], sellQty: int, currentPrice: float) -> dict:\n        pass",
    JavaScript: "var taxLotGains = function(lots, sellQty, currentPrice) {\n    \n};",
    TypeScript: "function taxLotGains(lots: number[][], sellQty: number, currentPrice: number): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Integer> taxLotGains(int[][] lots, int sellQty, double currentPrice) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> taxLotGains(vector<pair<double,int>>& lots, int qty, double price) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.taxLotGains([[50,10],[60,10]],15,70)['fifoGains'])", expected: "250", isPublic: true },
    { script: "sol = Solution()\nprint(sol.taxLotGains([[50,10],[60,10]],15,70)['lifoGains'])", expected: "200", isPublic: true },
    { script: "sol = Solution()\nprint(sol.taxLotGains([[100,5]],5,150)['fifoGains'])", expected: "250", isPublic: false },
    { script: "sol = Solution()\nprint(sol.taxLotGains([[10,5],[20,5]],5,15)['lifoGains'])", expected: "-25", isPublic: false },
    { script: "sol = Solution()\nprint(sol.taxLotGains([[10,5],[20,5]],5,15)['fifoGains'])", expected: "25", isPublic: false },
  ],
},

"Robinhood: Fractional Share Calculator": {
  company: "robinhood", pattern: "Math / Precision",
  title: "Fractional Share Purchase",
  difficulty: "Easy",
  desc: "Given a dollar amount to invest, current stock price, and minimum fractional precision (e.g. 0.000001), compute how many fractional shares to buy (floor to precision), remaining cash, and total cost. Return dict with 'shares', 'cost', 'remainder'.",
  examples: [
    { input: "amount=100, price=300, precision=0.000001", output: "{'shares':0.333333,'cost':99.9999,'remainder':0.0001}" }
  ],
  constraints: ["amount > 0", "price > 0", "precision > 0"],
  functionSignature: "def fractionalShares(self, amount: float, price: float, precision: float) -> dict:",
  starters: {
    Python: "class Solution:\n    def fractionalShares(self, amount: float, price: float, precision: float) -> dict:\n        pass",
    JavaScript: "var fractionalShares = function(amount, price, precision) {\n    \n};",
    TypeScript: "function fractionalShares(amount: number, price: number, precision: number): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> fractionalShares(double amount, double price, double precision) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> fractionalShares(double amount, double price, double prec) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.fractionalShares(100, 300, 0.000001)\nprint(result['shares'])", expected: "0.333333", isPublic: true },
    { script: "sol = Solution()\nresult = sol.fractionalShares(100, 100, 1.0)\nprint(result['shares'])", expected: "1.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.fractionalShares(50, 300, 0.001)\nprint(result['remainder'] >= 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nresult = sol.fractionalShares(1000, 1000, 0.01)\nprint(result['shares'])", expected: "1.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.fractionalShares(75, 200, 0.0001)\nprint(result['shares'])", expected: "0.375", isPublic: false },
  ],
},

"Robinhood: Market Hours Checker": {
  company: "robinhood", pattern: "Date/Time Logic",
  title: "Check Market Trading Hours",
  difficulty: "Easy",
  desc: "Given a UTC timestamp (seconds since epoch) and a market ('NYSE','NASDAQ','LSE','TSX'), determine if the market is open for regular trading. NYSE/NASDAQ: Mon-Fri 9:30-16:00 ET (UTC-5). LSE: Mon-Fri 8:00-16:30 GMT (UTC+0). TSX: Mon-Fri 9:30-16:00 ET. Ignore holidays. Return True/False.",
  examples: [
    { input: "timestamp=1705415400, market='NYSE'", output: "True (Mon Jan 16 2024 09:30 ET)" },
    { input: "timestamp=1705392000, market='NYSE'", output: "False (Sunday)" }
  ],
  constraints: ["market in ['NYSE','NASDAQ','LSE','TSX']", "timestamp > 0"],
  functionSignature: "def isMarketOpen(self, timestamp: int, market: str) -> bool:",
  starters: {
    Python: "import datetime\n\nclass Solution:\n    def isMarketOpen(self, timestamp: int, market: str) -> bool:\n        pass",
    JavaScript: "var isMarketOpen = function(timestamp, market) {\n    \n};",
    TypeScript: "function isMarketOpen(timestamp: number, market: string): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isMarketOpen(long timestamp, String market) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isMarketOpen(long long ts, string market) {\n        \n    }\n};",
  },
  testCases: [
    { script: "import datetime\nsol = Solution()\n# 2024-01-16 14:30 UTC = 09:30 ET (Tuesday)\nprint(sol.isMarketOpen(1705415400, 'NYSE'))", expected: "True", isPublic: true },
    { script: "import datetime\nsol = Solution()\n# Saturday UTC\nprint(sol.isMarketOpen(1705305600, 'NYSE'))", expected: "False", isPublic: true },
    { script: "import datetime\nsol = Solution()\n# 2024-01-16 21:30 UTC = 16:30 ET\nprint(sol.isMarketOpen(1705444200, 'NYSE'))", expected: "False", isPublic: false },
    { script: "import datetime\nsol = Solution()\n# 2024-01-16 09:00 UTC = 09:00 GMT (LSE open)\nprint(sol.isMarketOpen(1705399200, 'LSE'))", expected: "True", isPublic: false },
    { script: "import datetime\nsol = Solution()\n# 2024-01-16 20:00 UTC = 20:00 GMT (LSE closed)\nprint(sol.isMarketOpen(1705435200, 'LSE'))", expected: "False", isPublic: false },
  ],
},

// =============================================================================
// COINBASE (15 problems)
// =============================================================================

"Coinbase: Crypto Portfolio Rebalancer": {
  company: "coinbase", pattern: "Math / Greedy",
  title: "Portfolio Rebalancing Calculator",
  difficulty: "Medium",
  desc: "Given current holdings [asset, amount, currentPrice] and target allocation percentages [asset, targetPct] (sum=100), compute trades needed to rebalance. Return list of [asset, action('buy'/'sell'), dollarAmount] rounded to 2dp. Total portfolio value stays constant.",
  examples: [
    { input: "holdings=[['BTC',1,50000],['ETH',10,3000]], targets=[['BTC',60],['ETH',40]]", output: "rebalance trades" }
  ],
  constraints: ["targets sum to 100", "prices > 0"],
  functionSignature: "def rebalance(self, holdings: List[List], targets: List[List]) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def rebalance(self, holdings: List[List], targets: List[List]) -> List[List]:\n        pass",
    JavaScript: "var rebalance = function(holdings, targets) {\n    \n};",
    TypeScript: "function rebalance(holdings: any[][], targets: any[][]): any[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Object>> rebalance(List<List<Object>> holdings, List<List<Object>> targets) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<tuple<string,string,double>> rebalance(vector<tuple<string,double,double>>& h, vector<pair<string,double>>& t) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.rebalance([['BTC',1,50000],['ETH',10,3000]],[['BTC',60],['ETH',40]])\ntotal = sum(abs(r[2]) for r in result)\nprint(total > 0)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nresult = sol.rebalance([['BTC',1,100]],[['BTC',100]])\nprint(result)", expected: "[]", isPublic: true },
    { script: "sol = Solution()\nresult = sol.rebalance([['A',10,100],['B',10,100]],[['A',50],['B',50]])\nprint(result)", expected: "[]", isPublic: false },
    { script: "sol = Solution()\nresult = sol.rebalance([['A',10,100],['B',0,100]],[['A',50],['B',50]])\nbuys = [r for r in result if r[1]=='buy']\nprint(len(buys))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nresult = sol.rebalance([['BTC',2,1000]],[['BTC',100]])\nprint(result)", expected: "[]", isPublic: false },
  ],
},

"Coinbase: Blockchain Transaction Validator": {
  company: "coinbase", pattern: "Linked List / Validation",
  title: "Simple Blockchain Validator",
  difficulty: "Medium",
  desc: "Each block has [index, data, previousHash, hash]. hash = str(index + sum(ord(c) for c in data) + sum(ord(c) for c in previousHash)) % 1000000. Validate: (1) hashes are correct, (2) previousHash links match, (3) genesis block has previousHash='0'. Return True if chain is valid.",
  examples: [
    { input: "valid genesis + 2 blocks", output: "True" },
    { input: "tampered data in block 1", output: "False" }
  ],
  constraints: ["chain length >= 1", "first block is genesis"],
  functionSignature: "def validateChain(self, chain: List[List]) -> bool:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def validateChain(self, chain: List[List]) -> bool:\n        pass\n\n    def computeHash(self, index: int, data: str, previousHash: str) -> int:\n        return (index + sum(ord(c) for c in data) + sum(ord(c) for c in previousHash)) % 1000000",
    JavaScript: "class Solution {\n    computeHash(index, data, prevHash) {\n        return (index + [...data].reduce((a,c)=>a+c.charCodeAt(0),0) + [...prevHash].reduce((a,c)=>a+c.charCodeAt(0),0)) % 1000000;\n    }\n    validateChain(chain) { return true; }\n}",
    TypeScript: "class Solution {\n    computeHash(index: number, data: string, prevHash: string): number {\n        return (index + [...data].reduce((a,c)=>a+c.charCodeAt(0),0) + [...prevHash].reduce((a,c)=>a+c.charCodeAt(0),0)) % 1000000;\n    }\n    validateChain(chain: any[][]): boolean { return true; }\n}",
    Java: "class Solution {\n    public boolean validateChain(List<List<Object>> chain) { return true; }\n}",
    "C++": "class Solution {\npublic:\n    bool validateChain(vector<vector<string>>& chain) { return true; }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nh0 = sol.computeHash(0,'genesis','0')\nblock0 = [0,'genesis','0',h0]\nh1 = sol.computeHash(1,'tx1',str(h0))\nblock1 = [1,'tx1',str(h0),h1]\nprint(sol.validateChain([block0,block1]))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nh0 = sol.computeHash(0,'genesis','0')\nblock0 = [0,'tampered','0',h0]\nprint(sol.validateChain([block0]))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nh0 = sol.computeHash(0,'a','0')\nblock0 = [0,'a','0',h0]\nprint(sol.validateChain([block0]))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nh0 = sol.computeHash(0,'a','1')\nblock0 = [0,'a','1',h0]\nprint(sol.validateChain([block0]))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nh0 = sol.computeHash(0,'x','0')\nh1 = sol.computeHash(1,'y',str(h0+1))\nblock0=[0,'x','0',h0]\nblock1=[1,'y',str(h0+1),h1]\nprint(sol.validateChain([block0,block1]))", expected: "False", isPublic: false },
  ],
},

"Coinbase: Gas Fee Estimator": {
  company: "coinbase", pattern: "Math / Optimization",
  title: "Ethereum Gas Fee Calculator",
  difficulty: "Easy",
  desc: "Calculate Ethereum transaction fee. Given base_fee (gwei), priority_fee (gwei), gas_limit, and eth_price_usd: total_fee_gwei = (base_fee + priority_fee) * gas_limit. Convert to ETH (divide by 10^9), then to USD. Return dict with 'feeGwei', 'feeEth', 'feeUsd' rounded to 6dp.",
  examples: [
    { input: "baseFee=20, priorityFee=2, gasLimit=21000, ethPrice=2000", output: "{'feeGwei':462000,'feeEth':0.000462,'feeUsd':0.924}" }
  ],
  constraints: ["baseFee >= 0", "priorityFee >= 0", "gasLimit > 0", "ethPrice > 0"],
  functionSignature: "def estimateGasFee(self, baseFee: float, priorityFee: float, gasLimit: int, ethPrice: float) -> dict:",
  starters: {
    Python: "class Solution:\n    def estimateGasFee(self, baseFee: float, priorityFee: float, gasLimit: int, ethPrice: float) -> dict:\n        pass",
    JavaScript: "var estimateGasFee = function(baseFee, priorityFee, gasLimit, ethPrice) {\n    \n};",
    TypeScript: "function estimateGasFee(baseFee: number, priorityFee: number, gasLimit: number, ethPrice: number): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> estimateGasFee(double baseFee, double priorityFee, int gasLimit, double ethPrice) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> estimateGasFee(double base, double pri, int lim, double ethPrice) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.estimateGasFee(20,2,21000,2000)['feeGwei'])", expected: "462000", isPublic: true },
    { script: "sol = Solution()\nresult = sol.estimateGasFee(20,2,21000,2000)\nprint(round(result['feeEth'],6))", expected: "0.000462", isPublic: true },
    { script: "sol = Solution()\nresult = sol.estimateGasFee(20,2,21000,2000)\nprint(round(result['feeUsd'],3))", expected: "0.924", isPublic: false },
    { script: "sol = Solution()\nresult = sol.estimateGasFee(0,0,21000,2000)\nprint(result['feeGwei'])", expected: "0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.estimateGasFee(100,10,100000,3000)\nprint(result['feeGwei'])", expected: "11000000", isPublic: false },
  ],
},

"Coinbase: Crypto Arbitrage Detector": {
  company: "coinbase", pattern: "Graph / Bellman-Ford",
  title: "Detect Crypto Arbitrage Opportunity",
  difficulty: "Hard",
  desc: "Given exchange rates between currencies, detect if an arbitrage opportunity exists. An arbitrage exists if you can start with 1 unit of any currency and end up with more than 1 unit of the same currency. Use log transformation: if sum of negative log rates forms a negative cycle, arbitrage exists. Return True/False.",
  examples: [
    { input: "rates=[['USD','EUR',0.9],['EUR','GBP',0.8],['GBP','USD',1.5]]", output: "True (1*0.9*0.8*1.5=1.08>1)" },
    { input: "rates=[['USD','EUR',0.9],['EUR','USD',1.0]]", output: "False" }
  ],
  constraints: ["1 <= rates.length <= 100", "rates > 0"],
  functionSignature: "def hasArbitrage(self, rates: List[List]) -> bool:",
  starters: {
    Python: "from typing import List\nimport math\n\nclass Solution:\n    def hasArbitrage(self, rates: List[List]) -> bool:\n        pass",
    JavaScript: "var hasArbitrage = function(rates) {\n    \n};",
    TypeScript: "function hasArbitrage(rates: any[][]): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean hasArbitrage(List<List<Object>> rates) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool hasArbitrage(vector<tuple<string,string,double>>& rates) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.hasArbitrage([['USD','EUR',0.9],['EUR','GBP',0.8],['GBP','USD',1.5]]))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.hasArbitrage([['USD','EUR',0.9],['EUR','USD',1.0]]))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.hasArbitrage([['A','B',1.0],['B','A',1.0]]))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.hasArbitrage([['A','B',2.0],['B','A',0.6]]))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.hasArbitrage([['A','B',1.1],['B','C',1.1],['C','A',0.9]]))", expected: "True", isPublic: false },
  ],
},

"Coinbase: Stablecoin Peg Monitor": {
  company: "coinbase", pattern: "Statistics / Threshold Alerting",
  title: "Stablecoin Depeg Detector",
  difficulty: "Easy",
  desc: "Given a list of [timestamp, price] tuples for a stablecoin (pegged to $1), detect depeg events where |price - 1.0| > threshold for >= consecutive_mins minutes. Return list of [start_timestamp, end_timestamp] for each depeg event.",
  examples: [
    { input: "prices=[[1,0.96],[2,0.95],[3,0.94],[4,1.00]], threshold=0.03, consecutive_mins=2", output: "[[1,3]]" },
    { input: "prices=[[1,0.98],[2,1.00]], threshold=0.03, consecutive_mins=2", output: "[]" }
  ],
  constraints: ["1 <= prices.length <= 10^4", "threshold > 0", "consecutive_mins >= 1"],
  functionSignature: "def detectDepeg(self, prices: List[List], threshold: float, consecutive_mins: int) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def detectDepeg(self, prices: List[List], threshold: float, consecutive_mins: int) -> List[List]:\n        pass",
    JavaScript: "var detectDepeg = function(prices, threshold, consecutiveMins) {\n    \n};",
    TypeScript: "function detectDepeg(prices: number[][], threshold: number, consecutiveMins: number): number[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Integer>> detectDepeg(List<List<Double>> prices, double threshold, int consecutiveMins) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<pair<int,int>> detectDepeg(vector<pair<int,double>>& prices, double thr, int mins) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.detectDepeg([[1,0.96],[2,0.95],[3,0.94],[4,1.00]],0.03,2))", expected: "[[1, 3]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.detectDepeg([[1,0.98],[2,1.00]],0.03,2))", expected: "[]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.detectDepeg([[1,0.90]],0.03,1))", expected: "[[1, 1]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.detectDepeg([[1,0.96],[2,1.01],[3,0.95],[4,0.94]],0.03,2))", expected: "[[3, 4]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.detectDepeg([[1,1.0],[2,1.0],[3,1.0]],0.03,2))", expected: "[]", isPublic: false },
  ],
},

"Coinbase: NFT Royalty Calculator": {
  company: "coinbase", pattern: "Math / Chain Traversal",
  title: "NFT Resale Royalty Distribution",
  difficulty: "Easy",
  desc: "Given a list of NFT sales [salePrice, sellerAddress] in order, and original creator royalty percentage, compute: creator earnings (royaltyPct of each sale except first), platform fee (2.5% of each sale), seller proceeds (remainder). Return dict of address -> total earnings for all parties including 'platform'.",
  examples: [
    { input: "sales=[[1000,'alice'],[2000,'bob'],[3000,'charlie']], royaltyPct=10, creator='alice'", output: "{'alice':1000+200+300=1500,'bob':...,'platform':...,'charlie':...}" }
  ],
  constraints: ["sales.length >= 1", "0 <= royaltyPct <= 50"],
  functionSignature: "def royaltyDistribution(self, sales: List[List], royaltyPct: float, creator: str) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def royaltyDistribution(self, sales: List[List], royaltyPct: float, creator: str) -> dict:\n        pass",
    JavaScript: "var royaltyDistribution = function(sales, royaltyPct, creator) {\n    \n};",
    TypeScript: "function royaltyDistribution(sales: any[][], royaltyPct: number, creator: string): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> royaltyDistribution(List<List<Object>> sales, double royaltyPct, String creator) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> royaltyDistribution(vector<pair<double,string>>& sales, double pct, string creator) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.royaltyDistribution([[1000,'alice'],[2000,'bob']],'10','alice')\nprint(r['alice'])", expected: "1175.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.royaltyDistribution([[1000,'alice']],'10','alice')\nprint(r['platform'])", expected: "25.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.royaltyDistribution([[1000,'a'],[2000,'b']],'0','a')\nprint(r['platform'])", expected: "75.0", isPublic: false },
    { script: "sol = Solution()\nr = sol.royaltyDistribution([[500,'x'],[1000,'y'],[1500,'z']],'10','x')\nprint(r['x'])", expected: "737.5", isPublic: false },
    { script: "sol = Solution()\nr = sol.royaltyDistribution([[100,'a']],'10','a')\nprint(sum(r.values()))", expected: "100.0", isPublic: false },
  ],
},

"Coinbase: Transaction Mempool Prioritizer": {
  company: "coinbase", pattern: "Priority Queue / Sorting",
  title: "Mempool Transaction Prioritizer",
  difficulty: "Medium",
  desc: "Given pending transactions [txId, gasPrice, gasLimit, timestamp] and a block gas limit, select transactions to include in the next block. Maximize total fees (gasPrice * gasLimit) without exceeding blockGasLimit. Use greedy: sort by fee rate (gasPrice) descending. Return list of selected txIds.",
  examples: [
    { input: "txns=[['t1',10,21000],['t2',5,21000],['t3',8,42000]], blockGasLimit=63000", output: "['t1','t3']" },
    { input: "txns=[['t1',10,100000]], blockGasLimit=21000", output: "[]" }
  ],
  constraints: ["1 <= txns.length <= 1000", "gasPrice > 0", "gasLimit > 0"],
  functionSignature: "def prioritizeMempool(self, txns: List[List], blockGasLimit: int) -> List[str]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def prioritizeMempool(self, txns: List[List], blockGasLimit: int) -> List[str]:\n        pass",
    JavaScript: "var prioritizeMempool = function(txns, blockGasLimit) {\n    \n};",
    TypeScript: "function prioritizeMempool(txns: any[][], blockGasLimit: number): string[] {\n    \n};",
    Java: "class Solution {\n    public List<String> prioritizeMempool(List<List<Object>> txns, int blockGasLimit) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<string> prioritizeMempool(vector<tuple<string,int,int>>& txns, int limit) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.prioritizeMempool([['t1',10,21000],['t2',5,21000],['t3',8,42000]],63000))", expected: "['t1', 't3']", isPublic: true },
    { script: "sol = Solution()\nprint(sol.prioritizeMempool([['t1',10,100000]],21000))", expected: "[]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.prioritizeMempool([['t1',5,21000],['t2',10,21000]],21000))", expected: "['t2']", isPublic: false },
    { script: "sol = Solution()\nprint(len(sol.prioritizeMempool([['t1',1,1000],['t2',1,1000],['t3',1,1000]],2500)))", expected: "2", isPublic: false },
    { script: "sol = Solution()\nprint(sol.prioritizeMempool([],1000000))", expected: "[]", isPublic: false },
  ],
},

"Coinbase: DeFi Liquidity Pool AMM": {
  company: "coinbase", pattern: "Math / AMM Formula",
  title: "AMM Constant Product Swap",
  difficulty: "Medium",
  desc: "Implement a constant-product AMM (x * y = k). Given reserves [reserveA, reserveB] and a swap of amountIn of token A (with 0.3% fee), compute amountOut of token B. Formula: amountInWithFee = amountIn * 0.997; amountOut = (amountInWithFee * reserveB) / (reserveA + amountInWithFee). Return [amountOut, newReserveA, newReserveB] rounded to 6dp.",
  examples: [
    { input: "reserveA=1000, reserveB=1000, amountIn=10", output: "[9.870109, 1010.0, 990.129891]" }
  ],
  constraints: ["reserves > 0", "amountIn > 0"],
  functionSignature: "def swapAMM(self, reserveA: float, reserveB: float, amountIn: float) -> List[float]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def swapAMM(self, reserveA: float, reserveB: float, amountIn: float) -> List[float]:\n        pass",
    JavaScript: "var swapAMM = function(reserveA, reserveB, amountIn) {\n    \n};",
    TypeScript: "function swapAMM(reserveA: number, reserveB: number, amountIn: number): number[] {\n    \n};",
    Java: "class Solution {\n    public double[] swapAMM(double reserveA, double reserveB, double amountIn) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<double> swapAMM(double rA, double rB, double amtIn) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.swapAMM(1000,1000,10)\nprint(round(result[0],4))", expected: "9.8701", isPublic: true },
    { script: "sol = Solution()\nresult = sol.swapAMM(1000,1000,10)\nprint(round(result[1],4))", expected: "1010.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.swapAMM(1000,1000,0)\nprint(result[0])", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.swapAMM(500,2000,50)\nprint(round(result[0],2) > 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr1 = sol.swapAMM(1000,1000,10)\nprint(round(r1[1]*r1[2],2) <= round(1000*1000,2))", expected: "True", isPublic: false },
  ],
},

"Coinbase: Wallet Address Validation": {
  company: "coinbase", pattern: "String / Regex / Validation",
  title: "Crypto Wallet Address Validator",
  difficulty: "Easy",
  desc: "Validate cryptocurrency wallet addresses. Bitcoin (P2PKH): starts with '1', length 25-34, base58 chars only (no 0,O,I,l). Ethereum: starts with '0x', length 42, hex chars after prefix. Return dict with 'isValid' and 'network' ('bitcoin','ethereum','unknown').",
  examples: [
    { input: '"1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2"', output: "{'isValid':True,'network':'bitcoin'}" },
    { input: '"0x742d35Cc6634C0532925a3b844Bc454e4438f44e"', output: "{'isValid':True,'network':'ethereum'}" }
  ],
  constraints: ["address is a non-empty string"],
  functionSignature: "def validateAddress(self, address: str) -> dict:",
  starters: {
    Python: "import re\n\nclass Solution:\n    def validateAddress(self, address: str) -> dict:\n        pass",
    JavaScript: "var validateAddress = function(address) {\n    \n};",
    TypeScript: "function validateAddress(address: string): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> validateAddress(String address) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,string> validateAddress(string address) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.validateAddress('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2')['network'])", expected: "bitcoin", isPublic: true },
    { script: "sol = Solution()\nprint(sol.validateAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')['isValid'])", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.validateAddress('0xinvalid')['isValid'])", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.validateAddress('randomstring')['network'])", expected: "unknown", isPublic: false },
    { script: "sol = Solution()\nprint(sol.validateAddress('1' + 'A'*33)['isValid'])", expected: "True", isPublic: false },
  ],
},

"Coinbase: Yield Farming APY Calculator": {
  company: "coinbase", pattern: "Math / Finance",
  title: "DeFi APY Calculator",
  difficulty: "Easy",
  desc: "Calculate Annual Percentage Yield (APY) from APR with given compounding frequency. Formula: APY = (1 + APR/n)^n - 1, where n = compounding periods per year. Return APY as percentage rounded to 4dp. Also compute value after `years` for an initial `principal`.",
  examples: [
    { input: "apr=0.12, n=12, principal=1000, years=1", output: "{'apy':12.6825,'finalValue':1126.83}" }
  ],
  constraints: ["0 < apr <= 10", "n >= 1", "principal > 0", "years >= 0"],
  functionSignature: "def calculateAPY(self, apr: float, n: int, principal: float, years: int) -> dict:",
  starters: {
    Python: "class Solution:\n    def calculateAPY(self, apr: float, n: int, principal: float, years: int) -> dict:\n        pass",
    JavaScript: "var calculateAPY = function(apr, n, principal, years) {\n    \n};",
    TypeScript: "function calculateAPY(apr: number, n: number, principal: number, years: number): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> calculateAPY(double apr, int n, double principal, int years) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> calculateAPY(double apr, int n, double principal, int years) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.calculateAPY(0.12, 12, 1000, 1)\nprint(round(result['apy'],4))", expected: "12.6825", isPublic: true },
    { script: "sol = Solution()\nresult = sol.calculateAPY(0.12, 12, 1000, 1)\nprint(round(result['finalValue'],2))", expected: "1126.83", isPublic: true },
    { script: "sol = Solution()\nresult = sol.calculateAPY(0.1, 1, 1000, 0)\nprint(result['finalValue'])", expected: "1000.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.calculateAPY(0.1, 1, 1000, 1)\nprint(round(result['apy'],4))", expected: "10.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.calculateAPY(0.06, 365, 5000, 2)\nprint(round(result['finalValue'],2) > 5600)", expected: "True", isPublic: false },
  ],
},

"Coinbase: Proof of Work Simulator": {
  company: "coinbase", pattern: "Bit Manipulation / Simulation",
  title: "Simplified Mining Simulator",
  difficulty: "Medium",
  desc: "Simulate proof-of-work mining. Given data string and difficulty (number of leading zeros required), find nonce such that hash(data + str(nonce)) starts with `difficulty` zeros. Use hash = str(sum(ord(c) for c in (data+str(nonce))) % 10000).zfill(4). Return [nonce, hash_value] for first valid nonce found (starting from 0).",
  examples: [
    { input: 'data="block", difficulty=1', output: "depends on hash function" }
  ],
  constraints: ["difficulty 1-3", "nonce search up to 100000"],
  functionSignature: "def mine(self, data: str, difficulty: int) -> List:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def mine(self, data: str, difficulty: int) -> List:\n        pass\n\n    def computeHash(self, data: str, nonce: int) -> str:\n        val = sum(ord(c) for c in (data + str(nonce))) % 10000\n        return str(val).zfill(4)",
    JavaScript: "class Solution {\n    computeHash(data, nonce) {\n        const s = data + String(nonce);\n        const val = [...s].reduce((a,c)=>a+c.charCodeAt(0),0) % 10000;\n        return String(val).padStart(4,'0');\n    }\n    mine(data, difficulty) { return []; }\n}",
    TypeScript: "class Solution {\n    computeHash(data: string, nonce: number): string {\n        const val = [...(data+String(nonce))].reduce((a,c)=>a+c.charCodeAt(0),0) % 10000;\n        return String(val).padStart(4,'0');\n    }\n    mine(data: string, difficulty: number): any[] { return []; }\n}",
    Java: "class Solution {\n    public List<Object> mine(String data, int difficulty) { return new ArrayList<>(); }\n}",
    "C++": "class Solution {\npublic:\n    vector<string> mine(string data, int difficulty) { return {}; }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.mine('block', 1)\nprint(sol.computeHash('block', result[0]).startswith('0'*1))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nresult = sol.mine('test', 1)\nprint(len(result))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nresult = sol.mine('hello', 1)\nprint(sol.computeHash('hello', result[0]) == result[1])", expected: "True", isPublic: false },
    { script: "sol = Solution()\nresult = sol.mine('data', 2)\nprint(result[1].startswith('00'))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nresult = sol.mine('abc', 1)\nprint(isinstance(result[0], int))", expected: "True", isPublic: false },
  ],
},

"Coinbase: Multi-Sig Wallet Approval": {
  company: "coinbase", pattern: "Design / Voting",
  title: "Multi-Signature Wallet",
  difficulty: "Medium",
  desc: "Implement a multi-sig wallet requiring `threshold` approvals. submitTransaction(txId, amount, to) creates a pending tx. approveTransaction(txId, signer) adds approval. executeTransaction(txId) executes if approvals >= threshold and tx not yet executed. Return 'executed', 'pending', or 'not_found'. Track balance (starts at initialBalance); reject if insufficient funds.",
  examples: [
    { input: "threshold=2, balance=1000; submit tx1(500,'bob'); approve(tx1,'alice'); approve(tx1,'carol'); execute(tx1)", output: "executed" },
    { input: "approve then execute with only 1 approval for threshold=2", output: "pending" }
  ],
  constraints: ["threshold >= 1", "signers are strings", "balance >= 0"],
  functionSignature: "def executeTransaction(self, txId: str) -> str:",
  starters: {
    Python: "class MultiSigWallet:\n    def __init__(self, threshold: int, initialBalance: float):\n        pass\n\n    def submitTransaction(self, txId: str, amount: float, to: str) -> None:\n        pass\n\n    def approveTransaction(self, txId: str, signer: str) -> None:\n        pass\n\n    def executeTransaction(self, txId: str) -> str:\n        pass",
    JavaScript: "class MultiSigWallet {\n    constructor(threshold, initialBalance) {}\n    submitTransaction(txId, amount, to) {}\n    approveTransaction(txId, signer) {}\n    executeTransaction(txId) { return ''; }\n}",
    TypeScript: "class MultiSigWallet {\n    constructor(private threshold: number, private balance: number) {}\n    submitTransaction(txId: string, amount: number, to: string): void {}\n    approveTransaction(txId: string, signer: string): void {}\n    executeTransaction(txId: string): string { return ''; }\n}",
    Java: "class MultiSigWallet {\n    public MultiSigWallet(int threshold, double balance) {}\n    public void submitTransaction(String txId, double amount, String to) {}\n    public void approveTransaction(String txId, String signer) {}\n    public String executeTransaction(String txId) { return \"\"; }\n}",
    "C++": "class MultiSigWallet {\npublic:\n    MultiSigWallet(int threshold, double balance) {}\n    void submitTransaction(string txId, double amount, string to) {}\n    void approveTransaction(string txId, string signer) {}\n    string executeTransaction(string txId) { return \"\"; }\n};",
  },
  testCases: [
    { script: "w = MultiSigWallet(2, 1000)\nw.submitTransaction('t1', 500, 'bob')\nw.approveTransaction('t1', 'alice')\nw.approveTransaction('t1', 'carol')\nprint(w.executeTransaction('t1'))", expected: "executed", isPublic: true },
    { script: "w = MultiSigWallet(2, 1000)\nw.submitTransaction('t1', 500, 'bob')\nw.approveTransaction('t1', 'alice')\nprint(w.executeTransaction('t1'))", expected: "pending", isPublic: true },
    { script: "w = MultiSigWallet(1, 100)\nw.submitTransaction('t1', 200, 'x')\nw.approveTransaction('t1', 'a')\nprint(w.executeTransaction('t1'))", expected: "pending", isPublic: false },
    { script: "w = MultiSigWallet(2, 1000)\nprint(w.executeTransaction('nonexistent'))", expected: "not_found", isPublic: false },
    { script: "w = MultiSigWallet(2, 1000)\nw.submitTransaction('t1', 500, 'x')\nw.approveTransaction('t1', 'a')\nw.approveTransaction('t1', 'a')\nprint(w.executeTransaction('t1'))", expected: "pending", isPublic: false },
  ],
},

// =============================================================================
// AFFIRM (15 problems)
// =============================================================================

"Affirm: BNPL Eligibility Check": {
  company: "affirm", pattern: "Rule Engine / Decision Tree",
  title: "BNPL Loan Eligibility",
  difficulty: "Easy",
  desc: "Determine BNPL eligibility based on rules: credit_score >= 600 (+1), debt_to_income < 0.4 (+1), account_age_months >= 6 (+1), no_recent_defaults (+1). Approve if score >= 3, review if 2, deny if < 2. Return dict with 'score', 'decision'.",
  examples: [
    { input: "credit_score=650, dti=0.3, account_age=12, no_defaults=True", output: "{'score':4,'decision':'approve'}" },
    { input: "credit_score=550, dti=0.5, account_age=3, no_defaults=False", output: "{'score':0,'decision':'deny'}" }
  ],
  constraints: ["0 <= credit_score <= 850", "0 <= dti <= 1"],
  functionSignature: "def checkEligibility(self, credit_score: int, dti: float, account_age: int, no_defaults: bool) -> dict:",
  starters: {
    Python: "class Solution:\n    def checkEligibility(self, credit_score: int, dti: float, account_age: int, no_defaults: bool) -> dict:\n        pass",
    JavaScript: "var checkEligibility = function(credit_score, dti, account_age, no_defaults) {\n    \n};",
    TypeScript: "function checkEligibility(credit_score: number, dti: number, account_age: number, no_defaults: boolean): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> checkEligibility(int cs, double dti, int age, boolean nd) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,int> checkEligibility(int cs, double dti, int age, bool nd) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.checkEligibility(650,0.3,12,True)['decision'])", expected: "approve", isPublic: true },
    { script: "sol = Solution()\nprint(sol.checkEligibility(550,0.5,3,False)['score'])", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.checkEligibility(600,0.39,6,False)['score'])", expected: "2", isPublic: false },
    { script: "sol = Solution()\nprint(sol.checkEligibility(600,0.39,6,False)['decision'])", expected: "review", isPublic: false },
    { script: "sol = Solution()\nprint(sol.checkEligibility(750,0.2,24,True)['decision'])", expected: "approve", isPublic: false },
  ],
},

"Affirm: APR to Monthly Payment": {
  company: "affirm", pattern: "Finance Math",
  title: "Loan Monthly Payment Calculator",
  difficulty: "Medium",
  desc: "Calculate monthly payment for a loan using: M = P * [r(1+r)^n] / [(1+r)^n - 1] where P=principal, r=monthly_rate=APR/12, n=months. Return dict with 'monthlyPayment', 'totalPaid', 'totalInterest', all rounded to 2dp. If APR is 0, payment = P/n.",
  examples: [
    { input: "principal=1000, apr=0.12, months=12", output: "{'monthlyPayment':88.85,'totalPaid':1066.2,'totalInterest':66.2}" }
  ],
  constraints: ["principal > 0", "apr >= 0", "months >= 1"],
  functionSignature: "def loanPayment(self, principal: float, apr: float, months: int) -> dict:",
  starters: {
    Python: "class Solution:\n    def loanPayment(self, principal: float, apr: float, months: int) -> dict:\n        pass",
    JavaScript: "var loanPayment = function(principal, apr, months) {\n    \n};",
    TypeScript: "function loanPayment(principal: number, apr: number, months: number): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> loanPayment(double principal, double apr, int months) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> loanPayment(double p, double apr, int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.loanPayment(1000, 0.12, 12)\nprint(round(result['monthlyPayment'],2))", expected: "88.85", isPublic: true },
    { script: "sol = Solution()\nresult = sol.loanPayment(1000, 0.0, 10)\nprint(result['monthlyPayment'])", expected: "100.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.loanPayment(1000, 0.12, 12)\nprint(round(result['totalInterest'],2))", expected: "66.2", isPublic: false },
    { script: "sol = Solution()\nresult = sol.loanPayment(5000, 0.24, 24)\nprint(round(result['monthlyPayment'],2) > 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nresult = sol.loanPayment(100, 0.0, 5)\nprint(result['totalInterest'])", expected: "0.0", isPublic: false },
  ],
},

"Affirm: Credit Limit Recommendation": {
  company: "affirm", pattern: "Math / Business Rules",
  title: "Dynamic Credit Limit Calculator",
  difficulty: "Easy",
  desc: "Recommend a credit limit based on: base_limit = monthly_income * 0.3, adjusted for: credit_score 750+ multiply by 1.5, 650-749 by 1.0, below 650 by 0.5. Then cap at max_limit and floor at min_limit=500. Return recommended limit rounded to nearest 50.",
  examples: [
    { input: "monthly_income=5000, credit_score=760, max_limit=10000", output: "2250" },
    { input: "monthly_income=2000, credit_score=600, max_limit=5000", output: "500" }
  ],
  constraints: ["monthly_income > 0", "0 <= credit_score <= 850", "max_limit >= 500"],
  functionSignature: "def recommendLimit(self, monthly_income: float, credit_score: int, max_limit: float) -> float:",
  starters: {
    Python: "class Solution:\n    def recommendLimit(self, monthly_income: float, credit_score: int, max_limit: float) -> float:\n        pass",
    JavaScript: "var recommendLimit = function(monthly_income, credit_score, max_limit) {\n    \n};",
    TypeScript: "function recommendLimit(monthly_income: number, credit_score: number, max_limit: number): number {\n    \n};",
    Java: "class Solution {\n    public double recommendLimit(double income, int cs, double maxLimit) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    double recommendLimit(double income, int cs, double maxLimit) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.recommendLimit(5000,760,10000))", expected: "2250.0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.recommendLimit(2000,600,5000))", expected: "500.0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.recommendLimit(10000,700,10000))", expected: "3000.0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.recommendLimit(1000,800,10000))", expected: "500.0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.recommendLimit(20000,760,5000))", expected: "5000.0", isPublic: false },
  ],
},

"Affirm: Payment Schedule Generator": {
  company: "affirm", pattern: "Date / Finance",
  title: "Biweekly Payment Schedule",
  difficulty: "Easy",
  desc: "Generate a biweekly (every 14 days) payment schedule. Given start_day (1-based), total_amount_cents, num_payments: distribute evenly (remainder to first payment). Return list of [payment_number, day, amount_cents].",
  examples: [
    { input: "start_day=1, total=100, num_payments=4", output: "[[1,1,25],[2,15,25],[3,29,25],[4,43,25]]" },
    { input: "start_day=1, total=101, num_payments=4", output: "[[1,1,26],[2,15,25],[3,29,25],[4,43,25]]" }
  ],
  constraints: ["1 <= num_payments <= 52", "total_amount_cents >= 0"],
  functionSignature: "def biweeklySchedule(self, start_day: int, total: int, num_payments: int) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def biweeklySchedule(self, start_day: int, total: int, num_payments: int) -> List[List]:\n        pass",
    JavaScript: "var biweeklySchedule = function(start_day, total, num_payments) {\n    \n};",
    TypeScript: "function biweeklySchedule(start_day: number, total: number, num_payments: number): number[][] {\n    \n};",
    Java: "class Solution {\n    public int[][] biweeklySchedule(int startDay, int total, int numPayments) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<int>> biweeklySchedule(int start, int total, int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.biweeklySchedule(1,100,4))", expected: "[[1, 1, 25], [2, 15, 25], [3, 29, 25], [4, 43, 25]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.biweeklySchedule(1,101,4))", expected: "[[1, 1, 26], [2, 15, 25], [3, 29, 25], [4, 43, 25]]", isPublic: true },
    { script: "sol = Solution()\nprint(sum(x[2] for x in sol.biweeklySchedule(5,99,3)))", expected: "99", isPublic: false },
    { script: "sol = Solution()\nprint(sol.biweeklySchedule(1,0,3)[0][2])", expected: "0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.biweeklySchedule(10,100,3)\nprint(result[2][1])", expected: "38", isPublic: false },
  ],
},

"Affirm: Merchant Risk Scoring": {
  company: "affirm", pattern: "Multi-Factor Scoring",
  title: "Merchant Risk Assessment",
  difficulty: "Medium",
  desc: "Score merchant risk: chargeback_rate > 2% adds 30pts, avg_ticket > $500 adds 20pts, business_age_months < 6 adds 25pts, industry in ['gambling','crypto','adult'] adds 25pts. Risk level: >=50->'high', 25-49->'medium', <25->'low'. Return dict with 'score','risk'.",
  examples: [
    { input: "chargeback_rate=0.03, avg_ticket=600, business_age=3, industry='retail'", output: "{'score':75,'risk':'high'}" }
  ],
  constraints: ["chargeback_rate >= 0", "avg_ticket > 0", "business_age >= 0"],
  functionSignature: "def merchantRisk(self, chargeback_rate: float, avg_ticket: float, business_age: int, industry: str) -> dict:",
  starters: {
    Python: "class Solution:\n    def merchantRisk(self, chargeback_rate: float, avg_ticket: float, business_age: int, industry: str) -> dict:\n        pass",
    JavaScript: "var merchantRisk = function(chargeback_rate, avg_ticket, business_age, industry) {\n    \n};",
    TypeScript: "function merchantRisk(chargeback_rate: number, avg_ticket: number, business_age: number, industry: string): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> merchantRisk(double cr, double at, int ba, String ind) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,int> merchantRisk(double cr, double at, int ba, string ind) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.merchantRisk(0.03,600,3,'retail')['risk'])", expected: "high", isPublic: true },
    { script: "sol = Solution()\nprint(sol.merchantRisk(0.01,100,24,'food')['score'])", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.merchantRisk(0.01,100,24,'crypto')['risk'])", expected: "medium", isPublic: false },
    { script: "sol = Solution()\nprint(sol.merchantRisk(0.03,100,24,'gambling')['score'])", expected: "55", isPublic: false },
    { script: "sol = Solution()\nprint(sol.merchantRisk(0.01,200,3,'retail')['risk'])", expected: "medium", isPublic: false },
  ],
},

"Affirm: Late Payment Fee Calculator": {
  company: "affirm", pattern: "Finance / Date Math",
  title: "Late Fee Computation Engine",
  difficulty: "Easy",
  desc: "Calculate late payment fees. Rules: 1-7 days late: $10 or 2% of payment (whichever is less). 8-30 days: $25 or 5% (whichever is less). 30+ days: $40 or 8% (whichever is less). Multiple late periods compound if payment is still unpaid. Return total_fee rounded to 2dp.",
  examples: [
    { input: "payment_amount=200, days_late=10", output: "10.0" },
    { input: "payment_amount=1000, days_late=5", output: "10.0" }
  ],
  constraints: ["payment_amount > 0", "days_late >= 0"],
  functionSignature: "def lateFee(self, payment_amount: float, days_late: int) -> float:",
  starters: {
    Python: "class Solution:\n    def lateFee(self, payment_amount: float, days_late: int) -> float:\n        pass",
    JavaScript: "var lateFee = function(payment_amount, days_late) {\n    \n};",
    TypeScript: "function lateFee(payment_amount: number, days_late: number): number {\n    \n};",
    Java: "class Solution {\n    public double lateFee(double paymentAmount, int daysLate) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    double lateFee(double amount, int daysLate) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.lateFee(200, 10))", expected: "10.0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.lateFee(1000, 5))", expected: "10.0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.lateFee(100, 0))", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.lateFee(100, 35))", expected: "8.0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.lateFee(200, 3))", expected: "4.0", isPublic: false },
  ],
},

"Affirm: Underwriting Decision Tree": {
  company: "affirm", pattern: "Tree / Decision Logic",
  title: "Automated Underwriting Engine",
  difficulty: "Medium",
  desc: "Implement a decision tree for loan underwriting. Given applicant dict with keys: credit_score, annual_income, loan_amount, employment_type ('full_time','part_time','self_employed','unemployed'). Rules: unemployed -> deny. loan_amount > annual_income * 0.5 -> deny. credit_score < 580 -> deny. employment_type=='self_employed' and credit_score < 660 -> deny. Else: credit_score >= 720 -> 'prime', 660-719 -> 'near_prime', else -> 'subprime'. Return dict with 'decision', 'tier' (null if denied), 'rate' (prime:8%, near_prime:15%, subprime:24%, denied:null).",
  examples: [
    { input: "{'credit_score':750,'annual_income':60000,'loan_amount':20000,'employment_type':'full_time'}", output: "{'decision':'approve','tier':'prime','rate':8}" },
    { input: "{'credit_score':500,'annual_income':40000,'loan_amount':10000,'employment_type':'full_time'}", output: "{'decision':'deny','tier':None,'rate':None}" }
  ],
  constraints: ["All fields present"],
  functionSignature: "def underwrite(self, applicant: dict) -> dict:",
  starters: {
    Python: "class Solution:\n    def underwrite(self, applicant: dict) -> dict:\n        pass",
    JavaScript: "var underwrite = function(applicant) {\n    \n};",
    TypeScript: "function underwrite(applicant: Record<string, any>): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> underwrite(Map<String,Object> applicant) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,string> underwrite(map<string,string>& applicant) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.underwrite({'credit_score':750,'annual_income':60000,'loan_amount':20000,'employment_type':'full_time'})['decision'])", expected: "approve", isPublic: true },
    { script: "sol = Solution()\nprint(sol.underwrite({'credit_score':500,'annual_income':40000,'loan_amount':10000,'employment_type':'full_time'})['decision'])", expected: "deny", isPublic: true },
    { script: "sol = Solution()\nprint(sol.underwrite({'credit_score':700,'annual_income':40000,'loan_amount':10000,'employment_type':'unemployed'})['decision'])", expected: "deny", isPublic: false },
    { script: "sol = Solution()\nprint(sol.underwrite({'credit_score':680,'annual_income':60000,'loan_amount':20000,'employment_type':'full_time'})['tier'])", expected: "near_prime", isPublic: false },
    { script: "sol = Solution()\nprint(sol.underwrite({'credit_score':650,'annual_income':60000,'loan_amount':20000,'employment_type':'self_employed'})['decision'])", expected: "deny", isPublic: false },
  ],
},

"Affirm: Loan Amortization Schedule": {
  company: "affirm", pattern: "Finance Math / Simulation",
  title: "Amortization Table Generator",
  difficulty: "Medium",
  desc: "Generate a full amortization schedule. Each payment: interest = remaining_balance * monthly_rate, principal = monthly_payment - interest, remaining = remaining_balance - principal. Return list of [month, payment, principal, interest, balance] all rounded to 2dp.",
  examples: [
    { input: "principal=1000, apr=0.12, months=3", output: "3 rows with correct values" }
  ],
  constraints: ["principal > 0", "apr >= 0", "months >= 1"],
  functionSignature: "def amortizationSchedule(self, principal: float, apr: float, months: int) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def amortizationSchedule(self, principal: float, apr: float, months: int) -> List[List]:\n        pass",
    JavaScript: "var amortizationSchedule = function(principal, apr, months) {\n    \n};",
    TypeScript: "function amortizationSchedule(principal: number, apr: number, months: number): number[][] {\n    \n};",
    Java: "class Solution {\n    public List<double[]> amortizationSchedule(double principal, double apr, int months) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<double>> amortizationSchedule(double p, double apr, int months) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.amortizationSchedule(1000, 0.12, 3)\nprint(len(result))", expected: "3", isPublic: true },
    { script: "sol = Solution()\nresult = sol.amortizationSchedule(1000, 0.0, 4)\nprint(result[0][1])", expected: "250.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.amortizationSchedule(1000, 0.12, 3)\nprint(result[-1][4] <= 0.01)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nresult = sol.amortizationSchedule(1000, 0.12, 3)\nprint(result[0][0])", expected: "1", isPublic: false },
    { script: "sol = Solution()\nresult = sol.amortizationSchedule(1200, 0.12, 12)\nprint(round(result[0][3],2))", expected: "12.0", isPublic: false },
  ],
},

"Affirm: Real-Time Underwriting Signal Aggregator": {
  company: "affirm", pattern: "Streaming / Aggregation",
  title: "Real-Time Risk Signal Aggregator",
  difficulty: "Medium",
  desc: "Process a stream of risk signals [userId, signalType, value, timestamp]. Signal types: 'credit_pull' (value=score), 'bank_balance' (value=dollars), 'income_verify' (value=monthly_income). For each user, maintain latest value per signal type. computeRisk(userId) returns: ratio = latest bank_balance / latest income_verify (if both exist, else None), and whether credit_pull >= 650. Return dict with 'creditOk', 'balanceRatio'.",
  examples: [
    { input: "signals for u1: credit_pull=700, bank_balance=5000, income_verify=3000; computeRisk('u1')", output: "{'creditOk':True,'balanceRatio':1.67}" }
  ],
  constraints: ["userId is non-empty string", "timestamp non-decreasing"],
  functionSignature: "def computeRisk(self, userId: str) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass RiskAggregator:\n    def __init__(self):\n        pass\n\n    def addSignal(self, userId: str, signalType: str, value: float, timestamp: int) -> None:\n        pass\n\n    def computeRisk(self, userId: str) -> dict:\n        pass",
    JavaScript: "class RiskAggregator {\n    constructor() {}\n    addSignal(userId, signalType, value, timestamp) {}\n    computeRisk(userId) { return {}; }\n}",
    TypeScript: "class RiskAggregator {\n    constructor() {}\n    addSignal(userId: string, signalType: string, value: number, timestamp: number): void {}\n    computeRisk(userId: string): Record<string, any> { return {}; }\n}",
    Java: "class RiskAggregator {\n    public void addSignal(String userId, String type, double value, int ts) {}\n    public Map<String,Object> computeRisk(String userId) { return new HashMap<>(); }\n}",
    "C++": "class RiskAggregator {\npublic:\n    void addSignal(string uid, string type, double val, int ts) {}\n    map<string,double> computeRisk(string uid) { return {}; }\n};",
  },
  testCases: [
    { script: "r = RiskAggregator()\nr.addSignal('u1','credit_pull',700,1)\nr.addSignal('u1','bank_balance',5000,2)\nr.addSignal('u1','income_verify',3000,3)\nprint(r.computeRisk('u1')['creditOk'])", expected: "True", isPublic: true },
    { script: "r = RiskAggregator()\nr.addSignal('u1','credit_pull',600,1)\nprint(r.computeRisk('u1')['balanceRatio'])", expected: "None", isPublic: true },
    { script: "r = RiskAggregator()\nr.addSignal('u1','credit_pull',600,1)\nprint(r.computeRisk('u1')['creditOk'])", expected: "False", isPublic: false },
    { script: "r = RiskAggregator()\nr.addSignal('u1','bank_balance',1000,1)\nr.addSignal('u1','income_verify',2000,2)\nprint(round(r.computeRisk('u1')['balanceRatio'],2))", expected: "0.5", isPublic: false },
    { script: "r = RiskAggregator()\nprint(r.computeRisk('unknown')['creditOk'])", expected: "None", isPublic: false },
  ],
},

"Affirm: Virtual Card Number Generator": {
  company: "affirm", pattern: "Luhn Algorithm / String",
  title: "Virtual Card Number Generator and Validator",
  difficulty: "Medium",
  desc: "Generate a virtual 16-digit card number: first 6 digits = BIN (given), next 9 = sequential from counter (zfill 9), last digit = Luhn check digit. Also implement validate(card_number) using Luhn algorithm. Return card number as string.",
  examples: [
    { input: "bin='411111', counter=1", output: "4111110000000018 (example)" }
  ],
  constraints: ["BIN is exactly 6 digits", "counter >= 0"],
  functionSignature: "def generate(self, bin_prefix: str, counter: int) -> str:",
  starters: {
    Python: "class VirtualCardGenerator:\n    def __init__(self, bin_prefix: str):\n        self.bin_prefix = bin_prefix\n        self.counter = 0\n\n    def luhnCheckDigit(self, number: str) -> int:\n        digits = [int(d) for d in number]\n        for i in range(len(digits)-2, -1, -2):\n            digits[i] *= 2\n            if digits[i] > 9: digits[i] -= 9\n        total = sum(digits)\n        return (10 - total % 10) % 10\n\n    def generate(self) -> str:\n        pass\n\n    def validate(self, card_number: str) -> bool:\n        pass",
    JavaScript: "class VirtualCardGenerator {\n    constructor(bin_prefix) { this.bin = bin_prefix; this.counter = 0; }\n    generate() { return ''; }\n    validate(card_number) { return false; }\n}",
    TypeScript: "class VirtualCardGenerator {\n    private counter = 0;\n    constructor(private bin_prefix: string) {}\n    generate(): string { return ''; }\n    validate(card_number: string): boolean { return false; }\n}",
    Java: "class VirtualCardGenerator {\n    public VirtualCardGenerator(String bin) {}\n    public String generate() { return \"\"; }\n    public boolean validate(String card) { return false; }\n}",
    "C++": "class VirtualCardGenerator {\npublic:\n    VirtualCardGenerator(string bin) {}\n    string generate() { return \"\"; }\n    bool validate(string card) { return false; }\n};",
  },
  testCases: [
    { script: "vcg = VirtualCardGenerator('411111')\ncard = vcg.generate()\nprint(len(card))", expected: "16", isPublic: true },
    { script: "vcg = VirtualCardGenerator('411111')\ncard = vcg.generate()\nprint(vcg.validate(card))", expected: "True", isPublic: true },
    { script: "vcg = VirtualCardGenerator('411111')\ncard = vcg.generate()\nprint(card[:6])", expected: "411111", isPublic: false },
    { script: "vcg = VirtualCardGenerator('411111')\nvcg.generate()\ncard2 = vcg.generate()\nprint(vcg.validate(card2))", expected: "True", isPublic: false },
    { script: "vcg = VirtualCardGenerator('411111')\nprint(vcg.validate('1234567890123456'))", expected: "False", isPublic: false },
  ],
},

// =============================================================================
// BREX (15 problems)
// =============================================================================

"Brex: Corporate Card Spend Analytics": {
  company: "brex", pattern: "Hash Map / Aggregation",
  title: "Corporate Spend Analyzer",
  difficulty: "Easy",
  desc: "Given transactions [employee_id, category, amount, date_month], compute: spend by employee, spend by category, top spender, top category, month with highest spend. Return dict with all five keys.",
  examples: [
    { input: "txns=[['e1','travel',500,1],['e2','meals',100,1],['e1','meals',200,2]]", output: "{'byEmployee':{'e1':700,'e2':100},...,'topSpender':'e1','topCategory':'travel',...}" }
  ],
  constraints: ["1 <= txns.length <= 10^4", "amount > 0"],
  functionSignature: "def analyzeSpend(self, txns: List[List]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def analyzeSpend(self, txns: List[List]) -> dict:\n        pass",
    JavaScript: "var analyzeSpend = function(txns) {\n    \n};",
    TypeScript: "function analyzeSpend(txns: any[][]): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> analyzeSpend(List<List<Object>> txns) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> analyzeSpend(vector<tuple<string,string,double,int>>& t) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.analyzeSpend([['e1','travel',500,1],['e2','meals',100,1],['e1','meals',200,2]])\nprint(r['topSpender'])", expected: "e1", isPublic: true },
    { script: "sol = Solution()\nr = sol.analyzeSpend([['e1','travel',500,1],['e2','meals',100,1],['e1','meals',200,2]])\nprint(r['topCategory'])", expected: "travel", isPublic: true },
    { script: "sol = Solution()\nr = sol.analyzeSpend([['e1','travel',500,1],['e2','meals',100,1],['e1','meals',200,2]])\nprint(r['byEmployee']['e1'])", expected: "700", isPublic: false },
    { script: "sol = Solution()\nr = sol.analyzeSpend([['e1','food',100,3],['e2','food',200,3],['e1','tech',50,1]])\nprint(r['topMonth'])", expected: "3", isPublic: false },
    { script: "sol = Solution()\nr = sol.analyzeSpend([['a','x',50,1]])\nprint(r['topSpender'])", expected: "a", isPublic: false },
  ],
},

"Brex: Budget Policy Enforcer": {
  company: "brex", pattern: "Rule Engine / Design",
  title: "Corporate Budget Policy Engine",
  difficulty: "Medium",
  desc: "Enforce budget policies. Each policy has: department, category, monthly_limit, per_transaction_limit. checkTransaction(employee_id, department, category, amount, month) returns 'approved', 'exceeds_transaction_limit', or 'exceeds_monthly_limit'. Track monthly spend per (department, category, month).",
  examples: [
    { input: "policy: eng/travel/monthly=1000/per_txn=300; checkTxn(e1,eng,travel,400,1) -> exceeds_transaction_limit", output: "exceeds_transaction_limit" }
  ],
  constraints: ["policies and transactions are well-formed"],
  functionSignature: "def checkTransaction(self, employee_id: str, department: str, category: str, amount: float, month: int) -> str:",
  starters: {
    Python: "from typing import List\n\nclass BudgetEngine:\n    def __init__(self):\n        self.policies = {}\n        self.spend = {}\n\n    def addPolicy(self, department: str, category: str, monthly_limit: float, per_txn_limit: float) -> None:\n        pass\n\n    def checkTransaction(self, employee_id: str, department: str, category: str, amount: float, month: int) -> str:\n        pass",
    JavaScript: "class BudgetEngine {\n    constructor() { this.policies = {}; this.spend = {}; }\n    addPolicy(dept, cat, monthlyLimit, perTxnLimit) {}\n    checkTransaction(empId, dept, cat, amount, month) { return 'approved'; }\n}",
    TypeScript: "class BudgetEngine {\n    private policies: Record<string, any> = {};\n    private spend: Record<string, number> = {};\n    addPolicy(department: string, category: string, monthly_limit: number, per_txn_limit: number): void {}\n    checkTransaction(employee_id: string, department: string, category: string, amount: number, month: number): string { return 'approved'; }\n}",
    Java: "class BudgetEngine {\n    public void addPolicy(String dept, String cat, double monthlyLimit, double perTxnLimit) {}\n    public String checkTransaction(String emp, String dept, String cat, double amount, int month) { return \"approved\"; }\n}",
    "C++": "class BudgetEngine {\npublic:\n    void addPolicy(string dept, string cat, double ml, double ptl) {}\n    string checkTransaction(string emp, string dept, string cat, double amt, int month) { return \"approved\"; }\n};",
  },
  testCases: [
    { script: "b = BudgetEngine()\nb.addPolicy('eng','travel',1000,300)\nprint(b.checkTransaction('e1','eng','travel',400,1))", expected: "exceeds_transaction_limit", isPublic: true },
    { script: "b = BudgetEngine()\nb.addPolicy('eng','travel',1000,500)\nb.checkTransaction('e1','eng','travel',400,1)\nb.checkTransaction('e1','eng','travel',400,1)\nprint(b.checkTransaction('e1','eng','travel',300,1))", expected: "exceeds_monthly_limit", isPublic: true },
    { script: "b = BudgetEngine()\nb.addPolicy('eng','meals',500,200)\nprint(b.checkTransaction('e1','eng','meals',150,1))", expected: "approved", isPublic: false },
    { script: "b = BudgetEngine()\nprint(b.checkTransaction('e1','eng','travel',100,1))", expected: "approved", isPublic: false },
    { script: "b = BudgetEngine()\nb.addPolicy('sales','hotel',2000,600)\nb.checkTransaction('e1','sales','hotel',600,1)\nb.checkTransaction('e1','sales','hotel',600,1)\nb.checkTransaction('e1','sales','hotel',600,1)\nprint(b.checkTransaction('e1','sales','hotel',300,1))", expected: "exceeds_monthly_limit", isPublic: false },
  ],
},

"Brex: Expense Report Parser": {
  company: "brex", pattern: "String Parsing / Data Processing",
  title: "Expense Report Processor",
  difficulty: "Easy",
  desc: "Parse and validate an expense report CSV string. Each line: 'date,merchant,category,amount,receipt_url'. Validate: date is YYYY-MM-DD, amount > 0, category in valid list ['travel','meals','software','hardware','other']. Return dict with 'valid_entries' (count), 'invalid_entries' (count), 'total_amount', 'by_category'.",
  examples: [
    { input: '"2024-01-15,Marriott,travel,250.00,http://r.co/1\\n2024-01-16,invalid_cat,BAD,50.00,http://r.co/2"', output: "{'valid_entries':1,'invalid_entries':1,'total_amount':250.0,'by_category':{'travel':250.0}}" }
  ],
  constraints: ["CSV may have 0-1000 lines"],
  functionSignature: "def parseExpenseReport(self, csv_data: str) -> dict:",
  starters: {
    Python: "class Solution:\n    def parseExpenseReport(self, csv_data: str) -> dict:\n        pass",
    JavaScript: "var parseExpenseReport = function(csv_data) {\n    \n};",
    TypeScript: "function parseExpenseReport(csv_data: string): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> parseExpenseReport(String csvData) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> parseExpenseReport(string csvData) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.parseExpenseReport('2024-01-15,M,travel,250.00,http://a.co\\n2024-01-16,X,BAD,50.00,http://b.co')\nprint(r['valid_entries'])", expected: "1", isPublic: true },
    { script: "sol = Solution()\nr = sol.parseExpenseReport('2024-01-15,M,travel,250.00,http://a.co\\n2024-01-16,X,BAD,50.00,http://b.co')\nprint(r['invalid_entries'])", expected: "1", isPublic: true },
    { script: "sol = Solution()\nr = sol.parseExpenseReport('2024-01-15,A,meals,100.00,url\\n2024-01-16,B,meals,50.00,url')\nprint(r['by_category']['meals'])", expected: "150.0", isPublic: false },
    { script: "sol = Solution()\nr = sol.parseExpenseReport('')\nprint(r['valid_entries'])", expected: "0", isPublic: false },
    { script: "sol = Solution()\nr = sol.parseExpenseReport('2024-01-15,M,travel,-10.00,url')\nprint(r['invalid_entries'])", expected: "1", isPublic: false },
  ],
},

"Brex: Vendor Payment Batching": {
  company: "brex", pattern: "Greedy / Batch Processing",
  title: "Optimal Payment Batch Scheduler",
  difficulty: "Medium",
  desc: "Given vendor payments [vendor_id, amount, due_date_days] and daily wire limit, batch them optimally. Process by due date (earliest first). Each day, send as many payments as possible within wire limit (sort by amount descending within a day). Return list of [day, vendor_id, amount] in processing order.",
  examples: [
    { input: "payments=[['v1',500,3],['v2',300,3],['v3',400,5]], wire_limit=700", output: "[['v1' or 'v2' first based on amount]...]" }
  ],
  constraints: ["1 <= payments.length <= 1000", "wire_limit > 0"],
  functionSignature: "def scheduleBatch(self, payments: List[List], wire_limit: float) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def scheduleBatch(self, payments: List[List], wire_limit: float) -> List[List]:\n        pass",
    JavaScript: "var scheduleBatch = function(payments, wire_limit) {\n    \n};",
    TypeScript: "function scheduleBatch(payments: any[][], wire_limit: number): any[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Object>> scheduleBatch(List<List<Object>> payments, double wireLimit) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<tuple<int,string,double>> scheduleBatch(vector<tuple<string,double,int>>& p, double limit) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.scheduleBatch([['v1',500,3],['v2',300,3],['v3',400,5]],700)\nprint(len(result))", expected: "3", isPublic: true },
    { script: "sol = Solution()\nresult = sol.scheduleBatch([['v1',500,3],['v2',300,3],['v3',400,5]],700)\nprint(result[0][1])", expected: "v1", isPublic: true },
    { script: "sol = Solution()\nresult = sol.scheduleBatch([['v1',100,1]],500)\nprint(result[0][0])", expected: "1", isPublic: false },
    { script: "sol = Solution()\nresult = sol.scheduleBatch([['v1',800,1]],500)\nprint(result[0][0] > 1)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nresult = sol.scheduleBatch([],500)\nprint(result)", expected: "[]", isPublic: false },
  ],
},

"Brex: Travel Policy Compliance Checker": {
  company: "brex", pattern: "Rule Validation",
  title: "Travel Expense Compliance",
  difficulty: "Easy",
  desc: "Check travel expenses against policy. Policy: flights > $500 need pre-approval; hotel > $250/night needs approval; meals > $75/person needs receipt. Given list of expenses [type, amount, has_approval, has_receipt, persons], return list of compliance issues (strings) for each violation.",
  examples: [
    { input: "expenses=[{'type':'flight','amount':600,'has_approval':False,'has_receipt':True,'persons':1}]", output: "['Flight requires pre-approval']" }
  ],
  constraints: ["type in ['flight','hotel','meal']"],
  functionSignature: "def checkCompliance(self, expenses: List[dict]) -> List[str]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def checkCompliance(self, expenses: List[dict]) -> List[str]:\n        pass",
    JavaScript: "var checkCompliance = function(expenses) {\n    \n};",
    TypeScript: "function checkCompliance(expenses: Record<string, any>[]): string[] {\n    \n};",
    Java: "class Solution {\n    public List<String> checkCompliance(List<Map<String,Object>> expenses) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<string> checkCompliance(vector<map<string,string>>& expenses) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.checkCompliance([{'type':'flight','amount':600,'has_approval':False,'has_receipt':True,'persons':1}]))", expected: "['Flight requires pre-approval']", isPublic: true },
    { script: "sol = Solution()\nprint(sol.checkCompliance([{'type':'flight','amount':400,'has_approval':False,'has_receipt':True,'persons':1}]))", expected: "[]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.checkCompliance([{'type':'hotel','amount':300,'has_approval':False,'has_receipt':True,'persons':1}]))", expected: "['Hotel requires pre-approval']", isPublic: false },
    { script: "sol = Solution()\nprint(sol.checkCompliance([{'type':'meal','amount':100,'has_approval':True,'has_receipt':False,'persons':1}]))", expected: "['Meal requires receipt']", isPublic: false },
    { script: "sol = Solution()\nprint(sol.checkCompliance([{'type':'meal','amount':60,'has_approval':False,'has_receipt':False,'persons':1}]))", expected: "[]", isPublic: false },
  ],
},

"Brex: Cash Flow Forecasting": {
  company: "brex", pattern: "Time Series / Projection",
  title: "30-Day Cash Flow Forecast",
  difficulty: "Medium",
  desc: "Given current_balance, recurring_revenues [[day, amount]] and recurring_expenses [[day, amount]] (both repeat monthly), and one_time_items [[day, amount]] (positive=inflow, negative=outflow), compute daily balance for next 30 days. Return list of [day, balance] and flag days where balance goes negative as 'warning'.",
  examples: [
    { input: "balance=1000, revenues=[[1,500]], expenses=[[15,800]], one_time=[]", output: "day 1 balance=1500, day 15 balance=700 etc." }
  ],
  constraints: ["days 1-30", "amounts can be positive or negative"],
  functionSignature: "def forecast(self, current_balance: float, revenues: List[List], expenses: List[List], one_time: List[List]) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def forecast(self, current_balance: float, revenues: List[List], expenses: List[List], one_time: List[List]) -> List[List]:\n        pass",
    JavaScript: "var forecast = function(current_balance, revenues, expenses, one_time) {\n    \n};",
    TypeScript: "function forecast(current_balance: number, revenues: number[][], expenses: number[][], one_time: number[][]): any[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Object>> forecast(double balance, List<List<Double>> revenues, List<List<Double>> expenses, List<List<Double>> oneTime) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<pair<int,double>> forecast(double bal, vector<pair<int,double>>& r, vector<pair<int,double>>& e, vector<pair<int,double>>& ot) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.forecast(1000,[[1,500]],[[15,800]],[])\nprint(len(result))", expected: "30", isPublic: true },
    { script: "sol = Solution()\nresult = sol.forecast(1000,[[1,500]],[],[])\nprint(result[0][1])", expected: "1500.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.forecast(100,[],[[1,200]],[])\nprint(result[0][1] < 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nresult = sol.forecast(500,[],[[5,200]],[[10,-100]])\nprint(result[4][1])", expected: "300.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.forecast(1000,[],[])\nprint(result[0][0])", expected: "1", isPublic: false },
  ],
},

"Brex: Spend Category Auto-Tagger": {
  company: "brex", pattern: "NLP / String Classification",
  title: "ML-Free Spend Categorizer",
  difficulty: "Easy",
  desc: "Categorize transactions by merchant name using keyword matching with priority (higher priority wins on conflict). Categories with keywords: 'airfare': ['airline','airways','delta','united','southwest','aa'], 'lodging': ['hotel','marriott','hilton','hyatt','airbnb'], 'meals': ['restaurant','cafe','grill','pizza','sushi','doordash'], 'software': ['aws','github','slack','zoom','adobe'], 'other': []. Case-insensitive. Return category string.",
  examples: [
    { input: '"Delta Airlines 1234"', output: '"airfare"' },
    { input: '"Zoom Monthly Subscription"', output: '"software"' }
  ],
  constraints: ["merchant is non-empty string"],
  functionSignature: "def categorize(self, merchant: str) -> str:",
  starters: {
    Python: "class Solution:\n    def categorize(self, merchant: str) -> str:\n        pass",
    JavaScript: "var categorize = function(merchant) {\n    \n};",
    TypeScript: "function categorize(merchant: string): string {\n    \n};",
    Java: "class Solution {\n    public String categorize(String merchant) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    string categorize(string merchant) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.categorize('Delta Airlines 1234'))", expected: "airfare", isPublic: true },
    { script: "sol = Solution()\nprint(sol.categorize('Zoom Monthly Subscription'))", expected: "software", isPublic: true },
    { script: "sol = Solution()\nprint(sol.categorize('Marriott Hotel NYC'))", expected: "lodging", isPublic: false },
    { script: "sol = Solution()\nprint(sol.categorize('Pizza Hut Delivery'))", expected: "meals", isPublic: false },
    { script: "sol = Solution()\nprint(sol.categorize('Unknown Vendor XYZ'))", expected: "other", isPublic: false },
  ],
},

"Brex: Financial Report Aggregator": {
  company: "brex", pattern: "Pivot Table / Aggregation",
  title: "Pivot Spend by Department and Category",
  difficulty: "Medium",
  desc: "Given transactions [dept, category, amount, month], produce a pivot table as nested dict: dept -> category -> total_amount. Also compute row totals (by dept) and column totals (by category). Include 'TOTAL' key for each.",
  examples: [
    { input: "txns=[['eng','travel',100,1],['eng','meals',50,1],['sales','travel',200,2]]", output: "{'eng':{'travel':100,'meals':50,'TOTAL':150},'sales':{'travel':200,'TOTAL':200},'TOTAL':{'travel':300,'meals':50,'TOTAL':350}}" }
  ],
  constraints: ["1 <= txns.length <= 10^4"],
  functionSignature: "def pivotSpend(self, txns: List[List]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def pivotSpend(self, txns: List[List]) -> dict:\n        pass",
    JavaScript: "var pivotSpend = function(txns) {\n    \n};",
    TypeScript: "function pivotSpend(txns: any[][]): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Map<String,Double>> pivotSpend(List<List<Object>> txns) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,map<string,double>> pivotSpend(vector<tuple<string,string,double,int>>& t) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.pivotSpend([['eng','travel',100,1],['eng','meals',50,1],['sales','travel',200,2]])\nprint(r['eng']['TOTAL'])", expected: "150", isPublic: true },
    { script: "sol = Solution()\nr = sol.pivotSpend([['eng','travel',100,1],['eng','meals',50,1],['sales','travel',200,2]])\nprint(r['TOTAL']['travel'])", expected: "300", isPublic: true },
    { script: "sol = Solution()\nr = sol.pivotSpend([['a','x',10,1]])\nprint(r['a']['x'])", expected: "10", isPublic: false },
    { script: "sol = Solution()\nr = sol.pivotSpend([['a','x',10,1],['a','x',5,2]])\nprint(r['a']['x'])", expected: "15", isPublic: false },
    { script: "sol = Solution()\nr = sol.pivotSpend([['a','x',10,1],['b','y',20,1]])\nprint(r['TOTAL']['TOTAL'])", expected: "30", isPublic: false },
  ],
},

// =============================================================================
// JANE STREET (15 problems)
// =============================================================================

"Jane Street: Market Making Spread Calculator": {
  company: "janestreet", pattern: "Finance Math / Statistics",
  title: "Bid-Ask Spread Optimizer",
  difficulty: "Medium",
  desc: "Given historical trade prices and a desired inventory risk parameter, compute optimal bid and ask prices. Mid price = average of last N prices. Spread = 2 * gamma * sigma^2 * T where gamma=risk_aversion(0.1), sigma=std_dev(prices), T=time_horizon(1). bid=mid-spread/2, ask=mid+spread/2. Return dict with 'mid','bid','ask','spread' rounded to 4dp.",
  examples: [
    { input: "prices=[100,101,99,100,102,98], N=6, T=1", output: "calculated values" }
  ],
  constraints: ["len(prices) >= 2", "T > 0"],
  functionSignature: "def computeQuotes(self, prices: List[float], N: int, T: float) -> dict:",
  starters: {
    Python: "from typing import List\nimport math\n\nclass Solution:\n    def computeQuotes(self, prices: List[float], N: int, T: float) -> dict:\n        pass",
    JavaScript: "var computeQuotes = function(prices, N, T) {\n    \n};",
    TypeScript: "function computeQuotes(prices: number[], N: number, T: number): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> computeQuotes(List<Double> prices, int N, double T) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> computeQuotes(vector<double>& prices, int N, double T) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.computeQuotes([100,102,98,100,101,99],6,1)\nprint(r['bid'] < r['mid'] < r['ask'])", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.computeQuotes([100,100,100,100],4,1)\nprint(r['spread'])", expected: "0.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.computeQuotes([100,102,98,100,101,99],6,1)\nprint(round(r['mid'],4))", expected: "100.0", isPublic: false },
    { script: "sol = Solution()\nr = sol.computeQuotes([100,110,90,100],4,1)\nprint(r['spread'] > 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.computeQuotes([100,102],2,1)\nprint(abs(r['ask']-r['bid']) == r['spread'])", expected: "True", isPublic: false },
  ],
},

"Jane Street: Probability Puzzle Solver": {
  company: "janestreet", pattern: "Probability / Math",
  title: "Expected Value Calculator",
  difficulty: "Medium",
  desc: "Given a game: roll an n-sided die. If result >= threshold, you win the result. Otherwise you can roll again (up to max_rolls times total). Find the optimal expected value using dynamic programming. ev[i] = max(expected value from roll i, expected value of rolling again with remaining rolls). Return expected value rounded to 4dp.",
  examples: [
    { input: "n=6, threshold=4, max_rolls=2", output: "4.25", explanation: "With 2 rolls on d6, optimal strategy" },
    { input: "n=6, threshold=4, max_rolls=1", output: "4.0" }
  ],
  constraints: ["n >= 2", "1 <= threshold <= n", "max_rolls >= 1"],
  functionSignature: "def expectedValue(self, n: int, threshold: int, max_rolls: int) -> float:",
  starters: {
    Python: "class Solution:\n    def expectedValue(self, n: int, threshold: int, max_rolls: int) -> float:\n        pass",
    JavaScript: "var expectedValue = function(n, threshold, max_rolls) {\n    \n};",
    TypeScript: "function expectedValue(n: number, threshold: number, max_rolls: number): number {\n    \n};",
    Java: "class Solution {\n    public double expectedValue(int n, int threshold, int maxRolls) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    double expectedValue(int n, int threshold, int maxRolls) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(round(sol.expectedValue(6, 4, 1), 4))", expected: "4.0", isPublic: true },
    { script: "sol = Solution()\nprint(round(sol.expectedValue(6, 4, 2), 4))", expected: "4.25", isPublic: true },
    { script: "sol = Solution()\nprint(round(sol.expectedValue(2, 1, 1), 4))", expected: "1.5", isPublic: false },
    { script: "sol = Solution()\nprint(sol.expectedValue(6, 7, 1))", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nprint(round(sol.expectedValue(6, 1, 1), 4))", expected: "3.5", isPublic: false },
  ],
},

"Jane Street: Arbitrage-Free Pricing": {
  company: "janestreet", pattern: "Finance Math / No-Arbitrage",
  title: "Put-Call Parity Checker",
  difficulty: "Medium",
  desc: "Check put-call parity: C - P = S - K*e^(-r*T) where C=call_price, P=put_price, S=spot_price, K=strike, r=risk_free_rate, T=time_to_expiry. Return dict with 'arbitrage' (bool), 'deviation' (C-P-(S-K*e^(-r*T))), and 'action' ('buy_call_sell_put' if deviation < -tolerance, 'buy_put_sell_call' if > tolerance, else 'no_action'). tolerance=0.01.",
  examples: [
    { input: "C=5, P=3, S=100, K=100, r=0.05, T=1", output: "{'deviation':-2.951,...,'arbitrage':True}" }
  ],
  constraints: ["All prices > 0", "T > 0", "r >= 0"],
  functionSignature: "def checkPutCallParity(self, C: float, P: float, S: float, K: float, r: float, T: float) -> dict:",
  starters: {
    Python: "import math\n\nclass Solution:\n    def checkPutCallParity(self, C: float, P: float, S: float, K: float, r: float, T: float) -> dict:\n        pass",
    JavaScript: "var checkPutCallParity = function(C, P, S, K, r, T) {\n    \n};",
    TypeScript: "function checkPutCallParity(C: number, P: number, S: number, K: number, r: number, T: number): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> checkPutCallParity(double C, double P, double S, double K, double r, double T) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> checkPutCallParity(double C, double P, double S, double K, double r, double T) {\n        \n    }\n};",
  },
  testCases: [
    { script: "import math\nsol = Solution()\nr = sol.checkPutCallParity(10,10,100,100,0.05,1)\nprint(r['arbitrage'])", expected: "False", isPublic: true },
    { script: "import math\nsol = Solution()\nr = sol.checkPutCallParity(5,3,100,100,0.05,1)\nprint(r['arbitrage'])", expected: "True", isPublic: true },
    { script: "import math\nsol = Solution()\nr = sol.checkPutCallParity(10,10,100,100,0.05,1)\nprint(r['action'])", expected: "no_action", isPublic: false },
    { script: "import math\nsol = Solution()\nr = sol.checkPutCallParity(5,10,100,100,0.05,1)\nprint(r['action'])", expected: "buy_call_sell_put", isPublic: false },
    { script: "import math\nsol = Solution()\nr = sol.checkPutCallParity(15,5,100,100,0.05,1)\nprint(r['action'])", expected: "buy_put_sell_call", isPublic: false },
  ],
},

"Jane Street: Statistical Arbitrage Signal": {
  company: "janestreet", pattern: "Statistics / Z-Score",
  title: "Pairs Trading Z-Score Calculator",
  difficulty: "Medium",
  desc: "Given price series for two assets (equal length), compute: spread = price_A - hedge_ratio * price_B where hedge_ratio = cov(A,B)/var(B). Then z_score = (spread[-1] - mean(spread)) / std(spread). Return dict with 'hedge_ratio', 'z_score', 'signal' ('long_spread' if z<-2, 'short_spread' if z>2, 'neutral' otherwise). Round to 4dp.",
  examples: [
    { input: "pricesA=[100,101,99,100,102], pricesB=[50,51,49,50,51]", output: "z_score near 0 as they're correlated" }
  ],
  constraints: ["len(pricesA) == len(pricesB) >= 5"],
  functionSignature: "def pairsSignal(self, pricesA: List[float], pricesB: List[float]) -> dict:",
  starters: {
    Python: "from typing import List\nimport statistics\n\nclass Solution:\n    def pairsSignal(self, pricesA: List[float], pricesB: List[float]) -> dict:\n        pass",
    JavaScript: "var pairsSignal = function(pricesA, pricesB) {\n    \n};",
    TypeScript: "function pairsSignal(pricesA: number[], pricesB: number[]): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> pairsSignal(List<Double> pricesA, List<Double> pricesB) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> pairsSignal(vector<double>& a, vector<double>& b) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.pairsSignal([100,101,99,100,102],[50,51,49,50,51])\nprint('signal' in r)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.pairsSignal([100,100,100,100,100],[50,50,50,50,50])\nprint(r['signal'])", expected: "neutral", isPublic: true },
    { script: "sol = Solution()\nr = sol.pairsSignal([100,101,99,100,102],[50,51,49,50,51])\nprint(r['signal'] in ['long_spread','short_spread','neutral'])", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.pairsSignal([100,100,100,100,100],[50,50,50,50,50])\nprint(r['hedge_ratio'])", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nr = sol.pairsSignal([100,102,98,100,104],[50,51,49,50,52])\nprint(isinstance(r['z_score'], float))", expected: "True", isPublic: false },
  ],
},

"Jane Street: Options Greek Calculator": {
  company: "janestreet", pattern: "Numerical Methods / Finance",
  title: "Black-Scholes Greeks",
  difficulty: "Hard",
  desc: "Calculate Black-Scholes option delta for a European call/put. d1 = (ln(S/K) + (r + sigma^2/2)*T) / (sigma*sqrt(T)). Delta_call = N(d1), Delta_put = N(d1) - 1 where N is standard normal CDF. Approximate N(x) using: if x>=0: 0.5+0.5*erf(x/sqrt(2)), else symmetry. Return dict with 'd1','delta','type'.",
  examples: [
    { input: "S=100, K=100, r=0.05, sigma=0.2, T=1, option_type='call'", output: "{'d1':0.35,'delta':0.637,'type':'call'}" }
  ],
  constraints: ["S,K,sigma,T > 0", "option_type in ['call','put']"],
  functionSignature: "def blackScholesDelta(self, S: float, K: float, r: float, sigma: float, T: float, option_type: str) -> dict:",
  starters: {
    Python: "import math\n\nclass Solution:\n    def blackScholesDelta(self, S: float, K: float, r: float, sigma: float, T: float, option_type: str) -> dict:\n        pass",
    JavaScript: "var blackScholesDelta = function(S, K, r, sigma, T, option_type) {\n    \n};",
    TypeScript: "function blackScholesDelta(S: number, K: number, r: number, sigma: number, T: number, option_type: string): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> blackScholesDelta(double S, double K, double r, double sigma, double T, String type) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> blackScholesDelta(double S, double K, double r, double sigma, double T, string type) {\n        \n    }\n};",
  },
  testCases: [
    { script: "import math\nsol = Solution()\nr = sol.blackScholesDelta(100,100,0.05,0.2,1,'call')\nprint(0 < r['delta'] < 1)", expected: "True", isPublic: true },
    { script: "import math\nsol = Solution()\nr = sol.blackScholesDelta(100,100,0.05,0.2,1,'put')\nprint(-1 < r['delta'] < 0)", expected: "True", isPublic: true },
    { script: "import math\nsol = Solution()\nr_call = sol.blackScholesDelta(100,100,0.05,0.2,1,'call')\nr_put = sol.blackScholesDelta(100,100,0.05,0.2,1,'put')\nprint(round(r_call['delta']+abs(r_put['delta']),1))", expected: "1.0", isPublic: false },
    { script: "import math\nsol = Solution()\nr = sol.blackScholesDelta(100,100,0.05,0.2,1,'call')\nprint(round(r['delta'],2))", expected: "0.64", isPublic: false },
    { script: "import math\nsol = Solution()\nr = sol.blackScholesDelta(100,200,0.05,0.2,1,'call')\nprint(r['delta'] < 0.1)", expected: "True", isPublic: false },
  ],
},

"Jane Street: Order Flow Imbalance Detector": {
  company: "janestreet", pattern: "Streaming / Statistics",
  title: "Order Flow Imbalance",
  difficulty: "Medium",
  desc: "Given a stream of orders [side('buy'/'sell'), quantity, timestamp], compute order flow imbalance (OFI) for rolling windows. OFI = (buy_volume - sell_volume) / total_volume for last N seconds. If total_volume = 0, return 0. Return OFI for each timestamp query. Positive OFI -> buying pressure, negative -> selling.",
  examples: [
    { input: "orders=[['buy',100,1],['sell',60,2],['buy',50,3]], window=5, query_ts=3", output: "0.4737..." }
  ],
  constraints: ["1 <= orders.length <= 10^4", "window >= 1"],
  functionSignature: "def computeOFI(self, orders: List[List], window: int, query_ts: int) -> float:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def computeOFI(self, orders: List[List], window: int, query_ts: int) -> float:\n        pass",
    JavaScript: "var computeOFI = function(orders, window, query_ts) {\n    \n};",
    TypeScript: "function computeOFI(orders: any[][], window: number, query_ts: number): number {\n    \n};",
    Java: "class Solution {\n    public double computeOFI(List<List<Object>> orders, int window, int queryTs) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    double computeOFI(vector<tuple<string,int,int>>& orders, int window, int queryTs) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(round(sol.computeOFI([['buy',100,1],['sell',60,2],['buy',50,3]],5,3),4))", expected: "0.4737", isPublic: true },
    { script: "sol = Solution()\nprint(sol.computeOFI([],5,1))", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.computeOFI([['buy',100,1]],5,1))", expected: "1.0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.computeOFI([['sell',100,1]],5,1))", expected: "-1.0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.computeOFI([['buy',100,1],['buy',100,2]],5,2))", expected: "1.0", isPublic: false },
  ],
},

"Jane Street: Kelly Criterion Calculator": {
  company: "janestreet", pattern: "Finance Math / Optimization",
  title: "Kelly Criterion Bet Sizing",
  difficulty: "Easy",
  desc: "Calculate optimal bet size using Kelly criterion. f* = (bp - q) / b where b=odds (profit per unit bet), p=probability of win, q=1-p. For continuous Kelly with multiple outcomes: f* = sum(p_i * b_i) / var(b_i). Implement simple Kelly: given p (win probability) and b (decimal odds), return fraction of bankroll to bet. Cap at 1.0 and floor at 0.",
  examples: [
    { input: "p=0.6, b=1.0", output: "0.2" },
    { input: "p=0.4, b=1.0", output: "0.0" }
  ],
  constraints: ["0 < p < 1", "b > 0"],
  functionSignature: "def kellyCriterion(self, p: float, b: float) -> float:",
  starters: {
    Python: "class Solution:\n    def kellyCriterion(self, p: float, b: float) -> float:\n        pass",
    JavaScript: "var kellyCriterion = function(p, b) {\n    \n};",
    TypeScript: "function kellyCriterion(p: number, b: number): number {\n    \n};",
    Java: "class Solution {\n    public double kellyCriterion(double p, double b) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    double kellyCriterion(double p, double b) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(round(sol.kellyCriterion(0.6, 1.0), 4))", expected: "0.2", isPublic: true },
    { script: "sol = Solution()\nprint(round(sol.kellyCriterion(0.4, 1.0), 4))", expected: "0.0", isPublic: true },
    { script: "sol = Solution()\nprint(round(sol.kellyCriterion(0.5, 1.0), 4))", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nprint(round(sol.kellyCriterion(0.7, 2.0), 4))", expected: "0.55", isPublic: false },
    { script: "sol = Solution()\nprint(sol.kellyCriterion(0.99, 0.01) <= 1.0)", expected: "True", isPublic: false },
  ],
},

"Jane Street: Market Impact Estimator": {
  company: "janestreet", pattern: "Finance / Algorithmic Trading",
  title: "Square Root Market Impact Model",
  difficulty: "Medium",
  desc: "Estimate market impact of a trade using the square root model: impact = sigma * sqrt(participation_rate) * sign(direction) where participation_rate = order_size / avg_daily_volume, sigma = daily_volatility. direction: +1 for buy, -1 for sell. Also compute VWAP drift: drift = mid_price * (1 + impact). Return dict with 'impact_bps' (impact in basis points), 'expected_vwap'.",
  examples: [
    { input: "order_size=10000, adv=1000000, sigma=0.01, mid_price=100, side='buy'", output: "{'impact_bps':10.0,'expected_vwap':100.1}" }
  ],
  constraints: ["order_size, adv, sigma, mid_price > 0", "side in ['buy','sell']"],
  functionSignature: "def estimateImpact(self, order_size: float, adv: float, sigma: float, mid_price: float, side: str) -> dict:",
  starters: {
    Python: "import math\n\nclass Solution:\n    def estimateImpact(self, order_size: float, adv: float, sigma: float, mid_price: float, side: str) -> dict:\n        pass",
    JavaScript: "var estimateImpact = function(order_size, adv, sigma, mid_price, side) {\n    \n};",
    TypeScript: "function estimateImpact(order_size: number, adv: number, sigma: number, mid_price: number, side: string): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> estimateImpact(double orderSize, double adv, double sigma, double midPrice, String side) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> estimateImpact(double os, double adv, double sigma, double mid, string side) {\n        \n    }\n};",
  },
  testCases: [
    { script: "import math\nsol = Solution()\nresult = sol.estimateImpact(10000,1000000,0.01,100,'buy')\nprint(round(result['impact_bps'],1))", expected: "10.0", isPublic: true },
    { script: "import math\nsol = Solution()\nresult = sol.estimateImpact(10000,1000000,0.01,100,'sell')\nprint(result['expected_vwap'] < 100)", expected: "True", isPublic: true },
    { script: "import math\nsol = Solution()\nresult = sol.estimateImpact(100000,1000000,0.01,100,'buy')\nprint(result['impact_bps'] > 10)", expected: "True", isPublic: false },
    { script: "import math\nsol = Solution()\nresult = sol.estimateImpact(0.0001,1000000,0.01,100,'buy')\nprint(result['impact_bps'] < 1)", expected: "True", isPublic: false },
    { script: "import math\nsol = Solution()\nresult = sol.estimateImpact(10000,1000000,0.02,200,'buy')\nprint(result['impact_bps'] > 0)", expected: "True", isPublic: false },
  ],
},

"Jane Street: Convex Hull of Trade Prices": {
  company: "janestreet", pattern: "Geometry / Computational",
  title: "Trade Price Upper Envelope",
  difficulty: "Hard",
  desc: "Given trade data points [time, price], find the upper convex hull (monotone chain). The upper hull identifies the maximum achievable prices. Return the time,price pairs forming the upper hull in left-to-right order.",
  examples: [
    { input: "trades=[[1,100],[2,110],[3,105],[4,115],[5,108]]", output: "[[1,100],[2,110],[4,115]]" }
  ],
  constraints: ["2 <= trades.length <= 10^4", "time values are distinct"],
  functionSignature: "def upperHull(self, trades: List[List]) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def upperHull(self, trades: List[List]) -> List[List]:\n        pass",
    JavaScript: "var upperHull = function(trades) {\n    \n};",
    TypeScript: "function upperHull(trades: number[][]): number[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Integer>> upperHull(List<List<Integer>> trades) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<int>> upperHull(vector<vector<int>>& trades) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.upperHull([[1,100],[2,110],[3,105],[4,115],[5,108]]))", expected: "[[1, 100], [2, 110], [4, 115]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.upperHull([[1,100],[2,200]]))", expected: "[[1, 100], [2, 200]]", isPublic: true },
    { script: "sol = Solution()\nresult = sol.upperHull([[1,100],[2,50],[3,100]])\nprint(result[0][0])", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.upperHull([[1,1],[2,2],[3,3]]))", expected: "[[1, 1], [3, 3]]", isPublic: false },
    { script: "sol = Solution()\nresult = sol.upperHull([[1,5],[2,1],[3,4],[4,2],[5,5]])\nprint(len(result) >= 2)", expected: "True", isPublic: false },
  ],
},

"Jane Street: Optimal Execution TWAP": {
  company: "janestreet", pattern: "Algorithmic Trading / Math",
  title: "TWAP Order Execution Slicer",
  difficulty: "Easy",
  desc: "Split a large order into equal time-weighted slices for TWAP (Time Weighted Average Price) execution. Given total_shares, start_time, end_time, num_slices, return list of [execution_time, shares_to_trade]. Distribute remainder to first slice.",
  examples: [
    { input: "total=1000, start=9, end=16, slices=4", output: "[[9.0,250],[10.75,250],[12.5,250],[14.25,250]]" },
    { input: "total=101, start=0, end=10, slices=3", output: "[[0,34],[3.33,33],[6.67,33]]" }
  ],
  constraints: ["total >= slices", "start < end", "slices >= 1"],
  functionSignature: "def twapSlices(self, total: int, start: float, end: float, slices: int) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def twapSlices(self, total: int, start: float, end: float, slices: int) -> List[List]:\n        pass",
    JavaScript: "var twapSlices = function(total, start, end, slices) {\n    \n};",
    TypeScript: "function twapSlices(total: number, start: number, end: number, slices: number): any[][] {\n    \n};",
    Java: "class Solution {\n    public List<double[]> twapSlices(int total, double start, double end, int slices) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<pair<double,int>> twapSlices(int total, double start, double end, int slices) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.twapSlices(1000, 9, 16, 4)\nprint(len(result))", expected: "4", isPublic: true },
    { script: "sol = Solution()\nresult = sol.twapSlices(1000, 9, 16, 4)\nprint(sum(r[1] for r in result))", expected: "1000", isPublic: true },
    { script: "sol = Solution()\nresult = sol.twapSlices(101, 0, 10, 3)\nprint(sum(r[1] for r in result))", expected: "101", isPublic: false },
    { script: "sol = Solution()\nresult = sol.twapSlices(100, 0, 100, 1)\nprint(result[0][1])", expected: "100", isPublic: false },
    { script: "sol = Solution()\nresult = sol.twapSlices(1000, 9, 16, 4)\nprint(result[0][0])", expected: "9.0", isPublic: false },
  ],
},

// =============================================================================
// CITADEL (15 problems)
// =============================================================================

"Citadel: High-Frequency Trade Signal": {
  company: "citadel", pattern: "Signal Processing / Statistics",
  title: "Momentum Signal Generator",
  difficulty: "Medium",
  desc: "Compute momentum signal for a price series. momentum(t) = (price[t] - price[t-lookback]) / price[t-lookback]. Then z-score normalize the momentum series: z = (x - mean) / std. Return signal for the last element: 'long' if z > 1, 'short' if z < -1, 'neutral' otherwise. Also return the z-score.",
  examples: [
    { input: "prices=[100,101,102,100,103,105], lookback=2", output: "{'z_score': ..., 'signal': ...}" }
  ],
  constraints: ["len(prices) > lookback + 1", "lookback >= 1"],
  functionSignature: "def momentumSignal(self, prices: List[float], lookback: int) -> dict:",
  starters: {
    Python: "from typing import List\nimport statistics\n\nclass Solution:\n    def momentumSignal(self, prices: List[float], lookback: int) -> dict:\n        pass",
    JavaScript: "var momentumSignal = function(prices, lookback) {\n    \n};",
    TypeScript: "function momentumSignal(prices: number[], lookback: number): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> momentumSignal(List<Double> prices, int lookback) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> momentumSignal(vector<double>& prices, int lookback) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.momentumSignal([100,100,100,100,100,100],2)\nprint(r['signal'])", expected: "neutral", isPublic: true },
    { script: "sol = Solution()\nr = sol.momentumSignal([100,102,104,106,108,110],1)\nprint(r['signal'] in ['long','neutral','short'])", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.momentumSignal([110,108,106,104,102,100],1)\nprint(r['z_score'] < 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.momentumSignal([100,100,100,100,100,120],2)\nprint(r['signal'])", expected: "long", isPublic: false },
    { script: "sol = Solution()\nr = sol.momentumSignal([120,100,100,100,100,100],2)\nprint(r['signal'])", expected: "short", isPublic: false },
  ],
},

"Citadel: Portfolio Variance Calculator": {
  company: "citadel", pattern: "Linear Algebra / Finance",
  title: "Portfolio Variance and Sharpe Ratio",
  difficulty: "Medium",
  desc: "Given weights list, returns list (daily returns per asset, equal length), compute portfolio: daily_returns = sum(w*r for w,r in zip(weights, returns_matrix)). Then compute annualized_return = mean(daily_port_returns)*252, annualized_vol = std(daily_port_returns)*sqrt(252), sharpe = annualized_return/annualized_vol. Return dict rounded to 4dp.",
  examples: [
    { input: "weights=[0.6,0.4], returns=[[0.01,-0.01,0.005],[-0.005,0.01,-0.002]]", output: "dict with sharpe ratio" }
  ],
  constraints: ["len(weights) == len(returns)", "sum(weights) == 1"],
  functionSignature: "def portfolioStats(self, weights: List[float], returns: List[List[float]]) -> dict:",
  starters: {
    Python: "from typing import List\nimport math, statistics\n\nclass Solution:\n    def portfolioStats(self, weights: List[float], returns: List[List[float]]) -> dict:\n        pass",
    JavaScript: "var portfolioStats = function(weights, returns) {\n    \n};",
    TypeScript: "function portfolioStats(weights: number[], returns: number[][]): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> portfolioStats(List<Double> weights, List<List<Double>> returns) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> portfolioStats(vector<double>& w, vector<vector<double>>& r) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.portfolioStats([1.0],[[0.01,0.02,0.01]])\nprint('sharpe' in r)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.portfolioStats([1.0],[[0.01,0.01,0.01]])\nprint(r['annualized_vol'])", expected: "0.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.portfolioStats([0.5,0.5],[[0.01,-0.01,0.01],[-0.01,0.01,-0.01]])\nprint(r['annualized_return'])", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nr = sol.portfolioStats([1.0],[[0.001]*252])\nprint(round(r['annualized_return'],4))", expected: "0.252", isPublic: false },
    { script: "sol = Solution()\nr = sol.portfolioStats([1.0],[[0.01,0.02,0.03]])\nprint(r['annualized_return'] > 0)", expected: "True", isPublic: false },
  ],
},

"Citadel: Limit Order Book Snapshot": {
  company: "citadel", pattern: "Sorted Map / Design",
  title: "Order Book Level 2 Snapshot",
  difficulty: "Hard",
  desc: "Maintain an L2 order book. addOrder(side, price, quantity) adds/updates a price level. removeOrder(side, price) removes it. getTopN(side, n) returns top N price levels for that side (highest bids first, lowest asks first) as [[price, quantity]] pairs. Track total quantity per price level.",
  examples: [
    { input: "addOrder('bid',100,500), addOrder('bid',99,300), getTopN('bid',2)", output: "[[100,500],[99,300]]" }
  ],
  constraints: ["side in ['bid','ask']", "n >= 1"],
  functionSignature: "def getTopN(self, side: str, n: int) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass OrderBook:\n    def __init__(self):\n        self.bids = {}\n        self.asks = {}\n\n    def addOrder(self, side: str, price: float, quantity: int) -> None:\n        pass\n\n    def removeOrder(self, side: str, price: float) -> None:\n        pass\n\n    def getTopN(self, side: str, n: int) -> List[List]:\n        pass",
    JavaScript: "class OrderBook {\n    constructor() { this.bids = {}; this.asks = {}; }\n    addOrder(side, price, quantity) {}\n    removeOrder(side, price) {}\n    getTopN(side, n) { return []; }\n}",
    TypeScript: "class OrderBook {\n    private bids: Record<number, number> = {};\n    private asks: Record<number, number> = {};\n    addOrder(side: string, price: number, quantity: number): void {}\n    removeOrder(side: string, price: number): void {}\n    getTopN(side: string, n: number): number[][] { return []; }\n}",
    Java: "class OrderBook {\n    public void addOrder(String side, double price, int qty) {}\n    public void removeOrder(String side, double price) {}\n    public List<double[]> getTopN(String side, int n) { return new ArrayList<>(); }\n}",
    "C++": "class OrderBook {\npublic:\n    void addOrder(string side, double price, int qty) {}\n    void removeOrder(string side, double price) {}\n    vector<pair<double,int>> getTopN(string side, int n) { return {}; }\n};",
  },
  testCases: [
    { script: "ob = OrderBook()\nob.addOrder('bid',100,500)\nob.addOrder('bid',99,300)\nprint(ob.getTopN('bid',2))", expected: "[[100, 500], [99, 300]]", isPublic: true },
    { script: "ob = OrderBook()\nob.addOrder('ask',101,400)\nob.addOrder('ask',102,200)\nprint(ob.getTopN('ask',2))", expected: "[[101, 400], [102, 200]]", isPublic: true },
    { script: "ob = OrderBook()\nob.addOrder('bid',100,500)\nob.removeOrder('bid',100)\nprint(ob.getTopN('bid',1))", expected: "[]", isPublic: false },
    { script: "ob = OrderBook()\nob.addOrder('bid',100,500)\nob.addOrder('bid',100,300)\nprint(ob.getTopN('bid',1)[0][1])", expected: "800", isPublic: false },
    { script: "ob = OrderBook()\nfor p in [99,100,101,102,103]:\n    ob.addOrder('bid',p,p*10)\nprint(ob.getTopN('bid',3)[0][0])", expected: "103", isPublic: false },
  ],
},

"Citadel: Risk-Adjusted Return Ranker": {
  company: "citadel", pattern: "Sorting / Finance",
  title: "Rank Assets by Risk-Adjusted Returns",
  difficulty: "Easy",
  desc: "Given assets [name, expected_return, volatility, beta], compute Sharpe ratio = expected_return/volatility and Treynor ratio = expected_return/beta for each. Rank by Sharpe descending. Return list of [name, sharpe, treynor] sorted by sharpe descending, rounded to 4dp.",
  examples: [
    { input: "assets=[['A',0.12,0.15,1.2],['B',0.10,0.08,0.8]]", output: "[['B',1.25,0.125],['A',0.8,0.1]]" }
  ],
  constraints: ["volatility > 0", "beta > 0"],
  functionSignature: "def rankAssets(self, assets: List[List]) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def rankAssets(self, assets: List[List]) -> List[List]:\n        pass",
    JavaScript: "var rankAssets = function(assets) {\n    \n};",
    TypeScript: "function rankAssets(assets: any[][]): any[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Object>> rankAssets(List<List<Object>> assets) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<tuple<string,double,double>> rankAssets(vector<tuple<string,double,double,double>>& assets) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.rankAssets([['A',0.12,0.15,1.2],['B',0.10,0.08,0.8]])\nprint(result[0][0])", expected: "B", isPublic: true },
    { script: "sol = Solution()\nresult = sol.rankAssets([['A',0.10,0.10,1.0]])\nprint(round(result[0][1],4))", expected: "1.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.rankAssets([['A',0.12,0.15,1.2],['B',0.10,0.08,0.8]])\nprint(len(result))", expected: "2", isPublic: false },
    { script: "sol = Solution()\nresult = sol.rankAssets([['X',0.20,0.10,2.0],['Y',0.05,0.20,0.5]])\nprint(result[0][0])", expected: "X", isPublic: false },
    { script: "sol = Solution()\nresult = sol.rankAssets([['A',0.10,0.10,2.0]])\nprint(round(result[0][2],4))", expected: "0.05", isPublic: false },
  ],
},

"Citadel: Greeks Hedging Calculator": {
  company: "citadel", pattern: "Finance / Optimization",
  title: "Delta-Gamma Hedging",
  difficulty: "Hard",
  desc: "Given a portfolio with total delta D and gamma G, and available hedging instruments (each with [name, delta_per_unit, gamma_per_unit, cost_per_unit]), find the minimum cost combination of instruments to hedge: bring portfolio delta within [-tol, tol] and gamma within [-tol, tol]. Use greedy: first hedge gamma (instrument with highest gamma/cost), then delta. Return [list of [instrument, units], total_cost].",
  examples: [
    { input: "D=100, G=50, instruments=[['opt',0.5,1.0,10]], tol=1", output: "example hedge" }
  ],
  constraints: ["tol > 0", "instruments.length >= 1"],
  functionSignature: "def hedgePortfolio(self, D: float, G: float, instruments: List[List], tol: float) -> List:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def hedgePortfolio(self, D: float, G: float, instruments: List[List], tol: float) -> List:\n        pass",
    JavaScript: "var hedgePortfolio = function(D, G, instruments, tol) {\n    \n};",
    TypeScript: "function hedgePortfolio(D: number, G: number, instruments: any[][], tol: number): any[] {\n    \n};",
    Java: "class Solution {\n    public List<Object> hedgePortfolio(double D, double G, List<List<Object>> instruments, double tol) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    pair<vector<pair<string,double>>,double> hedgePortfolio(double D, double G, vector<tuple<string,double,double,double>>& inst, double tol) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.hedgePortfolio(0,0,[['opt',0.5,1.0,10]],1)\nprint(result[1])", expected: "0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.hedgePortfolio(100,0,[['stock',1.0,0.0,50]],1)\nprint(result[1] > 0)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nresult = sol.hedgePortfolio(0,50,[['opt',0.5,1.0,10]],1)\nprint(len(result[0]) > 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nresult = sol.hedgePortfolio(100,50,[['opt',0.5,1.0,10]],1)\nprint(isinstance(result[1], (int,float)))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nresult = sol.hedgePortfolio(0,0,[],1)\nprint(result[1])", expected: "0", isPublic: false },
  ],
},

"Citadel: Quant Research Backtester": {
  company: "citadel", pattern: "Simulation / Finance",
  title: "Simple Strategy Backtester",
  difficulty: "Hard",
  desc: "Backtest a simple moving average crossover strategy. Given prices list, short_window, long_window: generate signal = 1 (long) when short_MA > long_MA, -1 (short) otherwise. Compute: daily PnL = signal[t-1] * (price[t] - price[t-1]). Return dict: 'total_pnl', 'num_trades' (signal changes), 'max_drawdown' (max peak-to-trough in cumulative PnL), 'final_positions'.",
  examples: [
    { input: "prices=[10,11,12,11,13,14], short_w=2, long_w=3", output: "dict with pnl stats" }
  ],
  constraints: ["len(prices) > long_window", "short_window < long_window"],
  functionSignature: "def backtest(self, prices: List[float], short_window: int, long_window: int) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def backtest(self, prices: List[float], short_window: int, long_window: int) -> dict:\n        pass",
    JavaScript: "var backtest = function(prices, short_window, long_window) {\n    \n};",
    TypeScript: "function backtest(prices: number[], short_window: number, long_window: number): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> backtest(List<Double> prices, int shortW, int longW) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> backtest(vector<double>& prices, int sw, int lw) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.backtest([10,11,12,11,13,14],2,3)\nprint('total_pnl' in r)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.backtest([10,10,10,10,10],2,3)\nprint(r['total_pnl'])", expected: "0.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.backtest([10,11,12,11,13,14],2,3)\nprint(isinstance(r['num_trades'],int))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.backtest([10,11,12,11,13,14],2,3)\nprint(r['max_drawdown'] >= 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.backtest([10,9,8,7,6,5],2,3)\nprint(r['total_pnl'] < 0 or r['total_pnl'] >= 0)", expected: "True", isPublic: false },
  ],
},

"Citadel: Volatility Surface Interpolator": {
  company: "citadel", pattern: "Numerical Methods / Interpolation",
  title: "Implied Volatility Surface",
  difficulty: "Hard",
  desc: "Given known implied volatility points [[strike, expiry, iv]] and a query [strike, expiry], bilinearly interpolate the IV. Find the 4 surrounding grid points and interpolate. If query is outside the known grid, extrapolate using nearest edge. Return interpolated IV rounded to 4dp.",
  examples: [
    { input: "points=[[100,1,0.2],[110,1,0.22],[100,2,0.21],[110,2,0.23]], query=[105,1.5]", output: "0.215" }
  ],
  constraints: ["at least 4 points forming a grid", "query within or near the grid"],
  functionSignature: "def interpolateIV(self, points: List[List], query: List[float]) -> float:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def interpolateIV(self, points: List[List], query: List[float]) -> float:\n        pass",
    JavaScript: "var interpolateIV = function(points, query) {\n    \n};",
    TypeScript: "function interpolateIV(points: number[][], query: number[]): number {\n    \n};",
    Java: "class Solution {\n    public double interpolateIV(List<List<Double>> points, List<Double> query) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    double interpolateIV(vector<vector<double>>& points, vector<double>& query) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(round(sol.interpolateIV([[100,1,0.2],[110,1,0.22],[100,2,0.21],[110,2,0.23]],[105,1.5]),4))", expected: "0.215", isPublic: true },
    { script: "sol = Solution()\nprint(round(sol.interpolateIV([[100,1,0.2],[110,1,0.2],[100,2,0.2],[110,2,0.2]],[105,1.5]),4))", expected: "0.2", isPublic: true },
    { script: "sol = Solution()\nprint(round(sol.interpolateIV([[100,1,0.2],[110,1,0.22],[100,2,0.21],[110,2,0.23]],[100,1]),4))", expected: "0.2", isPublic: false },
    { script: "sol = Solution()\nprint(round(sol.interpolateIV([[100,1,0.2],[110,1,0.22],[100,2,0.21],[110,2,0.23]],[110,2]),4))", expected: "0.23", isPublic: false },
    { script: "sol = Solution()\nresult = sol.interpolateIV([[100,1,0.2],[110,1,0.22],[100,2,0.21],[110,2,0.23]],[105,1])\nprint(round(result,4))", expected: "0.21", isPublic: false },
  ],
},

// =============================================================================
// TWO SIGMA (15 problems)
// =============================================================================

"Two Sigma: Time Series Anomaly Detection": {
  company: "twosigma", pattern: "Statistics / Anomaly Detection",
  title: "Z-Score Anomaly Detector",
  difficulty: "Medium",
  desc: "Given a time series and window size, detect anomalies. For each point, compute rolling z-score using previous `window` points. If |z_score| > threshold, it is an anomaly. Return list of indices where anomalies occur. Use sample std (ddof=1).",
  examples: [
    { input: "series=[10,10,10,10,50,10,10], window=4, threshold=2.0", output: "[4]" }
  ],
  constraints: ["len(series) > window", "threshold > 0"],
  functionSignature: "def detectAnomalies(self, series: List[float], window: int, threshold: float) -> List[int]:",
  starters: {
    Python: "from typing import List\nimport statistics\n\nclass Solution:\n    def detectAnomalies(self, series: List[float], window: int, threshold: float) -> List[int]:\n        pass",
    JavaScript: "var detectAnomalies = function(series, window, threshold) {\n    \n};",
    TypeScript: "function detectAnomalies(series: number[], window: number, threshold: number): number[] {\n    \n};",
    Java: "class Solution {\n    public List<Integer> detectAnomalies(List<Double> series, int window, double threshold) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> detectAnomalies(vector<double>& series, int window, double threshold) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.detectAnomalies([10,10,10,10,50,10,10],4,2.0))", expected: "[4]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.detectAnomalies([1,1,1,1,1,1],3,2.0))", expected: "[]", isPublic: true },
    { script: "sol = Solution()\nresult = sol.detectAnomalies([0,0,0,0,100,0,0,0],4,2.0)\nprint(4 in result)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.detectAnomalies([10,20,30,40,50],4,3.0))", expected: "[]", isPublic: false },
    { script: "sol = Solution()\nresult = sol.detectAnomalies([10,10,10,10,-50,10,10],4,2.0)\nprint(4 in result)", expected: "True", isPublic: false },
  ],
},

"Two Sigma: Feature Engineering Pipeline": {
  company: "twosigma", pattern: "Data Processing / Pandas-like",
  title: "Financial Feature Extractor",
  difficulty: "Medium",
  desc: "Given OHLCV data as list of [open, high, low, close, volume], compute features for each bar: (1) returns = (close-open)/open, (2) high_low_range = (high-low)/low, (3) volume_zscore = (volume - mean_vol) / std_vol over all bars, (4) is_green = 1 if close > open else 0. Return list of [returns, hl_range, vol_zscore, is_green] per bar.",
  examples: [
    { input: "ohlcv=[[100,105,99,104,1000],[104,106,103,105,1200]]", output: "two rows of features" }
  ],
  constraints: ["len(ohlcv) >= 2", "all prices > 0"],
  functionSignature: "def extractFeatures(self, ohlcv: List[List]) -> List[List]:",
  starters: {
    Python: "from typing import List\nimport statistics\n\nclass Solution:\n    def extractFeatures(self, ohlcv: List[List]) -> List[List]:\n        pass",
    JavaScript: "var extractFeatures = function(ohlcv) {\n    \n};",
    TypeScript: "function extractFeatures(ohlcv: number[][]): number[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Double>> extractFeatures(List<List<Double>> ohlcv) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<double>> extractFeatures(vector<vector<double>>& ohlcv) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.extractFeatures([[100,105,99,104,1000],[104,106,103,105,1200]])\nprint(len(result))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nresult = sol.extractFeatures([[100,105,99,104,1000],[104,106,103,105,1200]])\nprint(result[0][3])", expected: "1", isPublic: true },
    { script: "sol = Solution()\nresult = sol.extractFeatures([[100,100,100,90,1000],[90,90,90,90,1000]])\nprint(result[0][3])", expected: "0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.extractFeatures([[100,110,90,100,1000],[100,110,90,100,1000]])\nprint(result[0][2])", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.extractFeatures([[100,110,90,105,1000],[100,110,90,95,1000]])\nprint(round(result[0][0],4))", expected: "0.05", isPublic: false },
  ],
},

"Two Sigma: Factor Model Return Attribution": {
  company: "twosigma", pattern: "Linear Algebra / Finance",
  title: "Fama-French Factor Attribution",
  difficulty: "Hard",
  desc: "Given a portfolio's factor loadings [market_beta, size_beta, value_beta] and factor returns [market_return, smb_return, hml_return] and alpha, compute attributed returns: total = alpha + market_beta*market_return + size_beta*smb + value_beta*hml. Return dict with each component and total, all rounded to 4dp.",
  examples: [
    { input: "loadings=[1.2,0.3,-0.1], factor_returns=[0.05,0.02,-0.01], alpha=0.001", output: "{'market':0.06,'size':0.006,'value':0.001,'alpha':0.001,'total':0.068}" }
  ],
  constraints: ["len(loadings)==3", "len(factor_returns)==3"],
  functionSignature: "def attributeReturns(self, loadings: List[float], factor_returns: List[float], alpha: float) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def attributeReturns(self, loadings: List[float], factor_returns: List[float], alpha: float) -> dict:\n        pass",
    JavaScript: "var attributeReturns = function(loadings, factor_returns, alpha) {\n    \n};",
    TypeScript: "function attributeReturns(loadings: number[], factor_returns: number[], alpha: number): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> attributeReturns(List<Double> loadings, List<Double> factorReturns, double alpha) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> attributeReturns(vector<double>& l, vector<double>& fr, double alpha) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.attributeReturns([1.2,0.3,-0.1],[0.05,0.02,-0.01],0.001)\nprint(round(r['market'],4))", expected: "0.06", isPublic: true },
    { script: "sol = Solution()\nr = sol.attributeReturns([1.0,0.0,0.0],[0.05,0.0,0.0],0.0)\nprint(round(r['total'],4))", expected: "0.05", isPublic: true },
    { script: "sol = Solution()\nr = sol.attributeReturns([1.2,0.3,-0.1],[0.05,0.02,-0.01],0.001)\nprint(round(r['size'],4))", expected: "0.006", isPublic: false },
    { script: "sol = Solution()\nr = sol.attributeReturns([0.0,0.0,0.0],[0.05,0.02,0.03],0.01)\nprint(r['total'])", expected: "0.01", isPublic: false },
    { script: "sol = Solution()\nr = sol.attributeReturns([1.2,0.3,-0.1],[0.05,0.02,-0.01],0.001)\nprint(round(r['total'],4))", expected: "0.068", isPublic: false },
  ],
},

"Two Sigma: Market Regime Classifier": {
  company: "twosigma", pattern: "Machine Learning / Classification",
  title: "Bull-Bear Market Classifier",
  difficulty: "Medium",
  desc: "Classify market regime from price series. Rules: compute 20-day and 50-day SMA. regime = 'bull' if sma20 > sma50 and latest_price > sma20, 'bear' if sma20 < sma50 and latest_price < sma20, else 'neutral'. Also compute trend_strength = abs(sma20 - sma50) / sma50. Return dict with 'regime', 'trend_strength' rounded to 4dp.",
  examples: [
    { input: "prices=[list of 60 increasing values]", output: "{'regime':'bull','trend_strength':...}" }
  ],
  constraints: ["len(prices) >= 50"],
  functionSignature: "def classifyRegime(self, prices: List[float]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def classifyRegime(self, prices: List[float]) -> dict:\n        pass",
    JavaScript: "var classifyRegime = function(prices) {\n    \n};",
    TypeScript: "function classifyRegime(prices: number[]): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> classifyRegime(List<Double> prices) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> classifyRegime(vector<double>& prices) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprices = [100+i for i in range(60)]\nprint(sol.classifyRegime(prices)['regime'])", expected: "bull", isPublic: true },
    { script: "sol = Solution()\nprices = [160-i for i in range(60)]\nprint(sol.classifyRegime(prices)['regime'])", expected: "bear", isPublic: true },
    { script: "sol = Solution()\nprices = [100]*60\nprint(sol.classifyRegime(prices)['regime'])", expected: "neutral", isPublic: false },
    { script: "sol = Solution()\nprices = [100+i for i in range(60)]\nprint(sol.classifyRegime(prices)['trend_strength'] > 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprices = [100]*60\nprint(sol.classifyRegime(prices)['trend_strength'])", expected: "0.0", isPublic: false },
  ],
},

"Two Sigma: Correlation Matrix Builder": {
  company: "twosigma", pattern: "Statistics / Linear Algebra",
  title: "Asset Correlation Matrix",
  difficulty: "Medium",
  desc: "Given a list of return series [list of float] for N assets (equal length), compute the N x N correlation matrix. Correlation(i,j) = cov(i,j) / (std(i) * std(j)). Return as a 2D list rounded to 4dp. If std of either series is 0, correlation = 0.",
  examples: [
    { input: "returns=[[1,2,3],[3,2,1]]", output: "[[ 1.0,-1.0],[-1.0, 1.0]]" }
  ],
  constraints: ["N >= 2", "len(each series) >= 2"],
  functionSignature: "def correlationMatrix(self, returns: List[List[float]]) -> List[List[float]]:",
  starters: {
    Python: "from typing import List\nimport statistics\n\nclass Solution:\n    def correlationMatrix(self, returns: List[List[float]]) -> List[List[float]]:\n        pass",
    JavaScript: "var correlationMatrix = function(returns) {\n    \n};",
    TypeScript: "function correlationMatrix(returns: number[][]): number[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Double>> correlationMatrix(List<List<Double>> returns) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<double>> correlationMatrix(vector<vector<double>>& returns) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.correlationMatrix([[1,2,3],[3,2,1]])\nprint(round(result[0][0],4))", expected: "1.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.correlationMatrix([[1,2,3],[3,2,1]])\nprint(round(result[0][1],4))", expected: "-1.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.correlationMatrix([[1,1,1],[1,2,3]])\nprint(result[0][1])", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.correlationMatrix([[1,2,3],[1,2,3]])\nprint(round(result[0][1],4))", expected: "1.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.correlationMatrix([[1,2,3],[3,2,1],[1,2,3]])\nprint(len(result))", expected: "3", isPublic: false },
  ],
},

"Two Sigma: Execution Shortfall Analyzer": {
  company: "twosigma", pattern: "Finance / Performance Analysis",
  title: "Implementation Shortfall Calculator",
  difficulty: "Medium",
  desc: "Compute implementation shortfall. Given: decision_price (when trade was decided), arrival_price (when order arrived), executed_trades [[price, shares]], benchmark_shares (total target). IS = (arrival_price - decision_price)/decision_price * benchmark_value (delay cost) + sum((exec_price - arrival_price) * shares) (market impact). Return dict with 'delay_cost', 'market_impact', 'total_is' rounded to 2dp.",
  examples: [
    { input: "decision=100, arrival=101, trades=[[102,50],[103,50]], benchmark=100", output: "dict with costs" }
  ],
  constraints: ["All prices > 0", "benchmark_shares >= sum(trade shares)"],
  functionSignature: "def implementationShortfall(self, decision_price: float, arrival_price: float, trades: List[List], benchmark_shares: int) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def implementationShortfall(self, decision_price: float, arrival_price: float, trades: List[List], benchmark_shares: int) -> dict:\n        pass",
    JavaScript: "var implementationShortfall = function(decision_price, arrival_price, trades, benchmark_shares) {\n    \n};",
    TypeScript: "function implementationShortfall(decision_price: number, arrival_price: number, trades: number[][], benchmark_shares: number): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> implementationShortfall(double dp, double ap, List<List<Double>> trades, int bs) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> implementationShortfall(double dp, double ap, vector<pair<double,int>>& trades, int bs) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.implementationShortfall(100,101,[[102,50],[103,50]],100)\nprint(r['delay_cost'])", expected: "100.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.implementationShortfall(100,100,[[100,100]],100)\nprint(r['total_is'])", expected: "0.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.implementationShortfall(100,101,[[102,50],[103,50]],100)\nprint(r['market_impact'])", expected: "200.0", isPublic: false },
    { script: "sol = Solution()\nr = sol.implementationShortfall(100,101,[[102,50],[103,50]],100)\nprint(r['total_is'])", expected: "300.0", isPublic: false },
    { script: "sol = Solution()\nr = sol.implementationShortfall(100,98,[[99,100]],100)\nprint(r['delay_cost'])", expected: "-200.0", isPublic: false },
  ],
},

"Two Sigma: Alpha Decay Model": {
  company: "twosigma", pattern: "Statistics / Time Series",
  title: "Alpha Signal Half-Life Estimator",
  difficulty: "Hard",
  desc: "Given a sequence of signal values and subsequent returns, estimate alpha signal half-life. Half-life = -ln(2) / ln(autocorrelation). Autocorrelation of signal = corr(signal[1:], signal[:-1]). Return dict with 'autocorrelation', 'half_life' (days), 'is_mean_reverting' (autocorr < 0).",
  examples: [
    { input: "signals=[1.0,0.8,0.64,0.512]", output: "{'autocorrelation':~0.8,'half_life':~3.1,'is_mean_reverting':False}" }
  ],
  constraints: ["len(signals) >= 3"],
  functionSignature: "def alphaDecay(self, signals: List[float]) -> dict:",
  starters: {
    Python: "from typing import List\nimport math, statistics\n\nclass Solution:\n    def alphaDecay(self, signals: List[float]) -> dict:\n        pass",
    JavaScript: "var alphaDecay = function(signals) {\n    \n};",
    TypeScript: "function alphaDecay(signals: number[]): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> alphaDecay(List<Double> signals) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> alphaDecay(vector<double>& signals) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.alphaDecay([1.0,0.8,0.64,0.512])\nprint(r['is_mean_reverting'])", expected: "False", isPublic: true },
    { script: "sol = Solution()\nr = sol.alphaDecay([1,-1,1,-1,1,-1])\nprint(r['is_mean_reverting'])", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.alphaDecay([1.0,0.8,0.64,0.512])\nprint(r['autocorrelation'] > 0.5)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.alphaDecay([1.0,1.0,1.0,1.0])\nprint('half_life' in r)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.alphaDecay([1.0,0.8,0.64,0.512])\nprint(r['half_life'] > 0)", expected: "True", isPublic: false },
  ],
},

"Two Sigma: ML Model Feature Validator": {
  company: "twosigma", pattern: "Data Validation / Statistics",
  title: "Feature Quality Checker",
  difficulty: "Easy",
  desc: "Given a feature matrix as list of dicts (each dict is a row with feature names as keys), validate each feature: (1) null_rate = fraction of None/NaN values, (2) variance (exclude nulls), (3) is_constant = True if variance == 0. Return dict of feature -> {'null_rate', 'variance', 'is_constant'} rounded to 4dp.",
  examples: [
    { input: "data=[{'f1':1,'f2':None},{'f1':2,'f2':3},{'f1':1,'f2':3}]", output: "{'f1':{'null_rate':0,'variance':0.3333,'is_constant':False},'f2':{'null_rate':0.3333,'variance':0.0,'is_constant':True}}" }
  ],
  constraints: ["1 <= rows <= 10000", "feature values are numeric or None"],
  functionSignature: "def validateFeatures(self, data: List[dict]) -> dict:",
  starters: {
    Python: "from typing import List\nimport statistics\n\nclass Solution:\n    def validateFeatures(self, data: List[dict]) -> dict:\n        pass",
    JavaScript: "var validateFeatures = function(data) {\n    \n};",
    TypeScript: "function validateFeatures(data: Record<string, number | null>[]): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Map<String,Object>> validateFeatures(List<Map<String,Object>> data) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,map<string,double>> validateFeatures(vector<map<string,double>>& data) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.validateFeatures([{'f1':1},{'f1':2},{'f1':3}])\nprint(r['f1']['null_rate'])", expected: "0.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.validateFeatures([{'f1':1},{'f1':None},{'f1':1}])\nprint(round(r['f1']['null_rate'],4))", expected: "0.3333", isPublic: true },
    { script: "sol = Solution()\nr = sol.validateFeatures([{'f1':5},{'f1':5},{'f1':5}])\nprint(r['f1']['is_constant'])", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.validateFeatures([{'f1':1},{'f1':3}])\nprint(r['f1']['variance'] > 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.validateFeatures([{'a':1,'b':2},{'a':None,'b':2}])\nprint(r['b']['null_rate'])", expected: "0.0", isPublic: false },
  ],
},

// =============================================================================
// HUDSON RIVER TRADING (15 problems)
// =============================================================================

"HRT: Latency-Optimized Order Router": {
  company: "hrt", pattern: "Graph / Shortest Path",
  title: "Optimal Order Routing",
  difficulty: "Medium",
  desc: "Given exchanges as nodes and network links with latencies [from, to, latency_ms], find the minimum latency path to route an order from source to each exchange. Return dict of exchange -> min_latency using Dijkstra.",
  examples: [
    { input: "links=[['A','B',1],['B','C',2],['A','C',5]], src='A'", output: "{'A':0,'B':1,'C':3}" }
  ],
  constraints: ["1 <= exchanges <= 50", "latency > 0"],
  functionSignature: "def minLatency(self, links: List[List], src: str) -> dict:",
  starters: {
    Python: "from typing import List\nimport heapq\n\nclass Solution:\n    def minLatency(self, links: List[List], src: str) -> dict:\n        pass",
    JavaScript: "var minLatency = function(links, src) {\n    \n};",
    TypeScript: "function minLatency(links: any[][], src: string): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Integer> minLatency(List<List<Object>> links, String src) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,int> minLatency(vector<tuple<string,string,int>>& links, string src) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.minLatency([['A','B',1],['B','C',2],['A','C',5]],'A')['C'])", expected: "3", isPublic: true },
    { script: "sol = Solution()\nprint(sol.minLatency([['A','B',1],['B','C',2],['A','C',5]],'A')['A'])", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.minLatency([['A','B',10],['A','B',1]],'A')['B'])", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.minLatency([['X','Y',5]],'X')['Y'])", expected: "5", isPublic: false },
    { script: "sol = Solution()\nresult = sol.minLatency([['A','B',2],['A','C',1],['C','B',0.5]],'A')\nprint(result['B'])", expected: "1.5", isPublic: false },
  ],
},

"HRT: Market Microstructure Analysis": {
  company: "hrt", pattern: "Statistics / Finance",
  title: "Bid-Ask Spread Decomposition",
  difficulty: "Medium",
  desc: "Decompose bid-ask spread into components. Given trade data [price, side('buy'/'sell'), size], compute: realized_spread = 2 * direction * (trade_price - mid_next) for each trade, where direction=+1 for buy/-1 for sell, mid_next is mid-price 5 trades later. Return mean realized_spread, mean price_impact = 2*direction*(mid_next-mid_prev), both rounded to 4dp.",
  examples: [
    { input: "trades=[['buy',100,10],['sell',99,10],...], mids=[99.5,99.5,...]", output: "{'realized_spread':...,'price_impact':...}" }
  ],
  constraints: ["len(trades) >= 6", "prices > 0"],
  functionSignature: "def decomposeSpread(self, trades: List[List], mids: List[float]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def decomposeSpread(self, trades: List[List], mids: List[float]) -> dict:\n        pass",
    JavaScript: "var decomposeSpread = function(trades, mids) {\n    \n};",
    TypeScript: "function decomposeSpread(trades: any[][], mids: number[]): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> decomposeSpread(List<List<Object>> trades, List<Double> mids) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> decomposeSpread(vector<tuple<string,double,int>>& trades, vector<double>& mids) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.decomposeSpread([['buy',100,10]]*10,[99.5]*10)\nprint('realized_spread' in r)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.decomposeSpread([['buy',100,10]]*10,[100.0]*10)\nprint(round(r['realized_spread'],4))", expected: "0.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.decomposeSpread([['sell',99,10]]*10,[99.5]*10)\nprint(r['realized_spread'] < 0 or r['realized_spread'] >= 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.decomposeSpread([['buy',100,10]]*10,[99.5]*10)\nprint(isinstance(r['price_impact'],(int,float)))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.decomposeSpread([['buy',100,10]]*10,[99.5+i*0.1 for i in range(10)])\nprint(r['price_impact'] > 0)", expected: "True", isPublic: false },
  ],
},

"HRT: Order Book Pressure Indicator": {
  company: "hrt", pattern: "Data Structures / Streaming",
  title: "Order Book Imbalance Monitor",
  difficulty: "Medium",
  desc: "Compute order book imbalance (OBI) in real-time. OBI = (bid_volume_top_5 - ask_volume_top_5) / (bid_volume_top_5 + ask_volume_top_5). Given snapshots [[bids: [[price,qty]], asks: [[price,qty]]]], compute OBI for each snapshot. Return list of OBI values rounded to 4dp. Use top 5 bid levels (highest prices) and top 5 ask levels (lowest prices).",
  examples: [
    { input: "snapshots=[{'bids':[[100,500],[99,300]],'asks':[[101,200],[102,400]]}]", output: "[0.4286]" }
  ],
  constraints: ["Each snapshot has at least 1 bid and 1 ask level"],
  functionSignature: "def computeOBI(self, snapshots: List[dict]) -> List[float]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def computeOBI(self, snapshots: List[dict]) -> List[float]:\n        pass",
    JavaScript: "var computeOBI = function(snapshots) {\n    \n};",
    TypeScript: "function computeOBI(snapshots: Record<string, any>[]): number[] {\n    \n};",
    Java: "class Solution {\n    public List<Double> computeOBI(List<Map<String,Object>> snapshots) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<double> computeOBI(vector<map<string,vector<pair<double,int>>>>& snaps) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.computeOBI([{'bids':[[100,500],[99,300]],'asks':[[101,200],[102,400]]}])\nprint(round(result[0],4))", expected: "0.4286", isPublic: true },
    { script: "sol = Solution()\nresult = sol.computeOBI([{'bids':[[100,100]],'asks':[[101,100]]}])\nprint(result[0])", expected: "0.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.computeOBI([{'bids':[[100,1000]],'asks':[[101,0]]}])\nprint(result[0])", expected: "1.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.computeOBI([{'bids':[[100,0]],'asks':[[101,500]]}])\nprint(result[0])", expected: "-1.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.computeOBI([{'bids':[[100,300],[99,200]],'asks':[[101,100],[102,200]]}])\nprint(result[0] > 0)", expected: "True", isPublic: false },
  ],
},

"HRT: Tick Data Aggregator": {
  company: "hrt", pattern: "Streaming / Aggregation",
  title: "OHLCV Bar Builder",
  difficulty: "Easy",
  desc: "Given a stream of ticks [price, volume, timestamp_ms] and bar_size_ms, build OHLCV bars. Each bar covers [t, t+bar_size). Return list of [bar_start, open, high, low, close, volume]. Bars with no ticks are skipped.",
  examples: [
    { input: "ticks=[[100,10,0],[101,5,100],[99,15,200],[102,8,1000]], bar_size=500", output: "[[0,100,101,99,99,30],[1000,102,102,102,102,8]]" }
  ],
  constraints: ["ticks are sorted by timestamp", "bar_size > 0"],
  functionSignature: "def buildBars(self, ticks: List[List], bar_size: int) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def buildBars(self, ticks: List[List], bar_size: int) -> List[List]:\n        pass",
    JavaScript: "var buildBars = function(ticks, bar_size) {\n    \n};",
    TypeScript: "function buildBars(ticks: number[][], bar_size: number): number[][] {\n    \n};",
    Java: "class Solution {\n    public List<double[]> buildBars(List<double[]> ticks, int barSize) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<double>> buildBars(vector<vector<double>>& ticks, int barSize) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.buildBars([[100,10,0],[101,5,100],[99,15,200],[102,8,1000]],500)\nprint(len(result))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nresult = sol.buildBars([[100,10,0],[101,5,100],[99,15,200],[102,8,1000]],500)\nprint(result[0][5])", expected: "30", isPublic: true },
    { script: "sol = Solution()\nresult = sol.buildBars([[100,10,0]],1000)\nprint(result[0][1])", expected: "100", isPublic: false },
    { script: "sol = Solution()\nresult = sol.buildBars([[100,10,0],[101,5,0]],1000)\nprint(result[0][2])", expected: "101", isPublic: false },
    { script: "sol = Solution()\nresult = sol.buildBars([],1000)\nprint(result)", expected: "[]", isPublic: false },
  ],
},

"HRT: Alpha Generation from News": {
  company: "hrt", pattern: "NLP-lite / Scoring",
  title: "News Sentiment Alpha Signal",
  difficulty: "Easy",
  desc: "Given news headlines with sentiment scores [-1,1] and tickers mentioned, compute aggregate sentiment per ticker weighted by recency. Most recent news gets weight 1.0, each older one gets 0.9^n (n=age in articles). Return dict of ticker -> weighted_sentiment rounded to 4dp.",
  examples: [
    { input: "news=[{'tickers':['AAPL'],'sentiment':0.8,'age':0},{'tickers':['AAPL'],'sentiment':-0.5,'age':1}]", output: "{'AAPL': 0.3743}" }
  ],
  constraints: ["age >= 0", "sentiment in [-1,1]"],
  functionSignature: "def aggregateSentiment(self, news: List[dict]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def aggregateSentiment(self, news: List[dict]) -> dict:\n        pass",
    JavaScript: "var aggregateSentiment = function(news) {\n    \n};",
    TypeScript: "function aggregateSentiment(news: Record<string, any>[]): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> aggregateSentiment(List<Map<String,Object>> news) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> aggregateSentiment(vector<map<string,double>>& news) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.aggregateSentiment([{'tickers':['AAPL'],'sentiment':0.8,'age':0},{'tickers':['AAPL'],'sentiment':-0.5,'age':1}])\nprint(round(r['AAPL'],4))", expected: "0.3743", isPublic: true },
    { script: "sol = Solution()\nr = sol.aggregateSentiment([{'tickers':['X'],'sentiment':1.0,'age':0}])\nprint(r['X'])", expected: "1.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.aggregateSentiment([{'tickers':['A','B'],'sentiment':0.5,'age':0}])\nprint(r['A'])", expected: "0.5", isPublic: false },
    { script: "sol = Solution()\nr = sol.aggregateSentiment([])\nprint(r)", expected: "{}", isPublic: false },
    { script: "sol = Solution()\nr = sol.aggregateSentiment([{'tickers':['X'],'sentiment':1.0,'age':0},{'tickers':['X'],'sentiment':1.0,'age':0}])\nprint(r['X'])", expected: "1.0", isPublic: false },
  ],
},

"HRT: Co-location Arbitrage Simulator": {
  company: "hrt", pattern: "Simulation / Competitive",
  title: "Co-location Latency Arbitrage",
  difficulty: "Medium",
  desc: "Simulate latency arbitrage. Given: price feed updates [[exchange, price, timestamp]] and execution latency per exchange (dict). When a price discrepancy > min_spread appears between two exchanges, simulate a trade: buy at cheaper + latency, sell at expensive + latency. Calculate total PnL. Return dict with 'num_arbs', 'total_pnl', 'avg_pnl_per_arb'.",
  examples: [
    { input: "updates=[['A',100,0],['B',101,1]], latencies={'A':1,'B':1}, min_spread=0.5", output: "1 arb opportunity" }
  ],
  constraints: ["updates sorted by timestamp", "latencies >= 0"],
  functionSignature: "def simulateArbitrage(self, updates: List[List], latencies: dict, min_spread: float) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def simulateArbitrage(self, updates: List[List], latencies: dict, min_spread: float) -> dict:\n        pass",
    JavaScript: "var simulateArbitrage = function(updates, latencies, min_spread) {\n    \n};",
    TypeScript: "function simulateArbitrage(updates: any[][], latencies: Record<string,number>, min_spread: number): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> simulateArbitrage(List<List<Object>> updates, Map<String,Integer> latencies, double minSpread) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> simulateArbitrage(vector<tuple<string,double,int>>& u, map<string,int>& lat, double ms) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.simulateArbitrage([['A',100,0],['B',101,1]],{'A':1,'B':1},0.5)\nprint(r['num_arbs'])", expected: "1", isPublic: true },
    { script: "sol = Solution()\nr = sol.simulateArbitrage([['A',100,0],['B',100,1]],{'A':1,'B':1},0.5)\nprint(r['num_arbs'])", expected: "0", isPublic: true },
    { script: "sol = Solution()\nr = sol.simulateArbitrage([['A',100,0],['B',101,1]],{'A':1,'B':1},0.5)\nprint(r['total_pnl'] > 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.simulateArbitrage([],{'A':1},0.5)\nprint(r['num_arbs'])", expected: "0", isPublic: false },
    { script: "sol = Solution()\nr = sol.simulateArbitrage([['A',100,0],['B',102,1]],{'A':0,'B':0},0.5)\nprint(r['total_pnl'])", expected: "2.0", isPublic: false },
  ],
},

"HRT: Smart Order Routing Algorithm": {
  company: "hrt", pattern: "Optimization / Greedy",
  title: "Multi-Venue Order Slicer",
  difficulty: "Hard",
  desc: "Given a buy order of total_qty shares and multiple venues each with [venue_name, available_qty, price, fee_per_share], optimally slice the order to minimize total cost (price + fee) * qty. Venues are filled greedily by effective price (price+fee) ascending. Return list of [venue, qty, effective_price] and total_cost.",
  examples: [
    { input: "total=100, venues=[['A',60,10.0,0.01],['B',80,10.05,0.005]]", output: "[['A',60,...],['B',40,...]]" }
  ],
  constraints: ["total <= sum of available quantities", "qty > 0"],
  functionSignature: "def sliceOrder(self, total: int, venues: List[List]) -> List:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def sliceOrder(self, total: int, venues: List[List]) -> List:\n        pass",
    JavaScript: "var sliceOrder = function(total, venues) {\n    \n};",
    TypeScript: "function sliceOrder(total: number, venues: any[][]): any[] {\n    \n};",
    Java: "class Solution {\n    public List<Object> sliceOrder(int total, List<List<Object>> venues) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<tuple<string,int,double>> sliceOrder(int total, vector<tuple<string,int,double,double>>& venues) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.sliceOrder(100,[['A',60,10.0,0.01],['B',80,10.05,0.005]])\nprint(sum(r[1] for r in result[0]))", expected: "100", isPublic: true },
    { script: "sol = Solution()\nresult = sol.sliceOrder(100,[['A',60,10.0,0.01],['B',80,10.05,0.005]])\nprint(result[0][0][0])", expected: "A", isPublic: true },
    { script: "sol = Solution()\nresult = sol.sliceOrder(50,[['A',100,10.0,0.01]])\nprint(result[0][0][1])", expected: "50", isPublic: false },
    { script: "sol = Solution()\nresult = sol.sliceOrder(100,[['A',60,10.0,0.01],['B',80,10.05,0.005]])\nprint(result[0][1][1])", expected: "40", isPublic: false },
    { script: "sol = Solution()\nresult = sol.sliceOrder(100,[['A',60,10.0,0.01],['B',80,10.05,0.005]])\nprint(result[1] > 0)", expected: "True", isPublic: false },
  ],
},

// =============================================================================
// JUMP TRADING (15 problems)
// =============================================================================

"Jump: Cross-Exchange Arbitrage Engine": {
  company: "jump", pattern: "Graph / Cycle Detection",
  title: "Detect Profitable Arbitrage Cycle",
  difficulty: "Hard",
  desc: "Given a directed graph where edges represent exchange rates [from, to, rate], find if there exists a cycle with total product of rates > 1.0 (profitable arbitrage). Use DFS/Bellman-Ford with log transformation. Return True/False and the cycle path if found.",
  examples: [
    { input: "rates=[['A','B',1.1],['B','C',1.1],['C','A',0.9]]", output: "True (1.1*1.1*0.9=1.089>1)" }
  ],
  constraints: ["1 <= len(rates) <= 200"],
  functionSignature: "def findArbitrageCycle(self, rates: List[List]) -> List:",
  starters: {
    Python: "from typing import List\nimport math\n\nclass Solution:\n    def findArbitrageCycle(self, rates: List[List]) -> List:\n        pass",
    JavaScript: "var findArbitrageCycle = function(rates) {\n    \n};",
    TypeScript: "function findArbitrageCycle(rates: any[][]): any[] {\n    \n};",
    Java: "class Solution {\n    public List<Object> findArbitrageCycle(List<List<Object>> rates) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<string> findArbitrageCycle(vector<tuple<string,string,double>>& rates) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.findArbitrageCycle([['A','B',1.1],['B','C',1.1],['C','A',0.9]])\nprint(result[0])", expected: "True", isPublic: true },
    { script: "sol = Solution()\nresult = sol.findArbitrageCycle([['A','B',0.9],['B','A',1.0]])\nprint(result[0])", expected: "False", isPublic: true },
    { script: "sol = Solution()\nresult = sol.findArbitrageCycle([['A','B',2.0],['B','A',0.6]])\nprint(result[0])", expected: "True", isPublic: false },
    { script: "sol = Solution()\nresult = sol.findArbitrageCycle([['A','B',1.0],['B','A',1.0]])\nprint(result[0])", expected: "False", isPublic: false },
    { script: "sol = Solution()\nresult = sol.findArbitrageCycle([['A','B',1.5],['B','C',1.5],['C','A',0.5]])\nprint(result[0])", expected: "True", isPublic: false },
  ],
},

"Jump: FPGA Order Matching Simulation": {
  company: "jump", pattern: "Design / Priority Queue",
  title: "Price-Time Priority Order Matcher",
  difficulty: "Hard",
  desc: "Implement a price-time priority order matching engine. addOrder(side, price, qty, order_id, timestamp). matchOrders() matches best bid (highest price) with best ask (lowest price) when bid >= ask. For same price, FIFO by timestamp. Return list of matched trades [[bid_id, ask_id, price, qty]].",
  examples: [
    { input: "add buy 100,10,1,0; add sell 99,5,2,1; matchOrders()", output: "[[1,2,99.5,5]]" }
  ],
  constraints: ["price > 0", "qty > 0", "order_ids unique"],
  functionSignature: "def matchOrders(self) -> List[List]:",
  starters: {
    Python: "from typing import List\nimport heapq\n\nclass OrderMatcher:\n    def __init__(self):\n        self.buys = []\n        self.sells = []\n\n    def addOrder(self, side: str, price: float, qty: int, order_id: int, timestamp: int) -> None:\n        pass\n\n    def matchOrders(self) -> List[List]:\n        pass",
    JavaScript: "class OrderMatcher {\n    constructor() { this.buys = []; this.sells = []; }\n    addOrder(side, price, qty, orderId, timestamp) {}\n    matchOrders() { return []; }\n}",
    TypeScript: "class OrderMatcher {\n    addOrder(side: string, price: number, qty: number, orderId: number, timestamp: number): void {}\n    matchOrders(): any[][] { return []; }\n}",
    Java: "class OrderMatcher {\n    public void addOrder(String side, double price, int qty, int orderId, int ts) {}\n    public List<List<Object>> matchOrders() { return new ArrayList<>(); }\n}",
    "C++": "class OrderMatcher {\npublic:\n    void addOrder(string side, double price, int qty, int id, int ts) {}\n    vector<vector<double>> matchOrders() { return {}; }\n};",
  },
  testCases: [
    { script: "om = OrderMatcher()\nom.addOrder('buy',100,10,1,0)\nom.addOrder('sell',99,5,2,1)\nresult = om.matchOrders()\nprint(result[0][2])", expected: "99.5", isPublic: true },
    { script: "om = OrderMatcher()\nom.addOrder('buy',95,10,1,0)\nom.addOrder('sell',100,5,2,1)\nprint(om.matchOrders())", expected: "[]", isPublic: true },
    { script: "om = OrderMatcher()\nom.addOrder('buy',100,10,1,0)\nom.addOrder('sell',100,5,2,1)\nresult = om.matchOrders()\nprint(result[0][3])", expected: "5", isPublic: false },
    { script: "om = OrderMatcher()\nom.addOrder('buy',100,3,1,0)\nom.addOrder('sell',99,3,2,1)\nresult = om.matchOrders()\nprint(len(result))", expected: "1", isPublic: false },
    { script: "om = OrderMatcher()\nom.addOrder('buy',100,10,1,0)\nom.addOrder('buy',101,10,2,1)\nom.addOrder('sell',99,5,3,2)\nresult = om.matchOrders()\nprint(result[0][0])", expected: "2", isPublic: false },
  ],
},

"Jump: Quote Stream Processor": {
  company: "jump", pattern: "Sliding Window / Statistics",
  title: "Real-Time Quote Statistics",
  difficulty: "Easy",
  desc: "Process a stream of quote updates [bid, ask, timestamp]. For each update compute: spread = ask - bid, mid = (ask+bid)/2, running_avg_spread (all quotes so far), running_vol (std of mid prices so far). Return list of [spread, mid, avg_spread, vol] per quote, rounded to 4dp.",
  examples: [
    { input: "quotes=[[99,101,1],[99.5,100.5,2]]", output: "[[2.0,100.0,2.0,0.0],[1.0,100.0,1.5,0.0]]" }
  ],
  constraints: ["len(quotes) >= 1", "ask > bid"],
  functionSignature: "def processQuotes(self, quotes: List[List]) -> List[List]:",
  starters: {
    Python: "from typing import List\nimport statistics\n\nclass Solution:\n    def processQuotes(self, quotes: List[List]) -> List[List]:\n        pass",
    JavaScript: "var processQuotes = function(quotes) {\n    \n};",
    TypeScript: "function processQuotes(quotes: number[][]): number[][] {\n    \n};",
    Java: "class Solution {\n    public List<double[]> processQuotes(List<double[]> quotes) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<double>> processQuotes(vector<vector<double>>& quotes) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.processQuotes([[99,101,1],[99.5,100.5,2]])\nprint(result[0][0])", expected: "2.0", isPublic: true },
    { script: "sol = Solution()\nresult = sol.processQuotes([[99,101,1],[99.5,100.5,2]])\nprint(result[1][2])", expected: "1.5", isPublic: true },
    { script: "sol = Solution()\nresult = sol.processQuotes([[100,102,1]])\nprint(result[0][1])", expected: "101.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.processQuotes([[100,102,1]])\nprint(result[0][3])", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nresult = sol.processQuotes([[99,101,1],[99.5,100.5,2],[100,101,3]])\nprint(len(result))", expected: "3", isPublic: false },
  ],
},

"Jump: Risk Limit Monitor": {
  company: "jump", pattern: "Design / Monitoring",
  title: "Real-Time Risk Limit Checker",
  difficulty: "Medium",
  desc: "Monitor trading risk limits. Define limits: max_position per symbol, max_daily_loss, max_order_size. checkOrder(symbol, side, qty, price) returns 'approved' or 'rejected: reason'. Track positions (net qty per symbol) and daily P&L. updatePrice(symbol, price) updates mark-to-market. getDailyPnL() returns current P&L.",
  examples: [
    { input: "limits: max_pos=1000, max_loss=10000, max_order=500; checkOrder('AAPL','buy',600,100)" , output: "'rejected: order too large'" }
  ],
  constraints: ["qty > 0", "price > 0"],
  functionSignature: "def checkOrder(self, symbol: str, side: str, qty: int, price: float) -> str:",
  starters: {
    Python: "class RiskMonitor:\n    def __init__(self, max_position: int, max_daily_loss: float, max_order_size: int):\n        pass\n\n    def checkOrder(self, symbol: str, side: str, qty: int, price: float) -> str:\n        pass\n\n    def updatePrice(self, symbol: str, price: float) -> None:\n        pass\n\n    def getDailyPnL(self) -> float:\n        pass",
    JavaScript: "class RiskMonitor {\n    constructor(maxPosition, maxDailyLoss, maxOrderSize) {}\n    checkOrder(symbol, side, qty, price) { return 'approved'; }\n    updatePrice(symbol, price) {}\n    getDailyPnL() { return 0; }\n}",
    TypeScript: "class RiskMonitor {\n    constructor(private maxPosition: number, private maxDailyLoss: number, private maxOrderSize: number) {}\n    checkOrder(symbol: string, side: string, qty: number, price: number): string { return 'approved'; }\n    updatePrice(symbol: string, price: number): void {}\n    getDailyPnL(): number { return 0; }\n}",
    Java: "class RiskMonitor {\n    public RiskMonitor(int maxPos, double maxLoss, int maxOrder) {}\n    public String checkOrder(String sym, String side, int qty, double price) { return \"approved\"; }\n    public void updatePrice(String sym, double price) {}\n    public double getDailyPnL() { return 0; }\n}",
    "C++": "class RiskMonitor {\npublic:\n    RiskMonitor(int maxPos, double maxLoss, int maxOrder) {}\n    string checkOrder(string sym, string side, int qty, double price) { return \"approved\"; }\n    void updatePrice(string sym, double price) {}\n    double getDailyPnL() { return 0; }\n};",
  },
  testCases: [
    { script: "rm = RiskMonitor(1000, 10000, 500)\nprint(rm.checkOrder('AAPL','buy',600,100))", expected: "rejected: order too large", isPublic: true },
    { script: "rm = RiskMonitor(1000, 10000, 500)\nprint(rm.checkOrder('AAPL','buy',400,100))", expected: "approved", isPublic: true },
    { script: "rm = RiskMonitor(100, 10000, 500)\nrm.checkOrder('X','buy',100,100)\nprint(rm.checkOrder('X','buy',1,100))", expected: "rejected: position limit", isPublic: false },
    { script: "rm = RiskMonitor(1000, 100, 500)\nrm.checkOrder('X','buy',100,100)\nrm.updatePrice('X',99)\nprint('rejected' in rm.checkOrder('X','buy',10,99))", expected: "True", isPublic: false },
    { script: "rm = RiskMonitor(1000, 10000, 500)\nprint(rm.getDailyPnL())", expected: "0.0", isPublic: false },
  ],
},

"Jump: Futures Roll Calculator": {
  company: "jump", pattern: "Finance / Date Math",
  title: "Futures Contract Roll Dates",
  difficulty: "Easy",
  desc: "Calculate futures roll dates. Given current contract expiry (YYYY-MM-DD) and roll_days_before, compute the roll date. Also compute carry = (spot_price - futures_price) / spot_price * 365 / days_to_expiry. Return dict with 'roll_date' (YYYY-MM-DD), 'carry_annualized' (rounded to 4dp).",
  examples: [
    { input: "expiry='2024-03-15', roll_days=5, spot=100, futures=99, today='2024-03-01'", output: "{'roll_date':'2024-03-10','carry_annualized':0.2644}" }
  ],
  constraints: ["expiry > today", "roll_days >= 0"],
  functionSignature: "def futuresRoll(self, expiry: str, roll_days: int, spot: float, futures: float, today: str) -> dict:",
  starters: {
    Python: "from datetime import datetime, timedelta\n\nclass Solution:\n    def futuresRoll(self, expiry: str, roll_days: int, spot: float, futures: float, today: str) -> dict:\n        pass",
    JavaScript: "var futuresRoll = function(expiry, roll_days, spot, futures, today) {\n    \n};",
    TypeScript: "function futuresRoll(expiry: string, roll_days: number, spot: number, futures: number, today: string): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> futuresRoll(String expiry, int rollDays, double spot, double futures, String today) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,string> futuresRoll(string expiry, int roll, double spot, double fut, string today) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.futuresRoll('2024-03-15',5,100,99,'2024-03-01')\nprint(r['roll_date'])", expected: "2024-03-10", isPublic: true },
    { script: "sol = Solution()\nr = sol.futuresRoll('2024-03-15',5,100,99,'2024-03-01')\nprint(round(r['carry_annualized'],4))", expected: "0.2644", isPublic: true },
    { script: "sol = Solution()\nr = sol.futuresRoll('2024-03-15',0,100,100,'2024-03-01')\nprint(r['carry_annualized'])", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nr = sol.futuresRoll('2024-03-15',10,100,99,'2024-03-01')\nprint(r['roll_date'])", expected: "2024-03-05", isPublic: false },
    { script: "sol = Solution()\nr = sol.futuresRoll('2024-06-15',5,200,195,'2024-06-01')\nprint(r['roll_date'])", expected: "2024-06-10", isPublic: false },
  ],
},

"Jump: Cross-Venue Price Discovery": {
  company: "jump", pattern: "Aggregation / Consensus",
  title: "National Best Bid and Offer (NBBO)",
  difficulty: "Easy",
  desc: "Given quotes from multiple venues [[venue, bid, ask, bid_size, ask_size]], compute NBBO: best_bid = max of all bids, best_ask = min of all asks. Also compute NBBO spread, NBBO mid, and total size at best bid/ask. Return dict with all fields.",
  examples: [
    { input: "quotes=[['A',100,101,500,300],['B',99.5,100.5,400,600]]", output: "{'best_bid':100,'best_ask':100.5,'spread':0.5,'mid':100.25,'bid_size':500,'ask_size':600}" }
  ],
  constraints: ["len(quotes) >= 1", "ask > bid for each venue"],
  functionSignature: "def computeNBBO(self, quotes: List[List]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def computeNBBO(self, quotes: List[List]) -> dict:\n        pass",
    JavaScript: "var computeNBBO = function(quotes) {\n    \n};",
    TypeScript: "function computeNBBO(quotes: any[][]): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> computeNBBO(List<List<Object>> quotes) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> computeNBBO(vector<tuple<string,double,double,int,int>>& quotes) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.computeNBBO([['A',100,101,500,300],['B',99.5,100.5,400,600]])\nprint(r['best_bid'])", expected: "100", isPublic: true },
    { script: "sol = Solution()\nr = sol.computeNBBO([['A',100,101,500,300],['B',99.5,100.5,400,600]])\nprint(r['best_ask'])", expected: "100.5", isPublic: true },
    { script: "sol = Solution()\nr = sol.computeNBBO([['A',100,101,500,300],['B',99.5,100.5,400,600]])\nprint(r['spread'])", expected: "0.5", isPublic: false },
    { script: "sol = Solution()\nr = sol.computeNBBO([['A',100,101,500,300]])\nprint(r['mid'])", expected: "100.5", isPublic: false },
    { script: "sol = Solution()\nr = sol.computeNBBO([['A',100,101,500,300],['B',100,101,200,400]])\nprint(r['bid_size'])", expected: "700", isPublic: false },
  ],
},

"Jump: Intraday Volume Curve Fitter": {
  company: "jump", pattern: "Statistics / Curve Fitting",
  title: "U-Shaped Volume Curve Modeler",
  difficulty: "Medium",
  desc: "Intraday volume typically follows a U-shape. Given actual volumes per 30-min bar [v1..v13] (9:30-16:00), fit a quadratic model: V(t) = a*t^2 + b*t + c using least squares. Return coefficients [a,b,c] and R-squared value. Also return predicted volume for each bar. Round all to 4dp.",
  examples: [
    { input: "volumes=[1000,800,600,500,400,350,300,350,400,500,600,800,1000]", output: "U-shaped quadratic fit coefficients" }
  ],
  constraints: ["len(volumes) == 13", "volumes > 0"],
  functionSignature: "def fitVolumeCurve(self, volumes: List[float]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def fitVolumeCurve(self, volumes: List[float]) -> dict:\n        pass",
    JavaScript: "var fitVolumeCurve = function(volumes) {\n    \n};",
    TypeScript: "function fitVolumeCurve(volumes: number[]): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> fitVolumeCurve(List<Double> volumes) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> fitVolumeCurve(vector<double>& volumes) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.fitVolumeCurve([1000,800,600,500,400,350,300,350,400,500,600,800,1000])\nprint('coefficients' in r)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.fitVolumeCurve([1,1,1,1,1,1,1,1,1,1,1,1,1])\nprint(round(r['r_squared'],4))", expected: "1.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.fitVolumeCurve([1000,800,600,500,400,350,300,350,400,500,600,800,1000])\nprint(r['coefficients'][0] > 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.fitVolumeCurve([1000,800,600,500,400,350,300,350,400,500,600,800,1000])\nprint(len(r['predicted']))", expected: "13", isPublic: false },
    { script: "sol = Solution()\nr = sol.fitVolumeCurve([1000,800,600,500,400,350,300,350,400,500,600,800,1000])\nprint(0 <= r['r_squared'] <= 1)", expected: "True", isPublic: false },
  ],
},

"Jump: Adaptive Market Making Strategy": {
  company: "jump", pattern: "Game Theory / Simulation",
  title: "Adaptive Spread Market Maker",
  difficulty: "Hard",
  desc: "Simulate an adaptive market maker. Given order arrivals [side('buy'/'sell'), size, timestamp], maintain inventory and adjust spread based on inventory risk. Spread = base_spread + gamma * abs(inventory). Quote bid = mid - spread/2, ask = mid + spread/2. Fill orders at quoted prices. Track PnL and inventory. Return final dict with 'inventory','total_pnl','num_trades'.",
  examples: [
    { input: "mid=100, base_spread=0.1, gamma=0.01, orders=[['buy',10,0],['sell',5,1]]", output: "dict with final state" }
  ],
  constraints: ["mid > 0", "base_spread > 0", "gamma >= 0"],
  functionSignature: "def simulate(self, mid: float, base_spread: float, gamma: float, orders: List[List]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def simulate(self, mid: float, base_spread: float, gamma: float, orders: List[List]) -> dict:\n        pass",
    JavaScript: "var simulate = function(mid, base_spread, gamma, orders) {\n    \n};",
    TypeScript: "function simulate(mid: number, base_spread: number, gamma: number, orders: any[][]): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> simulate(double mid, double baseSpread, double gamma, List<List<Object>> orders) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> simulate(double mid, double baseSpread, double gamma, vector<tuple<string,int,int>>& orders) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.simulate(100,0.1,0.01,[['buy',10,0],['sell',5,1]])\nprint('inventory' in r)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.simulate(100,0.1,0.01,[])\nprint(r['num_trades'])", expected: "0", isPublic: true },
    { script: "sol = Solution()\nr = sol.simulate(100,0.1,0.0,[['buy',5,0],['sell',5,1]])\nprint(r['inventory'])", expected: "0", isPublic: false },
    { script: "sol = Solution()\nr = sol.simulate(100,0.1,0.0,[['buy',10,0]])\nprint(r['inventory'])", expected: "-10", isPublic: false },
    { script: "sol = Solution()\nr = sol.simulate(100,0.1,0.01,[['buy',10,0],['sell',5,1]])\nprint(r['num_trades'])", expected: "2", isPublic: false },
  ],
},

// =============================================================================
// D.E. SHAW (15 problems)
// =============================================================================

"DE Shaw: Optimal Portfolio Construction": {
  company: "deshaw", pattern: "Quadratic Programming / Optimization",
  title: "Mean-Variance Portfolio Optimizer",
  difficulty: "Hard",
  desc: "Given expected returns and covariance matrix, find portfolio weights that maximize Sharpe ratio (simplified: maximize return - 0.5*lambda*variance). Use gradient-free search: try all combinations of weights in 0.1 increments that sum to 1.0. Return dict with 'weights'(list), 'expected_return', 'variance', 'sharpe' rounded to 4dp.",
  examples: [
    { input: "returns=[0.1,0.2], cov=[[0.01,0.002],[0.002,0.04]], lambda_risk=1.0", output: "weights near [0.7,0.3]" }
  ],
  constraints: ["N = 2 or 3 assets", "cov is positive definite"],
  functionSignature: "def optimizePortfolio(self, returns: List[float], cov: List[List[float]], lambda_risk: float) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def optimizePortfolio(self, returns: List[float], cov: List[List[float]], lambda_risk: float) -> dict:\n        pass",
    JavaScript: "var optimizePortfolio = function(returns, cov, lambda_risk) {\n    \n};",
    TypeScript: "function optimizePortfolio(returns: number[], cov: number[][], lambda_risk: number): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> optimizePortfolio(List<Double> returns, List<List<Double>> cov, double lambdaRisk) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> optimizePortfolio(vector<double>& r, vector<vector<double>>& cov, double lambda) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.optimizePortfolio([0.1,0.2],[[0.01,0.002],[0.002,0.04]],1.0)\nprint(abs(sum(r['weights'])-1.0) < 0.01)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.optimizePortfolio([0.1,0.2],[[0.01,0.002],[0.002,0.04]],1.0)\nprint(r['expected_return'] > 0)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.optimizePortfolio([0.2,0.1],[[0.01,0.0],[0.0,0.04]],1.0)\nprint(r['weights'][0] > r['weights'][1])", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.optimizePortfolio([0.1,0.1],[[0.01,0.0],[0.0,0.01]],1.0)\nprint(len(r['weights']))", expected: "2", isPublic: false },
    { script: "sol = Solution()\nr = sol.optimizePortfolio([0.1,0.2],[[0.01,0.002],[0.002,0.04]],1.0)\nprint(r['variance'] > 0)", expected: "True", isPublic: false },
  ],
},

"DE Shaw: Statistical Hypothesis Testing": {
  company: "deshaw", pattern: "Statistics / Hypothesis Testing",
  title: "Two-Sample T-Test for Alpha",
  difficulty: "Medium",
  desc: "Given two return series (strategy vs benchmark), perform a two-sample t-test to determine if strategy outperforms. Compute: t_statistic = (mean1-mean2) / sqrt(var1/n1 + var2/n2), degrees_of_freedom = n1+n2-2 (simplified). At alpha=0.05, reject null if |t| > 2.0 (approximate critical value). Return dict with 't_stat', 'p_value_approx' (0 if |t|>2 else 1), 'significant'.",
  examples: [
    { input: "strategy=[0.01,0.02,0.015,0.01,0.02], benchmark=[0.005,0.003,0.004,0.005,0.003]", output: "{'t_stat':...,'significant':True}" }
  ],
  constraints: ["len >= 3 for each series"],
  functionSignature: "def tTest(self, strategy: List[float], benchmark: List[float]) -> dict:",
  starters: {
    Python: "from typing import List\nimport statistics, math\n\nclass Solution:\n    def tTest(self, strategy: List[float], benchmark: List[float]) -> dict:\n        pass",
    JavaScript: "var tTest = function(strategy, benchmark) {\n    \n};",
    TypeScript: "function tTest(strategy: number[], benchmark: number[]): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> tTest(List<Double> strategy, List<Double> benchmark) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> tTest(vector<double>& strategy, vector<double>& benchmark) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.tTest([0.01,0.02,0.015,0.01,0.02],[0.005,0.003,0.004,0.005,0.003])\nprint(r['significant'])", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.tTest([0.01,0.01,0.01],[0.01,0.01,0.01])\nprint(r['significant'])", expected: "False", isPublic: true },
    { script: "sol = Solution()\nr = sol.tTest([0.1,0.1,0.1,0.1,0.1],[0.0,0.0,0.0,0.0,0.0])\nprint(r['t_stat'] > 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.tTest([0.01,0.01,0.01],[0.01,0.01,0.01])\nprint(r['t_stat'])", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nr = sol.tTest([0.01,0.02,0.015,0.01,0.02],[0.005,0.003,0.004,0.005,0.003])\nprint(r['p_value_approx'])", expected: "0", isPublic: false },
  ],
},

"DE Shaw: Regime-Switching Model": {
  company: "deshaw", pattern: "HMM / Statistics",
  title: "Hidden Markov Market Regime",
  difficulty: "Hard",
  desc: "Classify each observation in a return series into 'low_vol' or 'high_vol' regime using a simple threshold approach. If abs(return) > vol_threshold -> high_vol, else low_vol. Compute: regime_switches (count of changes), avg_duration per regime, regime_pnl (sum of returns in each regime). Return dict with 'regimes'(list), 'switches', 'regime_stats'.",
  examples: [
    { input: "returns=[0.01,-0.01,0.001,-0.001,0.05,-0.04,0.001], vol_threshold=0.02", output: "classified regimes" }
  ],
  constraints: ["len(returns) >= 3", "vol_threshold > 0"],
  functionSignature: "def classifyRegimes(self, returns: List[float], vol_threshold: float) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def classifyRegimes(self, returns: List[float], vol_threshold: float) -> dict:\n        pass",
    JavaScript: "var classifyRegimes = function(returns, vol_threshold) {\n    \n};",
    TypeScript: "function classifyRegimes(returns: number[], vol_threshold: number): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> classifyRegimes(List<Double> returns, double volThreshold) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> classifyRegimes(vector<double>& returns, double thr) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.classifyRegimes([0.01,-0.01,0.001,0.05],0.02)\nprint(r['regimes'][3])", expected: "high_vol", isPublic: true },
    { script: "sol = Solution()\nr = sol.classifyRegimes([0.001,0.001,0.001],0.02)\nprint(r['switches'])", expected: "0", isPublic: true },
    { script: "sol = Solution()\nr = sol.classifyRegimes([0.05,-0.05,0.001],0.02)\nprint(r['switches'])", expected: "2", isPublic: false },
    { script: "sol = Solution()\nr = sol.classifyRegimes([0.01,0.01,0.01],0.02)\nprint(r['regimes'][0])", expected: "low_vol", isPublic: false },
    { script: "sol = Solution()\nr = sol.classifyRegimes([0.01,-0.01,0.001,0.05],0.02)\nprint(len(r['regimes']))", expected: "4", isPublic: false },
  ],
},

"DE Shaw: Monte Carlo VaR Calculator": {
  company: "deshaw", pattern: "Monte Carlo / Statistics",
  title: "Value at Risk via Monte Carlo",
  difficulty: "Hard",
  desc: "Estimate portfolio VaR using Monte Carlo. Given portfolio_value, daily_vol (sigma), num_simulations, confidence_level (e.g. 0.99), time_horizon (days). Simulate: each scenario = portfolio_value * (1 + normal(0, sigma*sqrt(horizon))). Seed random with 42 for reproducibility. VaR = portfolio_value - percentile(scenarios, (1-confidence_level)*100). Return dict with 'var_amount', 'var_percent', 'worst_loss'.",
  examples: [
    { input: "portfolio_value=1000000, daily_vol=0.01, num_sims=10000, confidence=0.99, horizon=1", output: "VaR ~23000-24000" }
  ],
  constraints: ["num_simulations >= 100", "0 < confidence < 1"],
  functionSignature: "def calculateVaR(self, portfolio_value: float, daily_vol: float, num_simulations: int, confidence_level: float, time_horizon: int) -> dict:",
  starters: {
    Python: "import random, math\n\nclass Solution:\n    def calculateVaR(self, portfolio_value: float, daily_vol: float, num_simulations: int, confidence_level: float, time_horizon: int) -> dict:\n        random.seed(42)\n        pass",
    JavaScript: "var calculateVaR = function(portfolio_value, daily_vol, num_simulations, confidence_level, time_horizon) {\n    \n};",
    TypeScript: "function calculateVaR(portfolio_value: number, daily_vol: number, num_simulations: number, confidence_level: number, time_horizon: number): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> calculateVaR(double pv, double vol, int sims, double conf, int horizon) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> calculateVaR(double pv, double vol, int sims, double conf, int horizon) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.calculateVaR(1000000, 0.01, 10000, 0.99, 1)\nprint(r['var_amount'] > 0)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.calculateVaR(1000000, 0.01, 10000, 0.99, 1)\nprint(r['var_percent'] < 0.1)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.calculateVaR(1000000, 0.0, 1000, 0.99, 1)\nprint(round(r['var_amount']))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nr1 = sol.calculateVaR(1000000,0.01,1000,0.95,1)['var_amount']\nr2 = sol.calculateVaR(1000000,0.01,1000,0.99,1)['var_amount']\nprint(r1 < r2)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.calculateVaR(1000000,0.01,1000,0.99,1)\nprint('worst_loss' in r)", expected: "True", isPublic: false },
  ],
},

"DE Shaw: Liquidity Score Calculator": {
  company: "deshaw", pattern: "Finance / Multi-Factor",
  title: "Stock Liquidity Scoring",
  difficulty: "Medium",
  desc: "Score stock liquidity using: avg_daily_volume / market_cap (30pts), bid_ask_spread_bps < 10 (25pts), 20pts if days_to_liquidate (position_size/adv) < 5, 25pts if amihud_ratio (abs_return/volume) < 0.0001. Return dict with 'score'(0-100) and 'grade': >=80->'A', >=60->'B', else->'C'.",
  examples: [
    { input: "adv=1000000, mkt_cap=1e9, spread_bps=5, pos=500000, abs_ret=0.01, vol=1e6", output: "{'score':100,'grade':'A'}" }
  ],
  constraints: ["All inputs > 0", "spread_bps > 0"],
  functionSignature: "def liquidityScore(self, adv: float, mkt_cap: float, spread_bps: float, position_size: float, abs_return: float, volume: float) -> dict:",
  starters: {
    Python: "class Solution:\n    def liquidityScore(self, adv: float, mkt_cap: float, spread_bps: float, position_size: float, abs_return: float, volume: float) -> dict:\n        pass",
    JavaScript: "var liquidityScore = function(adv, mkt_cap, spread_bps, position_size, abs_return, volume) {\n    \n};",
    TypeScript: "function liquidityScore(adv: number, mkt_cap: number, spread_bps: number, position_size: number, abs_return: number, volume: number): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> liquidityScore(double adv, double mktCap, double spreadBps, double posSize, double absRet, double vol) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> liquidityScore(double adv, double mc, double sp, double ps, double ar, double vol) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.liquidityScore(1e6,1e9,5,5e5,0.01,1e6)['grade'])", expected: "A", isPublic: true },
    { script: "sol = Solution()\nprint(sol.liquidityScore(100,1e9,50,1e7,0.001,100)['grade'])", expected: "C", isPublic: true },
    { script: "sol = Solution()\nprint(sol.liquidityScore(1e6,1e9,5,5e5,0.01,1e6)['score'])", expected: "100", isPublic: false },
    { script: "sol = Solution()\nprint(sol.liquidityScore(1e6,1e9,15,5e5,0.01,1e6)['score'])", expected: "75", isPublic: false },
    { script: "sol = Solution()\nprint(sol.liquidityScore(100,1e9,5,5e5,0.01,1e6)['score'] < 60)", expected: "True", isPublic: false },
  ],
},

"DE Shaw: Quantitative Signal Decay Analysis": {
  company: "deshaw", pattern: "Time Series / Regression",
  title: "Signal Decay Measurement",
  difficulty: "Hard",
  desc: "Measure how quickly a trading signal decays. Given signal_values and subsequent forward_returns at different horizons [1,5,10,20 days], compute information coefficient (IC) = correlation(signal, return) at each horizon. Fit exponential decay: IC(t) = IC0 * e^(-lambda*t). Return dict with ICs per horizon, 'lambda' (decay rate), 'half_life' = ln(2)/lambda.",
  examples: [
    { input: "signals=[0.5,-0.3,0.8,-0.2], returns_at_1d=[0.01,-0.005,0.015,-0.003],...", output: "IC values and decay params" }
  ],
  constraints: ["len(signals) >= 4", "horizons = [1,5,10,20]"],
  functionSignature: "def measureDecay(self, signals: List[float], returns: dict) -> dict:",
  starters: {
    Python: "from typing import List\nimport math, statistics\n\nclass Solution:\n    def measureDecay(self, signals: List[float], returns: dict) -> dict:\n        pass",
    JavaScript: "var measureDecay = function(signals, returns) {\n    \n};",
    TypeScript: "function measureDecay(signals: number[], returns: Record<string, number[]>): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> measureDecay(List<Double> signals, Map<String,List<Double>> returns) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> measureDecay(vector<double>& signals, map<string,vector<double>>& returns) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.measureDecay([1,2,3,4],{'1':[0.01,0.02,0.03,0.04],'5':[0.005,0.01,0.015,0.02],'10':[0.002,0.004,0.006,0.008],'20':[0.001,0.002,0.003,0.004]})\nprint('ic_1' in r)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.measureDecay([1,-1,1,-1],{'1':[-0.01,0.01,-0.01,0.01],'5':[-0.005,0.005,-0.005,0.005],'10':[-0.002,0.002,-0.002,0.002],'20':[-0.001,0.001,-0.001,0.001]})\nprint(r['ic_1'] < 0)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.measureDecay([1,2,3,4],{'1':[0.01,0.02,0.03,0.04],'5':[0.005,0.01,0.015,0.02],'10':[0.002,0.004,0.006,0.008],'20':[0.001,0.002,0.003,0.004]})\nprint(r['half_life'] > 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.measureDecay([1,2,3,4],{'1':[0.01,0.02,0.03,0.04],'5':[0.01,0.02,0.03,0.04],'10':[0.01,0.02,0.03,0.04],'20':[0.01,0.02,0.03,0.04]})\nprint(r['lambda'])", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nr = sol.measureDecay([1,2,3,4],{'1':[0.01,0.02,0.03,0.04],'5':[0.005,0.01,0.015,0.02],'10':[0.002,0.004,0.006,0.008],'20':[0.001,0.002,0.003,0.004]})\nprint(r['ic_1'] > r['ic_20'])", expected: "True", isPublic: false },
  ],
},

"DE Shaw: Optimal Execution with Market Impact": {
  company: "deshaw", pattern: "Dynamic Programming / Optimization",
  title: "Optimal Trade Execution Schedule",
  difficulty: "Hard",
  desc: "Find optimal execution schedule minimizing cost. Sell Q shares over T periods. Each period: temporary_impact = eta * (q_t / adv), permanent_impact (cumulative). Cost = sum(q_t * (price - eta*q_t/adv)) = sum(price*q_t - eta*q_t^2/adv). Optimal: equal-sized slices q_t = Q/T. Return list of [period, qty, expected_price, cost] and total_cost.",
  examples: [
    { input: "Q=1000, T=5, price=100, eta=0.1, adv=10000", output: "5 equal slices of 200" }
  ],
  constraints: ["Q > 0", "T >= 1", "adv > 0"],
  functionSignature: "def optimalExecution(self, Q: int, T: int, price: float, eta: float, adv: float) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def optimalExecution(self, Q: int, T: int, price: float, eta: float, adv: float) -> dict:\n        pass",
    JavaScript: "var optimalExecution = function(Q, T, price, eta, adv) {\n    \n};",
    TypeScript: "function optimalExecution(Q: number, T: number, price: number, eta: number, adv: number): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> optimalExecution(int Q, int T, double price, double eta, double adv) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> optimalExecution(int Q, int T, double price, double eta, double adv) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.optimalExecution(1000,5,100,0.1,10000)\nprint(sum(s[1] for s in r['schedule']))", expected: "1000", isPublic: true },
    { script: "sol = Solution()\nr = sol.optimalExecution(1000,5,100,0.1,10000)\nprint(r['schedule'][0][1])", expected: "200", isPublic: true },
    { script: "sol = Solution()\nr = sol.optimalExecution(1000,5,100,0.0,10000)\nprint(r['total_cost'])", expected: "100000.0", isPublic: false },
    { script: "sol = Solution()\nr = sol.optimalExecution(100,1,50,0.1,1000)\nprint(len(r['schedule']))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nr = sol.optimalExecution(1000,5,100,0.1,10000)\nprint(r['total_cost'] < 100000)", expected: "True", isPublic: false },
  ],
},

// =============================================================================
// BLOOMBERG (15 problems)
// =============================================================================

"Bloomberg: Financial Data Normalizer": {
  company: "bloomberg", pattern: "String Parsing / Data Normalization",
  title: "Bloomberg Data Field Parser",
  difficulty: "Easy",
  desc: "Parse Bloomberg-style data fields. Given a string in format 'TICKER/FIELD=VALUE' (e.g. 'AAPL US Equity/PX_LAST=185.50'), extract ticker, asset_class, field, and value. Return dict with all four. Strip extra spaces. Value can be float or string.",
  examples: [
    { input: '"AAPL US Equity/PX_LAST=185.50"', output: "{'ticker':'AAPL US Equity','asset_class':'Equity','field':'PX_LAST','value':185.5}" },
    { input: '"MSFT US Equity/NAME=Microsoft Corp"', output: "{'ticker':'MSFT US Equity','asset_class':'Equity','field':'NAME','value':'Microsoft Corp'}" }
  ],
  constraints: ["Input is well-formed Bloomberg string"],
  functionSignature: "def parseField(self, data: str) -> dict:",
  starters: {
    Python: "class Solution:\n    def parseField(self, data: str) -> dict:\n        pass",
    JavaScript: "var parseField = function(data) {\n    \n};",
    TypeScript: "function parseField(data: string): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> parseField(String data) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,string> parseField(string data) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.parseField('AAPL US Equity/PX_LAST=185.50')['field'])", expected: "PX_LAST", isPublic: true },
    { script: "sol = Solution()\nprint(sol.parseField('AAPL US Equity/PX_LAST=185.50')['value'])", expected: "185.5", isPublic: true },
    { script: "sol = Solution()\nprint(sol.parseField('MSFT US Equity/NAME=Microsoft Corp')['value'])", expected: "Microsoft Corp", isPublic: false },
    { script: "sol = Solution()\nprint(sol.parseField('SPX Index/PX_LAST=4500.0')['asset_class'])", expected: "Index", isPublic: false },
    { script: "sol = Solution()\nprint(sol.parseField('AAPL US Equity/PX_LAST=185.50')['ticker'])", expected: "AAPL US Equity", isPublic: false },
  ],
},

"Bloomberg: Fixed Income Yield Calculator": {
  company: "bloomberg", pattern: "Finance Math / Iterative",
  title: "Bond Yield to Maturity Calculator",
  difficulty: "Hard",
  desc: "Calculate yield to maturity (YTM) for a bond using Newton-Raphson iteration. Given: face_value, coupon_rate (annual), price, years_to_maturity, periods_per_year (1 or 2). YTM is the rate r such that: price = sum(coupon/(1+r)^t) + face/(1+r)^n. Use 20 iterations starting from coupon_rate/periods_per_year. Return ytm (annual rate) rounded to 6dp.",
  examples: [
    { input: "face=1000, coupon_rate=0.05, price=950, years=10, periods=2", output: "~0.0556" }
  ],
  constraints: ["price > 0", "coupon_rate > 0", "years >= 1"],
  functionSignature: "def yieldToMaturity(self, face_value: float, coupon_rate: float, price: float, years_to_maturity: int, periods_per_year: int) -> float:",
  starters: {
    Python: "class Solution:\n    def yieldToMaturity(self, face_value: float, coupon_rate: float, price: float, years_to_maturity: int, periods_per_year: int) -> float:\n        pass",
    JavaScript: "var yieldToMaturity = function(face_value, coupon_rate, price, years_to_maturity, periods_per_year) {\n    \n};",
    TypeScript: "function yieldToMaturity(face_value: number, coupon_rate: number, price: number, years_to_maturity: number, periods_per_year: number): number {\n    \n};",
    Java: "class Solution {\n    public double yieldToMaturity(double faceValue, double couponRate, double price, int years, int periods) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    double yieldToMaturity(double fv, double cr, double price, int years, int periods) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(round(sol.yieldToMaturity(1000,0.05,1000,10,2),4))", expected: "0.05", isPublic: true },
    { script: "sol = Solution()\nprint(sol.yieldToMaturity(1000,0.05,950,10,2) > 0.05)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.yieldToMaturity(1000,0.05,1050,10,2) < 0.05)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.yieldToMaturity(1000,0.1,1000,5,1) - 0.1 < 0.001)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.yieldToMaturity(1000,0.05,950,10,2) > 0)", expected: "True", isPublic: false },
  ],
},

"Bloomberg: Real-Time News Alert Classifier": {
  company: "bloomberg", pattern: "NLP-lite / Classification",
  title: "Financial News Event Classifier",
  difficulty: "Easy",
  desc: "Classify financial news headlines into event types. Keywords: 'earnings','revenue','profit','loss' -> 'earnings'; 'merger','acquisition','buyout','takeover' -> 'MA'; 'fed','rate','inflation','monetary' -> 'macro'; 'lawsuit','SEC','fraud','investigation' -> 'legal'; 'dividend','buyback','split' -> 'corporate_action'. Multiple matches: return all in a list. Else: 'other'.",
  examples: [
    { input: '"Apple announces record revenue and stock buyback"', output: "['earnings', 'corporate_action']" },
    { input: '"Fed raises interest rates amid inflation"', output: "['macro']" }
  ],
  constraints: ["headline is non-empty string"],
  functionSignature: "def classifyNews(self, headline: str) -> List[str]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def classifyNews(self, headline: str) -> List[str]:\n        pass",
    JavaScript: "var classifyNews = function(headline) {\n    \n};",
    TypeScript: "function classifyNews(headline: string): string[] {\n    \n};",
    Java: "class Solution {\n    public List<String> classifyNews(String headline) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<string> classifyNews(string headline) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.classifyNews('Apple announces record revenue and stock buyback')\nprint(sorted(result))", expected: "['corporate_action', 'earnings']", isPublic: true },
    { script: "sol = Solution()\nprint(sol.classifyNews('Fed raises interest rates amid inflation'))", expected: "['macro']", isPublic: true },
    { script: "sol = Solution()\nprint(sol.classifyNews('Random headline about nothing'))", expected: "['other']", isPublic: false },
    { script: "sol = Solution()\nprint(sol.classifyNews('SEC investigates company for fraud'))", expected: "['legal']", isPublic: false },
    { script: "sol = Solution()\nresult = sol.classifyNews('Merger announcement follows earnings miss')\nprint('MA' in result and 'earnings' in result)", expected: "True", isPublic: false },
  ],
},

"Bloomberg: Portfolio Attribution Analysis": {
  company: "bloomberg", pattern: "Finance / Attribution",
  title: "Brinson Attribution Model",
  difficulty: "Hard",
  desc: "Compute Brinson-Hood-Beebower (BHB) attribution. Given portfolio weights and benchmark weights per sector, and sector returns: allocation_effect[s] = (pw[s]-bw[s]) * (br[s] - total_benchmark_return), selection_effect[s] = bw[s] * (pr[s] - br[s]). Total attribution = sum of allocation + selection. Return dict with per-sector and total effects, rounded to 4dp.",
  examples: [
    { input: "portfolio_w=[0.6,0.4], benchmark_w=[0.5,0.5], portfolio_r=[0.12,0.08], benchmark_r=[0.10,0.09]", output: "attribution breakdown" }
  ],
  constraints: ["len of all arrays equal", "weights sum to 1.0"],
  functionSignature: "def attributePortfolio(self, portfolio_w: List[float], benchmark_w: List[float], portfolio_r: List[float], benchmark_r: List[float], sectors: List[str]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def attributePortfolio(self, portfolio_w: List[float], benchmark_w: List[float], portfolio_r: List[float], benchmark_r: List[float], sectors: List[str]) -> dict:\n        pass",
    JavaScript: "var attributePortfolio = function(portfolio_w, benchmark_w, portfolio_r, benchmark_r, sectors) {\n    \n};",
    TypeScript: "function attributePortfolio(portfolio_w: number[], benchmark_w: number[], portfolio_r: number[], benchmark_r: number[], sectors: string[]): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> attributePortfolio(List<Double> pw, List<Double> bw, List<Double> pr, List<Double> br, List<String> sectors) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> attributePortfolio(vector<double>& pw, vector<double>& bw, vector<double>& pr, vector<double>& br, vector<string>& sectors) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.attributePortfolio([0.6,0.4],[0.5,0.5],[0.12,0.08],[0.10,0.09],['tech','finance'])\nprint('total_attribution' in r)", expected: "True", isPublic: true },
    { script: "sol = Solution()\nr = sol.attributePortfolio([0.5,0.5],[0.5,0.5],[0.1,0.1],[0.1,0.1],['a','b'])\nprint(r['total_attribution'])", expected: "0.0", isPublic: true },
    { script: "sol = Solution()\nr = sol.attributePortfolio([0.6,0.4],[0.5,0.5],[0.10,0.09],[0.10,0.09],['a','b'])\nprint(round(r['total_attribution'],4))", expected: "0.0", isPublic: false },
    { script: "sol = Solution()\nr = sol.attributePortfolio([0.5,0.5],[0.5,0.5],[0.12,0.08],[0.10,0.09],['a','b'])\nprint(r['total_attribution'] > 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nr = sol.attributePortfolio([0.6,0.4],[0.5,0.5],[0.12,0.08],[0.10,0.09],['tech','finance'])\nprint(len(r['allocation_effects']))", expected: "2", isPublic: false },
  ],
},

"Bloomberg: Earnings Surprise Calculator": {
  company: "bloomberg", pattern: "Finance / Statistics",
  title: "Earnings Surprise and Momentum",
  difficulty: "Easy",
  desc: "Compute earnings surprise metrics. Given actual EPS, consensus_estimate, std_dev_of_estimates: standardized_surprise = (actual - estimate) / std_dev. Classify: > 1.0 -> 'beat', < -1.0 -> 'miss', else -> 'inline'. Also compute revision_momentum = (latest_estimate - estimate_3mo_ago) / abs(estimate_3mo_ago). Return dict with all fields.",
  examples: [
    { input: "actual=2.5, estimate=2.0, std=0.3, estimate_3mo=1.8", output: "{'surprise':1.667,'classification':'beat','revision_momentum':0.111}" }
  ],
  constraints: ["std_dev > 0", "estimate_3mo_ago != 0"],
  functionSignature: "def earningsSurprise(self, actual: float, estimate: float, std_dev: float, estimate_3mo: float) -> dict:",
  starters: {
    Python: "class Solution:\n    def earningsSurprise(self, actual: float, estimate: float, std_dev: float, estimate_3mo: float) -> dict:\n        pass",
    JavaScript: "var earningsSurprise = function(actual, estimate, std_dev, estimate_3mo) {\n    \n};",
    TypeScript: "function earningsSurprise(actual: number, estimate: number, std_dev: number, estimate_3mo: number): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> earningsSurprise(double actual, double estimate, double stdDev, double est3mo) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> earningsSurprise(double actual, double estimate, double std, double est3mo) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.earningsSurprise(2.5,2.0,0.3,1.8)['classification'])", expected: "beat", isPublic: true },
    { script: "sol = Solution()\nprint(sol.earningsSurprise(1.5,2.0,0.3,1.8)['classification'])", expected: "miss", isPublic: true },
    { script: "sol = Solution()\nprint(sol.earningsSurprise(2.1,2.0,0.3,1.8)['classification'])", expected: "inline", isPublic: false },
    { script: "sol = Solution()\nprint(round(sol.earningsSurprise(2.5,2.0,0.3,1.8)['surprise'],3))", expected: "1.667", isPublic: false },
    { script: "sol = Solution()\nprint(round(sol.earningsSurprise(2.5,2.0,0.3,1.8)['revision_momentum'],3))", expected: "0.111", isPublic: false },
  ],
},

"Bloomberg: Bloomberg Terminal Query Optimizer": {
  company: "bloomberg", pattern: "Caching / Design",
  title: "BQL Query Result Cache",
  difficulty: "Medium",
  desc: "Implement a Bloomberg Query Language (BQL) result cache. executeQuery(query_string, ttl_seconds) returns a result (simulate as hash(query)%10000) and caches it. getCached(query_string, current_time) returns cached result if not expired, else None. Cache eviction: when cache exceeds max_size, evict the least recently used. Implement with O(1) get and O(1) put.",
  examples: [
    { input: "execute('GET AAPL PX_LAST',60,t=0); getCached('GET AAPL PX_LAST',t=30)", output: "cached result" },
    { input: "getCached at t=61 (expired)", output: "None" }
  ],
  constraints: ["max_size >= 1", "ttl >= 0"],
  functionSignature: "def getCached(self, query: str, current_time: int):",
  starters: {
    Python: "from collections import OrderedDict\n\nclass BQLCache:\n    def __init__(self, max_size: int):\n        self.max_size = max_size\n        self.cache = OrderedDict()\n        self.ttls = {}\n\n    def executeQuery(self, query: str, ttl_seconds: int, current_time: int = 0) -> int:\n        pass\n\n    def getCached(self, query: str, current_time: int):\n        pass",
    JavaScript: "class BQLCache {\n    constructor(max_size) { this.maxSize = max_size; this.cache = new Map(); }\n    executeQuery(query, ttl, currentTime = 0) { return 0; }\n    getCached(query, currentTime) { return null; }\n}",
    TypeScript: "class BQLCache {\n    constructor(private maxSize: number) {}\n    executeQuery(query: string, ttl: number, currentTime: number = 0): number { return 0; }\n    getCached(query: string, currentTime: number): number | null { return null; }\n}",
    Java: "class BQLCache {\n    public BQLCache(int maxSize) {}\n    public int executeQuery(String query, int ttl, int currentTime) { return 0; }\n    public Integer getCached(String query, int currentTime) { return null; }\n}",
    "C++": "class BQLCache {\npublic:\n    BQLCache(int maxSize) {}\n    int executeQuery(string query, int ttl, int ts) { return 0; }\n    int getCached(string query, int ts) { return -1; }\n};",
  },
  testCases: [
    { script: "c = BQLCache(10)\nc.executeQuery('q1', 60, 0)\nprint(c.getCached('q1', 30) is not None)", expected: "True", isPublic: true },
    { script: "c = BQLCache(10)\nc.executeQuery('q1', 60, 0)\nprint(c.getCached('q1', 61))", expected: "None", isPublic: true },
    { script: "c = BQLCache(2)\nc.executeQuery('q1', 60, 0)\nc.executeQuery('q2', 60, 1)\nc.executeQuery('q3', 60, 2)\nprint(c.getCached('q1', 3))", expected: "None", isPublic: false },
    { script: "c = BQLCache(10)\nresult = c.executeQuery('q1', 60, 0)\nprint(c.getCached('q1', 0) == result)", expected: "True", isPublic: false },
    { script: "c = BQLCache(10)\nprint(c.getCached('nonexistent', 0))", expected: "None", isPublic: false },
  ],
},

"Bloomberg: Economic Indicator Dashboard": {
  company: "bloomberg", pattern: "Data Processing / Aggregation",
  title: "Macro Indicator Aggregator",
  difficulty: "Medium",
  desc: "Given a list of economic indicators [name, value, prev_value, unit, frequency], compute: mom_change = (value-prev)/prev*100, indicator_health ('+','0','-' for above/at/below prev). Group by frequency ('monthly','quarterly','annual'). Return dict with per-group averages, best_performer, worst_performer.",
  examples: [
    { input: "indicators=[{'name':'GDP','value':2.5,'prev':2.0,'unit':'%','frequency':'quarterly'},...]", output: "grouped stats" }
  ],
  constraints: ["1 <= indicators.length <= 100", "prev_value != 0"],
  functionSignature: "def aggregateIndicators(self, indicators: List[dict]) -> dict:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def aggregateIndicators(self, indicators: List[dict]) -> dict:\n        pass",
    JavaScript: "var aggregateIndicators = function(indicators) {\n    \n};",
    TypeScript: "function aggregateIndicators(indicators: Record<string, any>[]): Record<string, any> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Object> aggregateIndicators(List<Map<String,Object>> indicators) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> aggregateIndicators(vector<map<string,string>>& indicators) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nr = sol.aggregateIndicators([{'name':'GDP','value':2.5,'prev':2.0,'unit':'%','frequency':'quarterly'}])\nprint(r['quarterly']['best_performer'])", expected: "GDP", isPublic: true },
    { script: "sol = Solution()\nr = sol.aggregateIndicators([{'name':'CPI','value':3.0,'prev':3.5,'unit':'%','frequency':'monthly'}])\nprint(r['monthly']['best_performer'])", expected: "CPI", isPublic: true },
    { script: "sol = Solution()\nr = sol.aggregateIndicators([{'name':'X','value':100,'prev':100,'unit':'%','frequency':'annual'}])\nprint(r['annual']['best_performer'])", expected: "X", isPublic: false },
    { script: "sol = Solution()\nr = sol.aggregateIndicators([{'name':'A','value':2,'prev':1,'unit':'%','frequency':'monthly'},{'name':'B','value':1,'prev':2,'unit':'%','frequency':'monthly'}])\nprint(r['monthly']['worst_performer'])", expected: "B", isPublic: false },
    { script: "sol = Solution()\nr = sol.aggregateIndicators([{'name':'G','value':3.0,'prev':2.0,'unit':'%','frequency':'quarterly'}])\nprint(round(r['quarterly']['avg_mom_change'],2))", expected: "50.0", isPublic: false },
  ],
},

"Bloomberg: Corporate Action Processor": {
  company: "bloomberg", pattern: "Finance / Event Processing",
  title: "Corporate Action Adjustment Engine",
  difficulty: "Medium",
  desc: "Process corporate actions and adjust share prices. Actions: 'split' (ratio e.g. 2:1 doubles shares, halves price), 'dividend' (cash_amount subtracted from price), 'rights_issue' (new shares at discount_price, adjust using ex-rights formula: ex_price=(N*price+discount)/(N+1) where N=existing shares per right). Return dict with adjusted_price and adjusted_shares.",
  examples: [
    { input: "price=200, shares=1000, action='split', ratio=2", output: "{'price':100,'shares':2000}" },
    { input: "price=100, shares=1000, action='dividend', amount=5", output: "{'price':95,'shares':1000}" }
  ],
  constraints: ["price > 0", "shares > 0", "ratio > 0 for split"],
  functionSignature: "def processCorporateAction(self, price: float, shares: int, action: str, **kwargs) -> dict:",
  starters: {
    Python: "class Solution:\n    def processCorporateAction(self, price: float, shares: int, action: str, **kwargs) -> dict:\n        pass",
    JavaScript: "var processCorporateAction = function(price, shares, action, kwargs) {\n    \n};",
    TypeScript: "function processCorporateAction(price: number, shares: number, action: string, kwargs: Record<string, number>): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String,Double> processCorporateAction(double price, int shares, String action, Map<String,Double> kwargs) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    map<string,double> processCorporateAction(double price, int shares, string action, map<string,double>& kwargs) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.processCorporateAction(200,1000,'split',ratio=2)['price'])", expected: "100.0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.processCorporateAction(100,1000,'dividend',amount=5)['price'])", expected: "95.0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.processCorporateAction(200,1000,'split',ratio=2)['shares'])", expected: "2000", isPublic: false },
    { script: "sol = Solution()\nprint(sol.processCorporateAction(100,1000,'dividend',amount=5)['shares'])", expected: "1000", isPublic: false },
    { script: "sol = Solution()\nresult = sol.processCorporateAction(100,1000,'rights_issue',discount_price=80,n=4)\nprint(round(result['price'],2))", expected: "96.0", isPublic: false },
  ],
},

"Bloomberg: Relative Value Screener": {
  company: "bloomberg", pattern: "Sorting / Multi-Factor",
  title: "Relative Value Stock Screener",
  difficulty: "Medium",
  desc: "Screen stocks for relative value. Given stocks [name, pe_ratio, pb_ratio, dividend_yield, debt_equity], compute composite score: 50/pe + 30/pb + 20*dividend_yield (lower pe/pb and higher yield = better). Cap each component: pe component max 20, pb max 30, yield component max 20. Sort by score descending and return top_n stocks with their scores.",
  examples: [
    { input: "stocks=[['A',10,1.5,0.03,0.5],['B',20,3.0,0.01,1.0]], top_n=2", output: "[['A',score],['B',score]]" }
  ],
  constraints: ["pe_ratio > 0", "pb_ratio > 0", "top_n >= 1"],
  functionSignature: "def screenStocks(self, stocks: List[List], top_n: int) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def screenStocks(self, stocks: List[List], top_n: int) -> List[List]:\n        pass",
    JavaScript: "var screenStocks = function(stocks, top_n) {\n    \n};",
    TypeScript: "function screenStocks(stocks: any[][], top_n: number): any[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Object>> screenStocks(List<List<Object>> stocks, int topN) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<pair<string,double>> screenStocks(vector<tuple<string,double,double,double,double>>& s, int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nresult = sol.screenStocks([['A',10,1.5,0.03,0.5],['B',20,3.0,0.01,1.0]],2)\nprint(result[0][0])", expected: "A", isPublic: true },
    { script: "sol = Solution()\nresult = sol.screenStocks([['A',10,1.5,0.03,0.5],['B',20,3.0,0.01,1.0]],1)\nprint(len(result))", expected: "1", isPublic: true },
    { script: "sol = Solution()\nresult = sol.screenStocks([['A',10,1.5,0.03,0.5]],1)\nprint(result[0][1] > 0)", expected: "True", isPublic: false },
    { script: "sol = Solution()\nresult = sol.screenStocks([['A',5,1.0,0.05,0.5],['B',50,5.0,0.001,2.0]],2)\nprint(result[0][0])", expected: "A", isPublic: false },
    { script: "sol = Solution()\nresult = sol.screenStocks([['A',10,2.0,0.02,0.5],['B',10,2.0,0.02,0.5]],2)\nprint(round(result[0][1],4) == round(result[1][1],4))", expected: "True", isPublic: false },
  ],
},

"Bloomberg: Market Data Subscription Manager": {
  company: "bloomberg", pattern: "Observer Pattern / Design",
  title: "Real-Time Data Subscription System",
  difficulty: "Medium",
  desc: "Implement a market data subscription system. subscribe(client_id, symbol) registers interest. unsubscribe(client_id, symbol) removes it. publish(symbol, data) sends data to all subscribers of that symbol. getDelivered(client_id) returns list of all data delivered to that client. Each delivery records [symbol, data, timestamp].",
  examples: [
    { input: "subscribe('c1','AAPL'), subscribe('c2','AAPL'), publish('AAPL',185.0,1), getDelivered('c1')", output: "[['AAPL',185.0,1]]" }
  ],
  constraints: ["client_id and symbol are non-empty strings"],
  functionSignature: "def getDelivered(self, client_id: str) -> List[List]:",
  starters: {
    Python: "from typing import List\n\nclass MarketDataSystem:\n    def __init__(self):\n        self.subscriptions = {}\n        self.deliveries = {}\n\n    def subscribe(self, client_id: str, symbol: str) -> None:\n        pass\n\n    def unsubscribe(self, client_id: str, symbol: str) -> None:\n        pass\n\n    def publish(self, symbol: str, data: float, timestamp: int) -> None:\n        pass\n\n    def getDelivered(self, client_id: str) -> List[List]:\n        pass",
    JavaScript: "class MarketDataSystem {\n    constructor() { this.subs = {}; this.delivered = {}; }\n    subscribe(clientId, symbol) {}\n    unsubscribe(clientId, symbol) {}\n    publish(symbol, data, timestamp) {}\n    getDelivered(clientId) { return []; }\n}",
    TypeScript: "class MarketDataSystem {\n    private subs: Record<string, Set<string>> = {};\n    private delivered: Record<string, any[][]> = {};\n    subscribe(client_id: string, symbol: string): void {}\n    unsubscribe(client_id: string, symbol: string): void {}\n    publish(symbol: string, data: number, timestamp: number): void {}\n    getDelivered(client_id: string): any[][] { return []; }\n}",
    Java: "class MarketDataSystem {\n    public void subscribe(String clientId, String symbol) {}\n    public void unsubscribe(String clientId, String symbol) {}\n    public void publish(String symbol, double data, int ts) {}\n    public List<List<Object>> getDelivered(String clientId) { return new ArrayList<>(); }\n}",
    "C++": "class MarketDataSystem {\npublic:\n    void subscribe(string cid, string sym) {}\n    void unsubscribe(string cid, string sym) {}\n    void publish(string sym, double data, int ts) {}\n    vector<vector<double>> getDelivered(string cid) { return {}; }\n};",
  },
  testCases: [
    { script: "mds = MarketDataSystem()\nmds.subscribe('c1','AAPL')\nmds.publish('AAPL',185.0,1)\nprint(len(mds.getDelivered('c1')))", expected: "1", isPublic: true },
    { script: "mds = MarketDataSystem()\nmds.subscribe('c1','AAPL')\nmds.unsubscribe('c1','AAPL')\nmds.publish('AAPL',185.0,1)\nprint(len(mds.getDelivered('c1')))", expected: "0", isPublic: true },
    { script: "mds = MarketDataSystem()\nmds.subscribe('c1','AAPL')\nmds.subscribe('c2','AAPL')\nmds.publish('AAPL',185.0,1)\nprint(len(mds.getDelivered('c2')))", expected: "1", isPublic: false },
    { script: "mds = MarketDataSystem()\nmds.publish('AAPL',185.0,1)\nprint(mds.getDelivered('c1'))", expected: "[]", isPublic: false },
    { script: "mds = MarketDataSystem()\nmds.subscribe('c1','AAPL')\nmds.publish('AAPL',185.0,1)\nmds.publish('AAPL',186.0,2)\nprint(len(mds.getDelivered('c1')))", expected: "2", isPublic: false },
  ],
},

} // END FINTECH_PROBLEM_BANK
