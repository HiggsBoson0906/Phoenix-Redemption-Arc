// src/content/cs-fundamentals/networks/articles/httpHttps.ts

import type { Article } from "@/types";

const httpHttpsArticle: Article = {
  slug: "http-https",
  title: "HTTP & HTTPS",
  summary:
    "HTTP is the request-response protocol that powers the web; HTTPS is HTTP layered on top of TLS encryption, turning every request into a private, tamper-proof conversation between client and server.",
  readingTimeMins: 9,
  beginnerExplanation:
    "HTTP (HyperText Transfer Protocol) is a simple, textual request-response protocol: a client (usually a browser) sends a request like 'GET me the homepage,' and a server sends back a response with a status ('200 OK, here's the HTML') and, usually, a body of data. It's the language browsers and web servers use to talk to each other. HTTPS is exactly the same protocol, but wrapped inside TLS (Transport Layer Security) — an encryption layer that scrambles the conversation so anyone eavesdropping on the network (an ISP, a coffee-shop Wi-Fi attacker, a nosy router in between) sees only unreadable ciphertext instead of your password, session cookie, or the page content itself.\n\nHTTP by itself is stateless — the server has no built-in memory of who you are between one request and the next, which is why the web relies on cookies, tokens, and sessions to fake continuity across separate, otherwise-unrelated requests.",
  detailedBreakdown:
    "An HTTP request has a method, a path, headers, and optionally a body. The common methods each carry semantic meaning: GET retrieves a resource and should have no side effects (safe and idempotent); POST creates a resource or triggers a side-effecting action (not idempotent — sending it twice can create two resources); PUT replaces a resource entirely and is idempotent (sending it twice yields the same end state); PATCH partially updates a resource; DELETE removes a resource and is idempotent. Idempotency here matters practically: clients and proxies are allowed to safely retry GET, PUT, and DELETE on failure/timeout without worrying about duplicating an action, but retrying a raw POST can be dangerous (e.g., double-charging a payment) unless the API is explicitly designed with idempotency keys.\n\nHTTP status codes are grouped by their leading digit: 1xx is informational (rarely seen directly, e.g., 100 Continue); 2xx means success (200 OK, 201 Created, 204 No Content); 3xx means redirection (301 Moved Permanently, 302 Found/temporary redirect, 304 Not Modified for cache validation); 4xx means the client made an error (400 Bad Request, 401 Unauthorized — not authenticated, 403 Forbidden — authenticated but not allowed, 404 Not Found, 429 Too Many Requests); 5xx means the server failed to fulfill a valid request (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout). Recognizing the category from the first digit alone is often enough to triage a problem quickly.\n\nHTTP's statelessness — each request is handled independently, with no memory of prior requests — is why cookies (client-stored data sent back on every request), sessions (server-side state keyed by a cookie-held session ID), and tokens (like JWTs, self-contained and verifiable without server-side lookup) exist: they're all ways of layering continuity on top of a fundamentally memoryless protocol. HTTP/1.1 (still extremely common) supports persistent (keep-alive) connections and pipelining in theory, but suffers from head-of-line blocking — requests on a single connection are processed in order, so one slow request blocks everything queued behind it, which is why browsers open multiple parallel TCP connections per host to compensate. HTTP/2 addresses this at the protocol level with multiplexing — multiple requests and responses interleave over a single TCP connection using binary framing, eliminating application-layer head-of-line blocking (though TCP-level head-of-line blocking on packet loss still exists, which HTTP/3, built on QUIC/UDP, was designed to fix). HTTP/2 also adds header compression (HPACK) and server push.\n\nHTTPS secures HTTP by running it over TLS. The TLS handshake, at a high level: the client sends a ClientHello (supported TLS versions, cipher suites, a random value); the server responds with a ServerHello (chosen cipher suite, its digital certificate containing its public key, another random value); the client verifies the certificate against a trusted certificate authority (CA) chain, then the two sides use asymmetric cryptography to establish a shared secret (in modern TLS 1.3, this is done efficiently via ephemeral Diffie-Hellman key exchange); from that shared secret, both sides derive symmetric session keys, and all subsequent application data (the actual HTTP request/response) is encrypted with fast symmetric encryption, not the slower asymmetric kind. This is why HTTPS uses asymmetric crypto only briefly, to bootstrap trust and exchange a key, then switches to symmetric encryption for the bulk data — combining asymmetric crypto's key-exchange security with symmetric crypto's speed. HTTPS runs on port 443 by default, versus HTTP's port 80.",
  realWorldExamples:
    "Every modern browser marks plain HTTP sites as 'Not Secure' in the address bar, and browsers/search engines actively penalize non-HTTPS sites, which is why HTTPS adoption became close to universal after free certificate authorities like Let's Encrypt removed the cost barrier. REST APIs lean heavily on HTTP methods and status codes as their core vocabulary — a well-designed API returns 201 for a successful resource creation, 404 when a resource genuinely doesn't exist, and 429 when a client is rate-limited, letting API consumers build correct retry logic just from the status code category. HTTP/2's multiplexing is why modern sites bundle far fewer 'combine all JS into one file' hacks than they used to — with HTTP/1.1's per-connection limits, bundling many small files into fewer large ones was a real performance win, but HTTP/2 reduced (though didn't eliminate) that need.",
  useCases: [
    "Serving and fetching web pages, images, scripts, and API responses between browsers/clients and servers",
    "Building REST APIs where HTTP methods and status codes form the API's core semantic contract",
    "Securing any sensitive data in transit (logins, payments, personal data) via HTTPS/TLS",
    "Caching and conditional requests (304 Not Modified) to reduce redundant data transfer",
  ],
  advantages: [
    "Simple, human-readable, and universally supported — nearly every language/platform has mature HTTP tooling",
    "Stateless design makes servers easier to scale horizontally, since any server can handle any request without shared session affinity (when state is externalized properly)",
    "HTTPS provides confidentiality, integrity, and server authenticity essentially 'for free' once a certificate is set up, protecting against eavesdropping and tampering",
  ],
  disadvantages: [
    "Plain HTTP is completely unencrypted — credentials, cookies, and content are visible to anyone on the network path",
    "HTTP/1.1's per-connection head-of-line blocking limits real-world performance, requiring workarounds (parallel connections, bundling) that HTTP/2 later reduced the need for",
    "TLS handshakes add latency (extra round trips) before any application data can flow, though TLS 1.3 and session resumption significantly reduce this cost",
  ],
  commonMisconceptions: [
    "\"HTTPS is just HTTP with a password\" — HTTPS is HTTP tunneled through TLS encryption; it has nothing to do with application-level login credentials.",
    "\"GET requests can't have side effects if the server author is careless\" — semantically GET should be side-effect-free, but nothing technically stops a poorly designed API from mutating data on GET; that's a design bug, not a protocol guarantee.",
    "\"POST and PUT are interchangeable\" — PUT is meant to be idempotent (same result no matter how many times you send it); POST is not, which matters enormously for safe retry behavior.",
    "\"HTTPS only encrypts the password field\" — HTTPS encrypts the entire request and response, including headers, cookies, URLs, and body, not just specific fields.",
    "\"401 and 403 mean the same thing\" — 401 means 'you're not authenticated at all' (or your credentials are invalid); 403 means 'you're authenticated, but not allowed to do this.'",
  ],
  interviewPerspective:
    "HTTP methods, status code categories, and the statelessness/cookies relationship are baseline expected knowledge for any web-adjacent SDE role. Beyond basics, interviewers probe idempotency (which methods are safe to retry and why it matters for distributed systems reliability), the practical difference between HTTP/1.1 and HTTP/2 (multiplexing, head-of-line blocking), and a high-level but accurate walk-through of the TLS handshake and why asymmetric crypto is used only briefly before switching to symmetric. A frequent scenario question is distinguishing a DNS problem from a TLS/certificate problem from an application error when a service is 'down.'",
  oaPerspective:
    "OA MCQs commonly test matching status codes to their category and meaning (e.g., which code means 'resource created' vs 'not authorized' vs 'server error'), identifying which HTTP methods are idempotent, default ports (80 for HTTP, 443 for HTTPS), and basic TLS/handshake terminology (certificate, symmetric vs asymmetric key usage).",
  keyTakeaways: [
    "HTTP is a stateless, text-based request-response protocol; state is layered on top via cookies, sessions, or tokens.",
    "Method semantics matter: GET/PUT/DELETE are idempotent and safe to retry; POST is not, by default.",
    "Status code categories: 2xx success, 3xx redirection, 4xx client error, 5xx server error — memorize a few specific codes in each (200, 201, 301, 304, 400, 401, 403, 404, 429, 500, 502, 503).",
    "HTTPS = HTTP over TLS: asymmetric crypto bootstraps a shared secret during the handshake, then fast symmetric encryption protects the actual data.",
    "HTTP/2 multiplexes many requests over one TCP connection, fixing HTTP/1.1's application-layer head-of-line blocking.",
  ],
  summaryClosing:
    "HTTP gives the web a shared, simple request-response vocabulary, and HTTPS wraps that vocabulary in TLS so the conversation stays private and tamper-proof — together they form the contract that virtually every browser, mobile app, and API integration on the internet depends on, which is exactly why interviewers expect you to know both the protocol mechanics and the practical operational trade-offs cold.",
  relatedTopics: ["DNS", "TCP vs UDP", "Network Security Fundamentals", "Sockets & Client-Server Communication"],
  furtherReading: [
    { label: "RFC 9110 — HTTP Semantics", note: "The current standards-track document defining HTTP methods, status codes, and headers." },
    { label: "\"Illustrated TLS 1.3 Connection\" (tls13.xargs.org)", note: "A byte-by-byte visual walkthrough of the modern TLS handshake." },
  ],
};

export default httpHttpsArticle;
