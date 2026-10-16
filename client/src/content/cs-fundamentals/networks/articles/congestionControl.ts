// src/content/cs-fundamentals/networks/articles/congestionControl.ts

import type { Article } from "@/types";

const congestionControlArticle: Article = {
  slug: "congestion-control",
  title: "Congestion & Flow Control",
  summary:
    "TCP congestion control keeps senders from overwhelming the network, while flow control keeps senders from overwhelming the receiver — two related but distinct mechanisms that decide how fast data actually flows.",
  readingTimeMins: 9,
  beginnerExplanation:
    "Imagine a highway (the network) and a receiver's mailbox (the receiving application's buffer). Flow control is about not stuffing more mail into a mailbox than it can hold — the receiver tells the sender exactly how much space is left, using a 'receive window.' Congestion control is a completely different problem: it's about not sending so many cars onto the highway that the highway itself jams up, even if the destination mailbox has plenty of room. TCP has to solve both problems at once, and the amount of data actually in flight at any moment is the smaller of what the receiver can accept and what the network can carry.\n\nTCP starts cautiously (slow start), ramps up its sending rate as long as things go well, and backs off sharply the moment it detects loss — because in classic TCP, packet loss is treated as the primary signal that the network is congested.",
  detailedBreakdown:
    "TCP maintains two windows that jointly cap how many unacknowledged bytes can be in flight: the receiver-advertised window (rwnd), which is flow control and is communicated in every TCP segment header, and the congestion window (cwnd), which is congestion control and is a sender-side estimate of how much the network can currently absorb. The actual send window is min(cwnd, rwnd). Flow control is straightforward — the receiver advertises free buffer space and the sender never exceeds it, preventing a fast sender from drowning a slow receiver. Congestion control is the harder, more algorithmically interesting half.\n\nCongestion control runs through distinct phases. In slow start, cwnd begins at a small value (historically 1 MSS, now commonly an initial window of around 10 MSS per RFC 6928) and doubles every round-trip time (RTT) — each received ACK increases cwnd by roughly one MSS, so a full window's worth of ACKs doubles it, giving exponential growth. This continues until cwnd reaches ssthresh (slow-start threshold), at which point TCP switches to congestion avoidance, where growth becomes linear/additive: cwnd increases by roughly one MSS per RTT instead of doubling. This whole pattern is called AIMD — Additive Increase, Multiplicative Decrease: cwnd grows additively while things are healthy, and gets slashed multiplicatively (typically halved) the moment congestion is detected, which is what gives TCP's throughput graph its classic sawtooth shape.\n\nLoss detection and recovery matter as much as growth. If a timeout occurs (no ACK for a long time), TCP assumes severe congestion, resets cwnd all the way back to 1 MSS, sets ssthresh to half the previous cwnd, and re-enters slow start — a harsh but safe reaction. A gentler path exists for isolated loss: if the sender receives three duplicate ACKs (the same ACK number repeated, meaning later segments arrived but one is missing), it triggers fast retransmit — resending the missing segment immediately without waiting for a timeout — followed by fast recovery, which halves cwnd and ssthresh but stays in a semi-elevated state (congestion avoidance-like) rather than collapsing all the way back to slow start. This distinction — timeout vs. triple-duplicate-ACK — is the single most commonly tested piece of TCP congestion control mechanics.",
  realWorldExamples:
    "Video conferencing tools and CDNs (e.g., a large file download from a CDN edge node) are directly shaped by these algorithms: the initial 'ramping up' feel of a fresh download is slow start in action, and a mid-download stutter followed by recovery is often a fast-retransmit event, not a full stall. Modern high-bandwidth, high-latency links (like satellite or long-haul intercontinental connections) motivated newer congestion control algorithms — CUBIC (Linux's default) grows cwnd based on a cubic function of time since the last loss event to better utilize large bandwidth-delay-product links, while BBR (used by Google and increasingly by CDNs) abandons loss-based signaling almost entirely and instead models the actual bottleneck bandwidth and RTT to decide sending rate, reacting to real congestion rather than just packet loss.",
  useCases: [
    "Preventing network-wide congestion collapse when many TCP flows share a bottleneck link",
    "Allowing a single connection to ramp up quickly on an underutilized, low-latency network (slow start)",
    "Recovering from an isolated lost packet without a full throughput collapse (fast retransmit/recovery)",
    "Protecting a slow receiver (e.g., a mobile device) from being overwhelmed by a fast sender (flow control)",
  ],
  advantages: [
    "Self-tuning: TCP adapts its rate to current network conditions without any manual configuration",
    "Fairness: AIMD's additive-increase/multiplicative-decrease behavior tends to converge multiple competing flows toward sharing bandwidth roughly equally",
    "Fast retransmit/recovery avoids unnecessary full resets to slow start for minor, isolated packet loss",
  ],
  disadvantages: [
    "Loss-based congestion control (Reno/CUBIC) treats all packet loss as congestion, which is a poor assumption on lossy wireless links, hurting throughput unnecessarily",
    "The sawtooth cwnd pattern means throughput never stabilizes perfectly — a connection is always oscillating between growing and backing off",
    "Bufferbloat: large, uncontrolled router buffers can delay the loss signal TCP relies on, causing latency to balloon before TCP ever backs off",
  ],
  commonMisconceptions: [
    "\"Flow control and congestion control are the same thing\" — flow control protects the receiver's buffer (rwnd); congestion control protects the network itself (cwnd). They're computed independently and the smaller one wins.",
    "\"Slow start is slow\" — it's called 'slow' only relative to blasting the full bandwidth immediately; it actually grows exponentially and reaches large windows within a handful of RTTs.",
    "\"Any packet loss means the network is congested\" — this is exactly the assumption newer algorithms like BBR challenge, since loss can also come from unrelated link-layer noise (e.g., Wi-Fi interference).",
    "\"Congestion avoidance means cwnd stops growing\" — it still grows, just additively (linearly) instead of exponentially, until the next loss event.",
  ],
  interviewPerspective:
    "This is a favorite deep-dive topic once TCP vs UDP basics are established — interviewers want to see you can name and order the phases correctly (slow start → congestion avoidance → loss event → fast retransmit/recovery or timeout), explain AIMD precisely (why increase is additive but decrease is multiplicative, and why that asymmetry matters for stability and fairness), and connect it to a real symptom like 'why did throughput on this connection drop and slowly climb back up.' Bonus points for naming CUBIC or BBR and explaining why loss-based control struggles on lossy or high-bandwidth-delay-product links.",
  oaPerspective:
    "OA questions frequently give you a starting cwnd and ssthresh and ask you to trace cwnd's value after N RTTs, testing whether you know slow start doubles per RTT while congestion avoidance adds one MSS per RTT. Other common questions test terminology matching (which phase does which growth pattern) and the specific trigger difference between fast retransmit (3 duplicate ACKs) and a full timeout-driven reset.",
  keyTakeaways: [
    "Flow control (rwnd) protects the receiver's buffer; congestion control (cwnd) protects the network; the sender uses min(cwnd, rwnd).",
    "Slow start grows cwnd exponentially (roughly doubling per RTT) until ssthresh, then congestion avoidance grows it additively (about +1 MSS per RTT).",
    "AIMD — additive increase, multiplicative decrease — produces TCP's characteristic sawtooth throughput pattern and promotes fairness among flows.",
    "Three duplicate ACKs trigger fast retransmit/fast recovery (halve cwnd, stay elevated); a timeout triggers a full reset back to slow start (cwnd = 1 MSS).",
    "Modern algorithms like CUBIC and BBR modify or replace pure loss-based AIMD to perform better on high-bandwidth or lossy links.",
  ],
  summaryClosing:
    "Congestion and flow control are what make TCP a well-behaved citizen on a shared network — flow control keeps a fast sender from drowning a slow receiver, while congestion control keeps every sender collectively honest about how much the network can actually carry, self-adjusting through slow start, congestion avoidance, and loss recovery without any central coordinator.",
  relatedTopics: ["TCP vs UDP", "Sliding Window Protocol", "Sockets & Client-Server Communication"],
  furtherReading: [
    { label: "RFC 5681 — TCP Congestion Control", note: "The standards-track definition of slow start, congestion avoidance, fast retransmit, and fast recovery." },
    { label: "\"BBR: Congestion-Based Congestion Control\" (Google research paper)", note: "Explains the motivation and mechanics behind moving away from pure loss-based control." },
  ],
};

export default congestionControlArticle;
