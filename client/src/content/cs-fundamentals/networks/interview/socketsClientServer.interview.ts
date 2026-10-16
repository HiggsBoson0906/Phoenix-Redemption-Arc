// src/content/cs-fundamentals/networks/interview/socketsClientServer.interview.ts

import type { InterviewQuestion } from "@/types";

const socketsClientServerInterviewQuestions: InterviewQuestion[] = [
  {
    id: "sockets-client-server-iv-1",
    question: "What is a socket, and what are the core steps a server goes through to accept a client's TCP connection?",
    difficulty: "Easy",
    detailedAnswer:
      "A socket is the OS-level endpoint an application uses to send and receive data over the network — the concrete handle through which bytes actually flow, identified by a combination of protocol, local address/port, and (once connected) the remote address/port. A server sets one up in four steps: socket() creates the socket; bind() attaches it to a specific local IP and port so clients can find it; listen() marks it ready to accept incoming connections and defines a backlog queue for pending ones; accept() blocks until a client connects, then returns a brand-new socket dedicated to that specific connection, while the original listening socket stays free to accept further clients.",
    idealAnswer:
      "A socket is just the OS's handle for a network endpoint — the thing your code actually reads from and writes to when talking over the network. On the server side there's a clear sequence: create the socket, bind it to a known IP and port so clients know where to find it, call listen() to say 'I'm ready for connections' and set up a queue for pending ones, then accept() blocks and hands back a brand new socket every time a client connects — importantly, that's a different socket from the one you're listening on, which is exactly what lets the server keep accepting new clients while already-connected ones are being served.",
    interviewerExpectations: [
      "Defines a socket clearly as the OS-level network endpoint",
      "Names the correct server-side call order: socket, bind, listen, accept",
      "Understands accept() returns a distinct socket per connection",
    ],
    followUpQuestions: [
      "What does the client side's call sequence look like by comparison?",
      "What happens if two processes try to bind() to the same port?",
      "What is the backlog parameter in listen() actually controlling?",
    ],
    commonMistakes: [
      "Mixing up the order of bind/listen/accept",
      "Thinking the listening socket itself becomes the connected socket, rather than accept() returning a new one",
    ],
    discussionPoints: ["Socket definition", "Server call sequence", "Listening vs accepted socket"],
  },
  {
    id: "sockets-client-server-iv-2",
    question: "How can a server handle thousands of simultaneous client connections when they're all connecting to the exact same port, like 443?",
    difficulty: "Medium",
    detailedAnswer:
      "The key insight is that a TCP connection isn't identified by the server port alone — it's identified by the full 4-tuple: (client IP, client port, server IP, server port). The server port stays constant (443), but each client has a distinct IP and/or a distinct ephemeral source port, so every connection's 4-tuple is unique even though they all share the same destination port on the server. The OS's TCP stack uses this 4-tuple to demultiplex incoming packets to the correct per-connection socket (the one returned by that client's earlier accept() call), so the application never has to manually distinguish clients by port — the kernel already routes each connection's data to the right socket.",
    idealAnswer:
      "It comes down to the fact that a connection isn't just 'the server port' — it's actually identified by four things together: client IP, client port, server IP, and server port. The server port is the same for everyone, 443, but every client has its own IP and its own randomly assigned source port, so that full combination is unique per connection even when thousands of clients are all hitting port 443. The kernel tracks connections by that whole tuple, so it already knows exactly which accepted socket a given incoming packet belongs to — the application doesn't have to do any of that routing itself.",
    interviewerExpectations: [
      "Correctly names the 4-tuple as the actual connection identifier",
      "Explains that the server port alone is not what distinguishes connections",
      "Understands the kernel handles demultiplexing to the correct socket automatically",
    ],
    followUpQuestions: [
      "What happens if two different clients happen to pick the same ephemeral source port?",
      "How does this differ for UDP, which is connectionless?",
      "What OS-level limits might you hit before you hit any 'port' limit at high connection counts (e.g., file descriptors)?",
    ],
    commonMistakes: [
      "Claiming the server somehow opens a new port per client",
      "Not knowing what the 4-tuple actually consists of",
    ],
    discussionPoints: ["4-tuple connection identity", "Kernel-level demultiplexing", "Ephemeral client ports"],
  },
  {
    id: "sockets-client-server-iv-3",
    question: "When would you choose a raw UDP socket over a TCP socket for an application you're designing?",
    difficulty: "Medium",
    detailedAnswer:
      "UDP makes sense when low, predictable latency matters more than guaranteed, ordered delivery, and when the application can tolerate or actively prefers dropping stale data rather than waiting for it. Real-time multiplayer games are the classic example: a player-position update packet lost in transit is far better replaced by the next, more current update than retransmitted and delivered late — TCP's retransmission and in-order delivery guarantees would actually make the experience worse by holding up newer data behind a resend of stale data (head-of-line blocking). Live audio/video streaming has similar characteristics — a dropped video frame briefly is preferable to a stall while waiting for it to be retransmitted. DNS also uses UDP by default for its query/response exchanges, since a single small request/response round trip doesn't benefit meaningfully from TCP's connection setup overhead, and a lost query can simply be retried by the application at a higher level. The general pattern: choose UDP when you'd rather build your own lightweight, application-specific reliability (or accept none at all) than pay for TCP's generalized guarantees you don't fully need.",
    idealAnswer:
      "I'd reach for UDP when what matters most is getting the freshest data out with minimal latency, and where losing an occasional packet is genuinely fine — or even preferable to waiting for it. The go-to example is a multiplayer game sending position updates constantly; if one gets lost, you don't want it retransmitted and delivered late, blocking newer updates behind it — you just want the next update to arrive as fast as possible. Live video/audio streaming is similar. DNS is another case — it's a single small request and response, so paying for a TCP handshake for every query isn't worth it, and if a query gets lost, the application can just retry. Basically, UDP is the right call whenever TCP's reliability and ordering guarantees would cost you more in latency than they're worth for that specific use case.",
    interviewerExpectations: [
      "Names at least one concrete, well-reasoned use case (gaming, live media, DNS)",
      "Explains why TCP's guarantees would specifically hurt in that scenario (head-of-line blocking, latency)",
      "Understands this is a deliberate trade-off, not UDP being 'worse' TCP",
    ],
    followUpQuestions: [
      "If you use UDP but still need some reliability, how would you build that yourself?",
      "How does QUIC (used by HTTP/3) get some of TCP's benefits while still running over UDP?",
      "What would go wrong if you used UDP for a file transfer application without any additional logic?",
    ],
    commonMistakes: [
      "Framing UDP as simply 'the unreliable, worse option' rather than a deliberate design trade-off",
      "Not being able to explain why TCP's guarantees are actually harmful in the chosen use case",
    ],
    discussionPoints: ["Latency vs reliability trade-off", "Head-of-line blocking", "DNS/gaming/streaming as UDP use cases"],
  },
  {
    id: "sockets-client-server-iv-4",
    question: "Your production API server starts throwing 'too many open files' errors under load, and you suspect socket/connection exhaustion. How would you investigate and confirm this?",
    difficulty: "Hard",
    detailedAnswer:
      "Since each open socket consumes a file descriptor, 'too many open files' is a strong hint the process has hit its file descriptor limit (visible/configurable via `ulimit -n`), often due to leaked sockets that were opened but never properly closed. I'd first check current usage with `lsof -p <pid> | wc -l` or `/proc/<pid>/fd` to count actual open file descriptors for the process, and compare against the configured limit. Next, I'd inspect the nature of those descriptors: `ss -tnp` or `netstat -antp` shows the actual TCP connections and their states — a large number of connections stuck in states like CLOSE_WAIT specifically points at a code-level bug where the remote side closed the connection but the application never called close() on its end, which is a classic socket leak pattern (as opposed to TIME_WAIT buildup, which is a normal, self-expiring state after an active close and less often the true culprit for exhaustion). If it's an outbound-connection-heavy service (like one calling a downstream API or database per request without pooling), I'd check whether a connection pool exists and is being used correctly, versus the code opening a fresh unpooled connection per request and failing to release it. Once identified, the fix is usually either fixing a leak (ensuring connections are closed/released in a `finally`/`defer`-style guaranteed path) or properly configuring/using a connection pool with sane limits and timeouts.",
    idealAnswer:
      "Since a socket eats a file descriptor, 'too many open files' basically means the process ran out of that budget — so my first move is to actually count what's open, with something like `lsof -p <pid> | wc -l`, and compare that against the configured `ulimit -n`. Then I'd look at what those open connections actually are — `ss -tnp` shows me the TCP connections and their states, and if I see a big pile stuck in CLOSE_WAIT, that's a strong signal of a real leak: the other side closed the connection, but our code never called close() on its end, so the descriptor never gets freed. That's different from TIME_WAIT, which is normal and self-clears, so I wouldn't chase that as the root cause. If this is a service making a lot of outbound calls, I'd also check if there's a connection pool in play at all, or if it's just opening a new unpooled connection per request and leaking it. Once I've found the actual leak pattern, the fix is making sure sockets get closed on every code path, including error paths, or fixing the pool configuration if that's actually the gap.",
    interviewerExpectations: [
      "Connects 'too many open files' directly to file descriptor / socket exhaustion",
      "Names concrete diagnostic commands (lsof, ss/netstat) and what to look for (CLOSE_WAIT specifically)",
      "Distinguishes a genuine leak pattern (CLOSE_WAIT) from a normal, self-expiring state (TIME_WAIT)",
    ],
    followUpQuestions: [
      "What's the difference between CLOSE_WAIT and TIME_WAIT, and why does that distinction matter here?",
      "How would connection pooling both help and potentially introduce its own exhaustion risk if misconfigured?",
      "What would you check first if this were happening only under high load but not at baseline traffic?",
    ],
    commonMistakes: [
      "Not knowing any concrete tooling (lsof, ss/netstat) to actually diagnose the issue",
      "Confusing CLOSE_WAIT (application-side leak) with TIME_WAIT (normal post-close state)",
    ],
    discussionPoints: ["File descriptor limits", "lsof/ss diagnostics", "CLOSE_WAIT vs TIME_WAIT", "Connection pooling"],
    scenarioBased: true,
  },
  {
    id: "sockets-client-server-iv-5",
    question: "Walk me through, at the socket level, what actually happens from the moment a browser calls connect() to an HTTPS server through to receiving the first bytes of the HTTP response.",
    difficulty: "Hard",
    detailedAnswer:
      "The browser's networking stack creates a TCP socket and calls connect() to the server's resolved IP on port 443. This triggers the TCP three-way handshake: SYN from client, SYN-ACK from server, ACK from client — after which a reliable, ordered byte-stream connection exists between the client's socket and the server's per-connection socket (the one its accept() call returned). On top of this now-established TCP connection, a TLS handshake runs: ClientHello, ServerHello with certificate, key exchange, and derivation of symmetric session keys, after which both sides can encrypt/decrypt application data. The browser then writes the HTTP request bytes (method, path, headers, body) into the socket via a system call like send()/write(); these bytes are encrypted by the TLS layer, segmented and sequenced by TCP, encapsulated in IP packets, and physically transmitted across however many network hops (switches, routers) sit between client and server. On the server, the corresponding accepted socket's kernel buffer receives the incoming bytes, TCP reassembles them into the original ordered stream, TLS decrypts them, and the application-layer HTTP server code reads them via recv()/read(), parses the HTTP request, and begins constructing a response — which then makes the identical journey in reverse.",
    idealAnswer:
      "Starting from connect(): the OS does a TCP three-way handshake with the server — SYN, SYN-ACK, ACK — and once that's done we have a real, reliable byte-stream connection between our socket and whatever socket the server's accept() call handed back for us specifically. Since it's HTTPS, a TLS handshake runs next on top of that TCP connection — hellos, certificate check, key exchange — ending with both sides holding the same symmetric session keys. Only after that does the actual HTTP request go out: the browser writes those bytes to the socket, TLS encrypts them, TCP breaks them into segments and guarantees they'll arrive in order, and they get physically routed across however many hops to the server. On the server side, it's the mirror image — the accepted socket receives the bytes, TCP puts them back in order, TLS decrypts them, and only then does the actual HTTP server code see and parse the request, before sending a response back through the exact same path in reverse.",
    interviewerExpectations: [
      "Correctly sequences TCP handshake before TLS handshake before HTTP data",
      "Understands that data flows through the socket's send/recv and gets processed by each stack layer in order",
      "Can name the server-side socket (accept()-returned) as distinct from the client's socket, both endpoints of the same logical connection",
    ],
    followUpQuestions: [
      "What would change in this flow if it were plain HTTP instead of HTTPS?",
      "Where would you expect DNS resolution to have happened relative to this whole flow?",
      "What happens at the socket level if the TCP handshake succeeds but the TLS handshake fails (e.g., bad certificate)?",
    ],
    commonMistakes: [
      "Skipping or misordering the TCP handshake relative to the TLS handshake",
      "Treating the whole flow as one undifferentiated step rather than distinct layered phases (TCP, then TLS, then HTTP)",
    ],
    discussionPoints: ["TCP three-way handshake", "TLS handshake ordering", "Layered send/recv data flow", "Client vs server-side sockets"],
  },
];

export default socketsClientServerInterviewQuestions;
