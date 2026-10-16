// src/content/cs-fundamentals/networks/interview/httpHttps.interview.ts

import type { InterviewQuestion } from "@/types";

const httpHttpsInterviewQuestions: InterviewQuestion[] = [
  {
    id: "http-https-iv-1",
    question: "What does it mean for HTTP to be 'stateless,' and how do web applications maintain login sessions despite this?",
    difficulty: "Easy",
    detailedAnswer:
      "Statelessness means the server treats each HTTP request as fully independent — it retains no memory of any previous request from that same client purely at the protocol level. To maintain something like a login session across many requests, applications layer state on top: cookies let the server hand the client a small piece of data (often a session ID) that the browser automatically resends on every subsequent request; the server then looks up that session ID in server-side storage to recall who the user is. Alternatively, token-based approaches like JWTs embed the user's identity/claims directly in a signed token the client holds, so the server can verify it without any server-side session lookup at all.",
    idealAnswer:
      "HTTP itself has no memory — every request stands alone, so the server has no idea if a request came from someone who was just logged in a second ago unless something explicitly tells it. That's what cookies and sessions solve: the server sets a cookie with a session ID, the browser automatically sends that cookie back on every future request, and the server uses it to look up who you are. Tokens like JWTs do something similar but self-contained — the token itself carries signed claims about identity, so the server can verify it without needing a database lookup for every request.",
    interviewerExpectations: [
      "Correctly defines statelessness at the protocol level",
      "Explains cookies + session ID as the classic mechanism",
      "Bonus: mentions token-based (JWT) alternative and its trade-off (no server-side lookup needed)",
    ],
    followUpQuestions: [
      "What's the security risk of storing a session token in a way that's accessible to JavaScript (XSS)?",
      "Why might a token-based approach scale better than server-side sessions?",
      "What happens if a JWT needs to be revoked before it expires?",
    ],
    commonMistakes: [
      "Saying HTTP 'has cookies built in' as if cookies were part of the core stateless protocol design rather than a bolt-on mechanism",
      "Not being able to explain what a session ID actually does",
    ],
    discussionPoints: ["Statelessness", "Cookies and sessions", "Token-based auth (JWT)"],
  },
  {
    id: "http-https-iv-2",
    question: "Explain, at a high level, what happens during a TLS handshake when a browser connects to an HTTPS site.",
    difficulty: "Medium",
    detailedAnswer:
      "The client sends a ClientHello listing supported TLS versions, cipher suites, and a random value. The server responds with a ServerHello choosing the cipher suite, plus its digital certificate (containing its public key, signed by a Certificate Authority) and its own random value. The client validates the certificate against its trusted CA chain to confirm the server's identity, then both sides use asymmetric key exchange (in TLS 1.3, typically ephemeral Diffie-Hellman) to agree on a shared secret without ever transmitting that secret directly over the wire. From that shared secret, both derive symmetric session keys. From that point forward, all application data — the actual HTTP request/response — is encrypted using fast symmetric encryption, not the slower asymmetric kind, which is only used briefly to bootstrap trust and the key exchange.",
    idealAnswer:
      "Roughly: client says hello with what it supports, server says hello back with its chosen cipher and its certificate. The browser checks that certificate against a trusted CA to make sure it's really talking to who it thinks it is, then both sides do a key exchange — asymmetric crypto, so nobody watching the wire can derive the shared secret even though the exchange happens in plaintext-visible messages — and from that shared secret they generate symmetric session keys. Everything after that, the actual HTTP traffic, is encrypted with those fast symmetric keys. The reason for switching from asymmetric to symmetric is performance — asymmetric crypto is much slower, so it's only used briefly to safely establish a shared secret, then the cheap, fast symmetric encryption handles the actual bulk data.",
    interviewerExpectations: [
      "Correct high-level sequence: hello messages, certificate validation, key exchange, session key derivation",
      "Explains why asymmetric crypto is used briefly and symmetric for bulk data (performance)",
      "Doesn't need exact TLS 1.3 message names, but should get the conceptual flow right",
    ],
    followUpQuestions: [
      "Why can't the entire session just use asymmetric encryption throughout?",
      "What does the browser actually check when validating a certificate?",
      "How does TLS 1.3 reduce handshake round trips compared to TLS 1.2?",
    ],
    commonMistakes: [
      "Saying HTTPS uses only asymmetric encryption for the whole session",
      "Not knowing that certificate validation against a CA is part of the handshake",
    ],
    discussionPoints: ["ClientHello/ServerHello", "Certificate validation", "Asymmetric key exchange -> symmetric session keys"],
  },
  {
    id: "http-https-iv-3",
    question: "Why is a POST request generally not safe to retry automatically, while GET, PUT, and DELETE usually are?",
    difficulty: "Medium",
    detailedAnswer:
      "GET, PUT, and DELETE are defined by the HTTP spec to be idempotent — issuing the same request multiple times should leave the resource in the same end state as issuing it once (GET doesn't change state at all; PUT replaces to a specific target state regardless of prior state; DELETE removes a resource, and deleting an already-deleted resource is a no-op state-wise). POST, by contrast, is defined as 'process this according to the resource's own semantics,' which commonly means 'create a new thing' — so retrying a POST (e.g., after a timeout where the client never received the response, but the server actually processed it) risks creating a duplicate resource or performing an action twice, like double-charging a payment. This is exactly why idempotency keys exist: some APIs let the client attach a unique key to a POST specifically so the server can detect and safely ignore a retried duplicate.",
    idealAnswer:
      "It comes down to idempotency. GET doesn't change anything, so repeating it is harmless. PUT and DELETE are designed so that no matter how many times you send them, the end result is the same — PUT sets a resource to a specific state, DELETE removes it, and doing either twice doesn't compound. POST is different — it usually means 'create' or 'do this action,' and if a client times out waiting for a response and retries, it has no way of knowing if the original request actually succeeded server-side or not, so blindly retrying can create a duplicate resource or double-trigger an action, like charging a customer twice. That's why a lot of payment and order-creation APIs support idempotency keys — a client-generated unique ID attached to the POST so the server can recognize and safely no-op a retry.",
    interviewerExpectations: [
      "Correctly defines idempotency and applies it to each method",
      "Explains the concrete real-world risk (duplicate resource/double action) of retrying POST",
      "Bonus: mentions idempotency keys as the practical solution",
    ],
    followUpQuestions: [
      "How would you design an idempotency key mechanism server-side?",
      "Is PATCH idempotent? Why or why not, in general?",
      "How does this idempotency concern change in a distributed systems / at-least-once delivery context?",
    ],
    commonMistakes: [
      "Confusing 'idempotent' with 'safe' (GET is both; POST is neither by default, but a method can technically be safe without being idempotent, or vice versa in edge cases)",
      "Not offering a concrete real-world consequence like double payment",
    ],
    discussionPoints: ["Idempotency semantics", "Retry safety", "Idempotency keys"],
  },
  {
    id: "http-https-iv-4",
    question: "Users report your site is down. How do you quickly determine whether this is a DNS issue, a TLS/certificate issue, or an application-layer issue?",
    difficulty: "Hard",
    detailedAnswer:
      "I'd separate the failure into layers and test each independently. First, DNS: run `dig`/`nslookup` on the domain — if it doesn't resolve, or resolves to an unexpected IP, that's a DNS problem (expired domain, misconfigured record, DNS provider outage) and everything downstream is irrelevant until that's fixed. If DNS resolves correctly, next test the TLS layer directly: `curl -v https://example.com` or `openssl s_client -connect example.com:443` shows the certificate chain, its expiry, and whether the handshake completes at all — an expired certificate, a certificate for the wrong hostname, or a broken intermediate chain shows up clearly here as a handshake failure or a certificate warning, distinct from a DNS failure or a connection refusal. If TLS completes successfully but the request still fails, the problem is at the application layer — check the actual HTTP status code and response body/logs: a 5xx suggests the app or its dependencies (database, downstream service) are unhealthy, while a connection timeout after successful TLS suggests the app process itself might be down or overloaded even though the network path is fine.",
    idealAnswer:
      "I'd test each layer in order and isolate where it actually breaks. First DNS — does `dig` resolve the domain to the IP I expect? If not, that's the whole problem right there. If DNS is fine, next I'd hit the site directly with `curl -v` or use `openssl s_client` to look at the TLS handshake specifically — that shows me immediately if there's a certificate problem, like it being expired or issued for the wrong domain, versus the connection just being refused outright, which would point elsewhere. If TLS completes fine and I still get a bad response, now I know it's an application issue — check the actual status code and server logs, because a 502/503 usually means the app or something it depends on, like a database, is unhealthy, versus a timeout which might mean the app process itself is stuck or down. Going layer by layer like that stops you from guessing and chasing the wrong fix.",
    interviewerExpectations: [
      "Proposes a clear, ordered layer-by-layer isolation strategy (DNS -> TLS -> application)",
      "Names concrete tools for each layer (dig/nslookup, openssl s_client/curl -v, status codes/logs)",
      "Can explain what symptom at each layer would look like",
    ],
    followUpQuestions: [
      "What would an expired certificate error actually look like to an end user versus a DNS failure?",
      "How would you distinguish a 502 from a 504 in terms of root cause?",
      "How would a CDN or reverse proxy in front of your app change this debugging approach?",
    ],
    commonMistakes: [
      "Jumping straight to 'restart the server' without isolating which layer actually failed",
      "Not knowing any concrete tooling to inspect TLS/certificate state directly",
    ],
    discussionPoints: ["Layered isolation (DNS -> TLS -> app)", "dig/openssl s_client/curl diagnostics", "Status code triage"],
    scenarioBased: true,
  },
  {
    id: "http-https-iv-5",
    question: "What problem does HTTP/2 solve compared to HTTP/1.1, and does HTTP/3 fully solve the remaining problem?",
    difficulty: "Hard",
    detailedAnswer:
      "HTTP/1.1 processes requests on a given TCP connection largely in order, so a slow response at the front of the queue blocks everything behind it on that same connection — application-layer head-of-line blocking. Browsers historically worked around this by opening multiple parallel TCP connections per host (commonly 6), which helps but adds its own overhead (multiple TCP handshakes, multiple slow-start ramp-ups, and competing congestion control state). HTTP/2 solves this at the protocol level with multiplexing: many logical request/response streams are interleaved as binary frames over a single TCP connection, so one slow stream no longer blocks others on the same connection. However, HTTP/2 still runs over TCP, and TCP itself guarantees in-order byte delivery at the transport layer — so if a single TCP packet is lost, TCP holds up delivery of all subsequent bytes (across every multiplexed stream) until that lost packet is retransmitted, reintroducing head-of-line blocking at the transport layer even though HTTP/2 fixed it at the application layer. HTTP/3 addresses this remaining gap by running over QUIC, a transport built on UDP, where each stream's loss recovery is independent — losing a packet belonging to one stream no longer stalls the others.",
    idealAnswer:
      "HTTP/1.1's issue is that on a single connection, requests are basically handled in order, so one slow one blocks everything queued behind it — browsers just opened multiple connections in parallel to work around that, which isn't free either. HTTP/2 fixes it properly at the application layer: it multiplexes many requests over one connection using binary framing, so they don't block each other anymore on that connection. But HTTP/2 is still riding on top of TCP, and TCP itself delivers bytes strictly in order — so if one packet gets lost, TCP holds everything up, across all the multiplexed streams, until that packet is retransmitted. That's head-of-line blocking again, just moved down to the transport layer. HTTP/3 is the actual fix for that — it runs over QUIC on UDP instead of TCP, where each stream handles its own loss recovery independently, so losing a packet for one stream doesn't stall the others.",
    interviewerExpectations: [
      "Correctly identifies HTTP/1.1's head-of-line blocking and the multi-connection workaround",
      "Explains HTTP/2's multiplexing as an application-layer fix",
      "Critically, recognizes that TCP-level head-of-line blocking still exists in HTTP/2, and that HTTP/3/QUIC is what addresses it",
    ],
    followUpQuestions: [
      "Why does QUIC use UDP instead of building a new protocol directly on IP?",
      "What other benefits does QUIC provide beyond solving head-of-line blocking (e.g., connection migration)?",
      "Would you expect HTTP/2's benefits to matter on a low-latency LAN vs a high-latency mobile connection?",
    ],
    commonMistakes: [
      "Stopping at 'HTTP/2 fixed head-of-line blocking' without noting the TCP-level version still exists",
      "Not knowing HTTP/3 is built on QUIC/UDP rather than an improved version of TCP",
    ],
    discussionPoints: ["Application-layer vs transport-layer head-of-line blocking", "HTTP/2 multiplexing", "QUIC/HTTP/3"],
  },
];

export default httpHttpsInterviewQuestions;
