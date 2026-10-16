// src/content/cs-fundamentals/networks/interview/congestionControl.interview.ts

import type { InterviewQuestion } from "@/types";

const congestionControlInterviewQuestions: InterviewQuestion[] = [
  {
    id: "congestion-control-iv-1",
    question: "What is the difference between flow control and congestion control in TCP?",
    difficulty: "Easy",
    detailedAnswer:
      "Flow control protects the receiver: it uses the receiver-advertised window (rwnd) so a fast sender never sends more data than the receiver's buffer can currently hold. Congestion control protects the network itself: it uses a sender-maintained congestion window (cwnd) that estimates how much data the network path can currently absorb without overloading routers/links. TCP's actual send window is always min(cwnd, rwnd) — both constraints apply simultaneously but they solve different problems and are computed independently.",
    idealAnswer:
      "I'd separate them by who they protect: flow control protects the receiver from being overwhelmed — it's just the receiver saying 'here's how much buffer space I have left,' communicated via rwnd in every segment. Congestion control protects the shared network from being overwhelmed by all the senders combined — the sender itself estimates a safe sending rate via cwnd, growing it when things go well and cutting it sharply when it detects loss. The actual amount of data in flight is capped by whichever of the two is smaller.",
    interviewerExpectations: [
      "Correctly identifies rwnd (flow control) vs cwnd (congestion control)",
      "Explains min(cwnd, rwnd) governs actual send window",
      "Doesn't conflate the two mechanisms as being the same thing",
    ],
    followUpQuestions: [
      "Which field in the TCP header carries the flow control window?",
      "Can cwnd exceed rwnd? What happens if it does?",
      "Is flow control needed for UDP? Why or why not?",
    ],
    commonMistakes: [
      "Saying flow control and congestion control are interchangeable terms",
      "Forgetting that cwnd is sender-side only and not directly visible in the TCP header",
    ],
    discussionPoints: ["rwnd vs cwnd", "min(cwnd, rwnd)", "Receiver protection vs network protection"],
  },
  {
    id: "congestion-control-iv-2",
    question: "Walk me through the phases of TCP congestion control: slow start, congestion avoidance, and what happens on loss.",
    difficulty: "Medium",
    detailedAnswer:
      "TCP begins in slow start with a small cwnd (historically 1 MSS, commonly ~10 MSS today per RFC 6928) and roughly doubles cwnd every RTT — exponential growth — until cwnd reaches ssthresh. It then transitions into congestion avoidance, where growth becomes additive: roughly +1 MSS per RTT. If loss is detected via three duplicate ACKs, TCP performs fast retransmit (resend the missing segment immediately) and fast recovery (halve both cwnd and ssthresh, then continue from that elevated point) rather than collapsing. If loss is detected via a retransmission timeout instead — meaning no ACK arrived at all — TCP treats this as a much stronger signal of severe congestion: it sets ssthresh to half the current cwnd and resets cwnd all the way down to 1 MSS, re-entering slow start from scratch.",
    idealAnswer:
      "There are really three things to track: how cwnd grows when things are healthy, and two different reactions to loss. Growth: slow start doubles cwnd every RTT until it hits ssthresh, then congestion avoidance takes over and grows it by about one MSS per RTT — so it's exponential, then linear. Loss reaction: if we get three duplicate ACKs, that means most segments are still getting through, so TCP does fast retransmit and fast recovery — resend the lost segment now, halve cwnd and ssthresh, and continue without a full reset. But if we get a timeout with no ACKs at all, that's a much worse signal, so TCP nukes cwnd back to 1 MSS and starts over in slow start.",
    interviewerExpectations: [
      "Correctly sequences slow start -> congestion avoidance",
      "Distinguishes exponential vs additive growth precisely",
      "Correctly distinguishes triple-duplicate-ACK response from timeout response",
    ],
    followUpQuestions: [
      "Why does exceeding ssthresh trigger the switch to congestion avoidance?",
      "Why is a timeout treated more severely than duplicate ACKs?",
      "What is ssthresh set to after a loss event, and why?",
    ],
    commonMistakes: [
      "Saying cwnd always resets to 1 MSS regardless of how loss was detected",
      "Mixing up which phase is exponential vs linear",
    ],
    discussionPoints: ["Slow start", "Congestion avoidance", "Fast retransmit/recovery", "Timeout handling"],
  },
  {
    id: "congestion-control-iv-3",
    question: "What is AIMD and why is 'additive increase, multiplicative decrease' specifically chosen over, say, multiplicative increase and additive decrease?",
    difficulty: "Medium",
    detailedAnswer:
      "AIMD means cwnd grows additively (by a fixed amount per RTT) while conditions are good, and shrinks multiplicatively (e.g., halved) the instant congestion is detected. This asymmetry is intentional for stability and fairness: it has been mathematically shown (Chiu and Jain's classic analysis) that AIMD is the combination that converges multiple competing flows toward a fair, efficient equilibrium share of bandwidth — cautious, gradual probing upward, but an aggressive, immediate retreat the moment the network signals trouble. The reverse — multiplicative increase, additive decrease — would let flows ramp up dangerously fast and back off too slowly, risking sustained congestion collapse.",
    idealAnswer:
      "AIMD is 'climb slowly, fall fast': cwnd increases by a fixed step every RTT when things are fine, but gets cut in half (or worse) the moment loss signals congestion. The reason this specific combination is used rather than the reverse comes down to network stability — there's a well-known result showing AIMD converges competing flows toward fair bandwidth sharing over time, because the additive climb is gentle enough not to overshoot capacity too aggressively, and the multiplicative cut reacts hard and fast to back everyone off together when the network signals trouble. If increase were multiplicative instead, flows could spike demand far past capacity before the next congestion signal even arrives.",
    interviewerExpectations: [
      "Correctly defines the additive-increase / multiplicative-decrease asymmetry",
      "Can articulate why this specific combination (not the reverse) is chosen",
      "Bonus: references convergence/fairness properties",
    ],
    followUpQuestions: [
      "What would happen to network stability if increase were also multiplicative?",
      "How does AIMD relate to the sawtooth shape you'd see plotting cwnd over time?",
      "Does every congestion control algorithm use AIMD (e.g., does BBR)?",
    ],
    commonMistakes: [
      "Not knowing which part is additive and which is multiplicative",
      "Unable to explain why this asymmetry benefits network-wide fairness/stability",
    ],
    discussionPoints: ["AIMD asymmetry", "Fairness convergence", "Sawtooth throughput pattern"],
  },
  {
    id: "congestion-control-iv-4",
    question: "Your service's p99 latency spikes badly under load, and you suspect TCP retransmissions on the backend-to-database connections are involved. How would you confirm or rule this out?",
    difficulty: "Hard",
    detailedAnswer:
      "First, gather direct evidence rather than guessing: on Linux, `ss -ti` or `netstat -s` exposes per-connection or aggregate TCP retransmission counters, and `nstat`/`ss` can show retransmits, cwnd, and rtt for live sockets. A sustained rise in the retransmission counter correlated with the latency spike window is strong evidence. Packet captures (tcpdump/Wireshark) during a reproduction would show duplicate ACKs or retransmitted segments directly, and Wireshark's TCP analysis flags 'Fast Retransmission' and 'Retransmission' explicitly. I'd also check whether cwnd is being repeatedly reset (visible via `ss -i` showing a small cwnd relative to expected bandwidth-delay product) — that pattern (sawtooth cwnd correlated with p99 spikes) would confirm congestion control is actively throttling the connection rather than, say, the database itself being slow. I'd also rule out alternative explanations: is the spike correlated with GC pauses, connection pool exhaustion, or CPU saturation instead, since those produce similar user-facing symptoms without any TCP-layer signal.",
    idealAnswer:
      "I wouldn't just assume it's TCP — I'd pull actual evidence. On the hosts, `ss -ti` shows per-connection retransmit counts, cwnd, and RTT, and system-wide `netstat -s` shows aggregate retransmission stats; if those numbers spike in the same window as the p99 latency spike, that's a strong signal. I'd also grab a packet capture during a reproduction and look in Wireshark for duplicate ACKs and retransmission flags, and check if cwnd is visibly getting cut and slow-starting again around the same time — that sawtooth pattern lining up with the latency spikes would basically confirm it. And I'd rule out the obvious non-network explanations in parallel — GC pauses, thread pool exhaustion, DB query latency — so I'm not chasing a network ghost if the real cause is somewhere else entirely.",
    interviewerExpectations: [
      "Names concrete diagnostic tools (ss, netstat, tcpdump/Wireshark) rather than vague guesses",
      "Understands what signal (retransmit counters, cwnd resets) would actually confirm the hypothesis",
      "Considers and rules out alternative non-network causes",
    ],
    followUpQuestions: [
      "What would you expect to see in cwnd if congestion control is the cause versus if it's something else?",
      "How would packet loss on a cloud provider's virtual network differ from loss on a physical LAN?",
      "If retransmissions are confirmed, what are your mitigation options?",
    ],
    commonMistakes: [
      "Jumping straight to a fix (e.g., 'just increase timeouts') without first confirming the hypothesis with data",
      "Not knowing any concrete Linux tooling for inspecting TCP-level statistics",
    ],
    discussionPoints: ["ss/netstat diagnostics", "Packet capture analysis", "cwnd sawtooth as a diagnostic signal", "Ruling out non-network causes"],
    scenarioBased: true,
  },
  {
    id: "congestion-control-iv-5",
    question: "Why did Google develop BBR, and how does it differ fundamentally from loss-based algorithms like Reno or CUBIC?",
    difficulty: "Hard",
    detailedAnswer:
      "Loss-based algorithms (Reno, CUBIC) treat packet loss as the primary — often only — congestion signal, and keep growing cwnd until loss occurs. This works reasonably on wired, low-loss networks, but has two problems: on links with real, non-congestive loss (like wireless), it needlessly throttles throughput; and on links with deep buffers, it can fill those buffers before loss ever happens, causing significant latency bloat (bufferbloat) before backing off. BBR (Bottleneck Bandwidth and RTT) takes a fundamentally different, model-based approach: it continuously estimates the bottleneck link's bandwidth and the path's minimum RTT, and paces its sending rate to match that estimated bandwidth directly, rather than waiting for loss as a signal. This lets it sustain high throughput with lower queuing delay, and makes it far less sensitive to non-congestive packet loss.",
    idealAnswer:
      "Classic algorithms like Reno and CUBIC are loss-based — they keep increasing their send rate until a packet actually gets dropped, and only then back off. That works okay on clean wired networks, but on Google's global network with lots of long, high-bandwidth, sometimes lossy links, it caused two problems: non-congestive loss (like Wi-Fi noise) made TCP back off when it didn't need to, and deep router buffers let TCP fill them up with queued packets before any loss occurred, causing latency to balloon — bufferbloat. BBR flips the model: instead of waiting for loss, it actively estimates the bottleneck bandwidth and round-trip time of the path and paces sending to match that estimate directly, so it can sustain high throughput without needing to fill up buffers or rely on loss as its primary signal.",
    interviewerExpectations: [
      "Explains the core limitation of loss-based algorithms (bufferbloat, non-congestive loss sensitivity)",
      "Correctly describes BBR's model-based approach (bandwidth + RTT estimation, not loss-driven)",
      "Can connect this to a real-world motivation (Google's network characteristics)",
    ],
    followUpQuestions: [
      "What is bufferbloat and why does it hurt latency-sensitive applications?",
      "Are there fairness concerns when BBR flows compete with CUBIC flows on the same bottleneck?",
      "How would you empirically test whether BBR improves your service's tail latency?",
    ],
    commonMistakes: [
      "Describing BBR as 'just a faster version of CUBIC' rather than a fundamentally different signaling model",
      "Not knowing what bufferbloat is or why deep buffers interact badly with loss-based control",
    ],
    discussionPoints: ["Loss-based vs model-based congestion control", "Bufferbloat", "Bandwidth-delay product estimation"],
  },
];

export default congestionControlInterviewQuestions;
