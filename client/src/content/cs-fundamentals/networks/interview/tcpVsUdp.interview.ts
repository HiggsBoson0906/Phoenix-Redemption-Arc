// src/content/cs-fundamentals/networks/interview/tcpVsUdp.interview.ts

import type { InterviewQuestion } from "@/types";

const tcpVsUdpInterviewQuestions: InterviewQuestion[] = [
  {
    id: "tcp-vs-udp-iv-1",
    question: "What are the fundamental differences between TCP and UDP?",
    difficulty: "Easy",
    detailedAnswer:
      "TCP is connection-oriented — it requires a three-way handshake before data transfer and guarantees reliable, ordered, duplicate-free delivery via sequence numbers, acknowledgments, and retransmission, plus flow control and congestion control. UDP is connectionless — there's no handshake or persistent connection state, and it provides no delivery, ordering, or duplication guarantees; the application must handle any reliability it needs itself. Practically, TCP has a minimum 20-byte header versus UDP's fixed 8-byte header, and TCP's guarantees come at the cost of setup latency and potential head-of-line blocking, while UDP trades those guarantees for minimal overhead and lower latency.",
    idealAnswer:
      "TCP is the reliable, ordered, 'make sure it gets there correctly' protocol — handshake first, then guaranteed delivery with retransmission and flow/congestion control. UDP is the fire-and-forget protocol — no handshake, no guarantees, minimal 8-byte header, and it's entirely on the application to add any reliability it actually needs. The real skill isn't reciting that difference, it's knowing when each tradeoff is the right one — TCP for correctness-critical data like a webpage or file, UDP for latency-critical data like a video call where a late packet is worse than a dropped one.",
    interviewerExpectations: [
      "States both the guarantees and the mechanisms behind them (handshake, sequence numbers, window size)",
      "Names exact header sizes (20 bytes vs 8 bytes)",
      "Can give a genuine use-case example for each, not just abstract description",
    ],
    followUpQuestions: [
      "Walk me through the three-way handshake step by step.",
      "Why would you ever choose UDP if TCP is 'more reliable'?",
      "What's in a TCP header that isn't in a UDP header?",
    ],
    commonMistakes: [
      "Saying 'TCP is better' without acknowledging UDP's legitimate use cases",
      "Not knowing the exact header sizes",
    ],
    discussionPoints: ["Connection-oriented vs. connectionless", "Reliability mechanisms", "Header overhead"],
  },
  {
    id: "tcp-vs-udp-iv-2",
    question: "Walk me through the TCP three-way handshake in detail — what's in each segment and why is it necessary?",
    difficulty: "Medium",
    detailedAnswer:
      "The client sends a SYN segment with the SYN flag set and an initial sequence number (ISN) it has chosen, essentially saying 'I want to connect, and my byte stream will start counting from this number.' The server responds with a single segment that has both SYN and ACK flags set — the ACK acknowledges the client's ISN (typically ISN+1), and the SYN proposes the server's own initial sequence number for its direction of the stream. The client then sends a final ACK, acknowledging the server's ISN. After this exchange, both sides have exchanged and acknowledged initial sequence numbers in both directions, which is what allows reliable, ordered delivery and loss detection to work correctly from the very first byte of application data — without this synchronization, neither side would have an agreed-upon baseline to detect missing or duplicate segments against. It's also worth noting TCP is full-duplex: this handshake sets up sequence tracking independently for both directions simultaneously, which is why the second segment needs to be a combined SYN-ACK rather than two separate segments.",
    idealAnswer:
      "SYN, SYN-ACK, ACK. The client's SYN says 'let's talk, here's where my sequence numbering starts.' The server's SYN-ACK does two things in one segment — acknowledges the client's starting number, and proposes its own starting number for the reverse direction, since TCP is full-duplex and each direction needs its own sequence tracking. The client's final ACK closes the loop by acknowledging the server's number too. The real point of all this isn't just politeness — it's establishing an agreed starting point in both directions so that later, if a segment goes missing or arrives out of order, both sides can detect it precisely using sequence numbers, which is the foundation TCP's entire reliability guarantee sits on.",
    interviewerExpectations: [
      "Correctly explains sequence number synchronization as the actual purpose, not just 'saying hello'",
      "Understands SYN-ACK is one combined segment, not two",
      "Mentions TCP's full-duplex nature as the reason both directions need independent sequence numbers",
    ],
    followUpQuestions: [
      "What happens if the final ACK from the client is lost?",
      "What is a SYN flood attack, and why does the handshake make it possible?",
      "How does TCP fast open (TFO) try to reduce this handshake's latency cost?",
    ],
    commonMistakes: [
      "Describing the handshake as three separate SYN/ACK segments instead of a combined SYN-ACK",
      "Not explaining why sequence number synchronization actually matters",
    ],
    discussionPoints: ["Sequence number synchronization", "Full-duplex connection setup", "SYN flood vulnerability"],
  },
  {
    id: "tcp-vs-udp-iv-3",
    question: "If TCP provides all these reliability guarantees, why would anyone choose UDP for anything important?",
    difficulty: "Medium",
    detailedAnswer:
      "TCP's guarantees aren't free — they cost handshake latency (an extra round trip before any data flows), congestion-control ramp-up (slow start deliberately limits throughput at the beginning of a connection), and head-of-line blocking (strict in-order delivery means one lost segment blocks delivery of everything behind it to the application, even data that arrived successfully). For applications where a stale piece of data is actively worse than a missing one — live video/audio, real-time multiplayer game state — waiting for TCP to retransmit and reorder an old packet actually harms the user experience more than just skipping it and using the next fresh packet would. UDP removes all of that overhead and lets the application (or a library like WebRTC's or QUIC's) implement exactly the reliability semantics it needs, no more and no less, rather than being locked into TCP's fixed, one-size-fits-all guarantees.",
    idealAnswer:
      "TCP's reliability isn't free — every guarantee it gives you costs either latency or flexibility. The handshake adds a round trip before you send anything. Slow start deliberately throttles you at the start of a connection. And strict ordering means one lost packet holds up everything behind it, even data that already arrived fine. For something like a video call, an old frame that arrives late is worse than useless — you'd rather just drop it and show the next fresh one, which is exactly what TCP's ordering guarantee won't let you do gracefully. UDP hands that control back to the application, which is why protocols built for exactly this scenario — WebRTC, QUIC — are built on UDP and implement only the reliability they actually need.",
    interviewerExpectations: [
      "Names concrete costs of TCP's guarantees (handshake latency, slow start, head-of-line blocking)",
      "Explains why 'stale data is worse than missing data' for specific real-time use cases",
      "Connects this to real protocols (WebRTC, QUIC) that deliberately chose UDP",
    ],
    followUpQuestions: [
      "How does QUIC get TCP-like reliability without TCP's head-of-line blocking?",
      "What would you have to build yourself if you chose raw UDP for a file-transfer application?",
      "Is UDP ever a bad choice even for latency-sensitive apps? When?",
    ],
    commonMistakes: [
      "Giving only a vague answer like 'UDP is faster' without explaining the specific mechanisms that cost TCP latency",
      "Not knowing any real protocol that deliberately builds on UDP",
    ],
    discussionPoints: ["Head-of-line blocking", "Slow start latency cost", "QUIC/WebRTC as real examples"],
  },
  {
    id: "tcp-vs-udp-iv-4",
    question: "What's the difference between TCP's flow control and congestion control? Aren't they solving the same problem?",
    difficulty: "Medium",
    detailedAnswer:
      "They solve related but distinct problems. Flow control protects the receiver: the receiver advertises a window size in every ACK indicating how much unacknowledged data it currently has buffer space for, and the sender must never have more unacknowledged data in flight than that window allows — this prevents a fast sender from overwhelming a slow receiver's buffer, regardless of what the network looks like. Congestion control protects the network: the sender independently estimates how much the network path itself can handle (since routers between sender and receiver can be congested even if the receiver itself is fast and has plenty of buffer space) using algorithms like slow start (exponentially growing the send rate until loss is detected) and congestion avoidance (linear growth after that, per algorithms like TCP Reno/CUBIC/BBR), backing off when it infers congestion, typically from packet loss or explicit congestion notification (ECN). The sender's actual usable window at any time is effectively the minimum of the flow-control window (receiver-driven) and the congestion window (network-driven, self-inferred by the sender).",
    idealAnswer:
      "Flow control is about the receiver — 'don't send me more than my buffer can hold right now,' enforced via the window size the receiver advertises. Congestion control is about the network in between — 'don't send faster than the path itself can handle,' which the sender has to infer on its own, usually from packet loss, since routers don't explicitly report their queue depth in the common case. They're solved with different mechanisms too: flow control is just a number the receiver tells you; congestion control is an adaptive algorithm (slow start, then congestion avoidance) the sender runs based on its own observations. In practice, the sender's actual send rate is capped by whichever of the two windows is smaller at any given moment.",
    interviewerExpectations: [
      "Clearly separates 'protects the receiver' (flow control) from 'protects the network' (congestion control)",
      "Names concrete mechanisms for each (window size vs. slow start/congestion avoidance)",
      "Understands the effective send window is the minimum of both",
    ],
    followUpQuestions: [
      "Explain TCP slow start in more detail — how does the congestion window grow?",
      "What signals does a TCP sender use to detect congestion?",
      "How does ECN (Explicit Congestion Notification) change this picture?",
    ],
    commonMistakes: [
      "Treating flow control and congestion control as the same mechanism",
      "Not knowing that the effective window is the minimum of the two",
    ],
    discussionPoints: ["Receiver window vs. congestion window", "Slow start", "Congestion signal inference"],
  },
  {
    id: "tcp-vs-udp-iv-5",
    question: "Your backend service's TCP connections to a downstream dependency are timing out intermittently under high load, but the same connections work fine during low traffic. How would you diagnose whether this is a congestion issue, a retransmission issue, or a handshake issue, and what would you check for each?",
    difficulty: "Hard",
    detailedAnswer:
      "First I'd narrow down where in the connection lifecycle the timeout occurs: is it failing during connection establishment (handshake timeout) or after the connection is established but during data transfer (which points to congestion or retransmission)? I'd check application/client-side logs for the specific error — a 'connection timed out' before any data exchange strongly suggests handshake failure (SYN not being ACKed), while a timeout mid-request after the connection was clearly established points to something going wrong in-flight. For a suspected handshake issue under load, I'd check the server's SYN backlog / accept queue depth (via `netstat -s` for listen queue overflow counters, or `ss -lnt` to see current queue depth vs. limit) — under high load, if the server's accept() calls aren't keeping up, the SYN backlog can fill and new SYNs get silently dropped, which looks exactly like intermittent handshake timeouts that clear up once load drops. For a suspected congestion/retransmission issue, I'd capture packets with tcpdump/Wireshark during a failure window and look specifically for TCP retransmissions, duplicate ACKs, or a shrinking congestion window — retransmission timeouts specifically (versus fast retransmit) tend to cause the largest latency spikes, since the retransmission timeout (RTO) can be significantly longer than the RTT. I'd also check whether the downstream dependency's own connection/thread pool is saturating under load (a full accept queue plus healthy network would look identical to network congestion from the client's perspective, so I wouldn't want to misattribute a downstream capacity problem to the network layer without ruling it out first).",
    idealAnswer:
      "I'd first split the problem by where in the connection lifecycle it fails — never-established (handshake) versus established-then-stalled (congestion/retransmission) — since that alone eliminates half the hypothesis space. For handshake failures under load, my first suspicion is the server's SYN/accept backlog filling up because it can't accept connections fast enough — I'd check that with `ss -lnt` or listen-queue-overflow counters in `netstat -s`. For mid-connection stalls, I'd pull a packet capture during a failure window and look for retransmissions and duplicate ACKs specifically — a real retransmission timeout is the classic cause of large, intermittent latency spikes because RTO is deliberately conservative and much longer than a typical RTT. And I'd be careful not to jump straight to 'it's the network' — a saturated downstream thread/connection pool produces symptoms that look identical from my side, so I'd rule that out with the downstream service's own metrics before concluding it's a transport-layer congestion issue.",
    interviewerExpectations: [
      "Splits the diagnosis by handshake-phase vs. data-transfer-phase failure",
      "Names concrete diagnostic tools (netstat/ss for backlog, tcpdump/Wireshark for retransmissions)",
      "Considers non-network explanations (downstream capacity) rather than assuming it's purely a TCP/network issue",
    ],
    followUpQuestions: [
      "What's the difference between a SYN backlog overflow and a full accept queue?",
      "How would you distinguish a fast retransmit from a retransmission-timeout-driven retransmit in a packet capture?",
      "What server-side or client-side configuration changes might mitigate this under sustained high load?",
    ],
    commonMistakes: [
      "Jumping to 'it's network congestion' without first checking simpler explanations like backlog overflow or downstream saturation",
      "Not knowing any concrete tools/commands to actually investigate handshake vs. retransmission behavior",
    ],
    discussionPoints: ["SYN backlog / accept queue", "Packet capture analysis", "Retransmission timeout vs. fast retransmit", "Ruling out downstream capacity issues"],
    scenarioBased: true,
  },
];

export default tcpVsUdpInterviewQuestions;
