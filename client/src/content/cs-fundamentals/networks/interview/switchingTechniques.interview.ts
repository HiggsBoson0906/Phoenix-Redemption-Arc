// src/content/cs-fundamentals/networks/interview/switchingTechniques.interview.ts

import type { InterviewQuestion } from "@/types";

const switchingTechniquesInterviewQuestions: InterviewQuestion[] = [
  {
    id: "switching-techniques-iv-1",
    question: "What is the fundamental difference between circuit switching and packet switching?",
    difficulty: "Easy",
    detailedAnswer:
      "Circuit switching reserves a dedicated end-to-end path with guaranteed bandwidth before any data is sent, going through explicit establishment, transfer, and teardown phases — the traditional telephone network works this way. Packet switching has no such reservation: data is broken into packets, each carrying its own addressing information, and routed independently through shared links, with bandwidth allocated dynamically on a per-packet basis via statistical multiplexing. The internet is built on packet switching.",
    idealAnswer:
      "Circuit switching is like booking a private lane on a highway for your entire trip — guaranteed, but wasted if you're not using it every second. Packet switching is like everyone sharing the same lanes, merging in and out as they have data to send, with each packet finding its own way. That's why circuit switching gives predictable, jitter-free performance but wastes idle capacity, while packet switching is far more efficient for bursty traffic at the cost of variable delay.",
    interviewerExpectations: [
      "Names the reservation-based vs. shared/dynamic distinction clearly",
      "Gives a correct real-world example for each",
      "Mentions the tradeoff: guaranteed but wasteful vs. efficient but variable",
    ],
    followUpQuestions: [
      "Why does the internet use packet switching instead of circuit switching?",
      "What is a virtual circuit, and how is it different from true circuit switching?",
      "Can you think of a scenario where circuit switching would still be preferred today?",
    ],
    commonMistakes: [
      "Saying packet switching is 'always faster' without qualifying the tradeoff",
      "Confusing virtual circuits (a packet-switching variant) with true circuit switching",
    ],
    discussionPoints: ["Resource reservation vs. sharing", "PSTN vs. IP", "Predictability vs. efficiency tradeoff"],
  },
  {
    id: "switching-techniques-iv-2",
    question: "Explain virtual-circuit packet switching and how it differs from both pure circuit switching and pure datagram switching.",
    difficulty: "Medium",
    detailedAnswer:
      "Virtual-circuit switching is a hybrid: like circuit switching, it has an explicit setup phase where a specific path through the network is chosen and every switch along that path records a mapping (typically keyed by a short virtual-circuit identifier, VCI); but like datagram packet switching, it doesn't reserve exclusive bandwidth — the underlying physical links are still statistically shared with other traffic. Once set up, every packet belonging to that flow follows the same fixed path and uses the VCI for fast table lookups at each switch, rather than a full routing decision. This gives ordered, consistent delivery (a benefit of circuit switching) while retaining the link-sharing efficiency of packet switching. Pure datagram switching, by contrast, makes an independent routing decision for every single packet with no persistent path or per-flow state at intermediate nodes.",
    idealAnswer:
      "I think of virtual-circuit switching as packet switching that borrows circuit switching's idea of 'decide the path once.' There's a signaling phase that fixes a specific route and installs a VCI-to-outgoing-link mapping at every switch on that path, so subsequent packets don't need full routing lookups — just a quick VCI table lookup — and they arrive in order since they all follow the same path. But unlike true circuit switching, no bandwidth is exclusively reserved; the physical links are still shared with everyone else's traffic. Pure datagram switching skips all of that — every packet is routed completely independently, which is more flexible but gives up ordering guarantees and the lookup speed benefit.",
    interviewerExpectations: [
      "Correctly identifies VC switching as a hybrid combining path-fixing with link-sharing",
      "Explains the VCI/label mechanism concretely",
      "Contrasts it clearly against both pure circuit switching and pure datagram switching",
    ],
    followUpQuestions: [
      "What happens to a virtual circuit if an intermediate switch or link fails?",
      "Where is virtual-circuit switching used in real infrastructure today?",
      "Why might MPLS be used inside an ISP network even though the internet overall is IP/datagram-based?",
    ],
    commonMistakes: [
      "Saying virtual circuits reserve dedicated bandwidth like true circuit switching",
      "Not knowing a concrete real-world example (MPLS, ATM, Frame Relay)",
    ],
    discussionPoints: ["VCI/label switching", "Hybrid design tradeoffs", "MPLS as a modern example"],
  },
  {
    id: "switching-techniques-iv-3",
    question: "Why did message switching fall out of use, and how does packet switching solve the problems it had?",
    difficulty: "Medium",
    detailedAnswer:
      "Message switching requires every intermediate node to receive and store the entire message before forwarding it onward (pure store-and-forward at the message level), with no upper bound on message size. This creates two serious problems: nodes need enough buffer/storage capacity for arbitrarily large messages, which doesn't scale, and the message can't begin moving to the next hop until it has been completely received at the current one, meaning latency accumulates in full at every single hop with no overlap. Packet switching solves both: by splitting a message into small, bounded-size packets, each node only needs to buffer a packet's worth of data, and because a node can start forwarding an already-received packet to the next hop while still receiving later packets, transmission across multiple links can pipeline/overlap — the total delay for a multi-packet message across multiple hops ends up far lower than sending the whole thing as one message-switched unit.",
    idealAnswer:
      "Message switching stores the whole message at every hop before forwarding, which means unbounded storage requirements and zero pipelining — each hop's full transmission delay stacks on top of the last with no overlap. Packet switching fixes this by capping the unit size: since a node can forward the first packet onward as soon as it arrives, without waiting for the whole message, transmission across successive links overlaps in time. That pipelining effect is the real engineering reason packet switching won — it's not just about smaller storage buffers, it measurably reduces total end-to-end delay for multi-hop transfers.",
    interviewerExpectations: [
      "Identifies both the storage problem and the lack-of-pipelining problem in message switching",
      "Explains specifically how bounded packet size enables pipelining across hops",
      "Can reason about why this reduces total delay, not just intuitively assert it",
    ],
    followUpQuestions: [
      "Can you sketch how you'd compute total delay for a message split into N packets across k links?",
      "Is there a downside to making packets too small?",
      "Where is store-and-forward message switching still conceptually relevant today (e.g. email)?",
    ],
    commonMistakes: [
      "Only mentioning storage requirements without mentioning the pipelining/latency benefit",
      "Confusing message switching with datagram packet switching",
    ],
    discussionPoints: ["Store-and-forward delay", "Pipelining across hops", "Bounded vs. unbounded unit size"],
  },
  {
    id: "switching-techniques-iv-4",
    question: "If circuit switching guarantees bandwidth and constant latency, why doesn't the modern internet use it for everything, including real-time voice/video?",
    difficulty: "Medium",
    detailedAnswer:
      "Circuit switching's guarantees come at the cost of reserving fixed capacity for the entire session regardless of actual usage — for bursty data traffic (web browsing, file transfer, even voice with silence gaps) this wastes huge amounts of bandwidth, and running millions of simultaneous circuit-switched sessions at internet scale would require far more physical capacity than statistically multiplexing the same traffic over shared packet-switched links. Even latency-sensitive services like VoIP and video calls run over packet-switched IP networks today; instead of reserving a circuit, they rely on sufficiently provisioned, low-congestion links plus application/transport-layer techniques (RTP/RTCP for real-time delivery, jitter buffers to smooth out variable arrival timing, QoS marking/prioritization at routers, adequate over-provisioned bandwidth) to approximate the predictability circuit switching would have given natively. This is generally more cost-effective and scalable than universal circuit switching, even though it sacrifices hard guarantees for statistical ones.",
    idealAnswer:
      "The guarantee is real, but it's paid for with reserved-but-often-idle capacity, and that doesn't scale economically to internet-level traffic volumes, most of which is bursty rather than continuous. So instead, real-time services like VoIP just run over ordinary packet-switched IP and lean on jitter buffers, QoS prioritization, and simply provisioning enough bandwidth that congestion-driven delay stays low enough to feel real-time. It's a statistical guarantee instead of a hard one, but it's dramatically cheaper to operate at scale, which is why circuit switching stayed a niche telephony technology rather than the internet's foundation.",
    interviewerExpectations: [
      "Explains the cost/waste tradeoff of universal circuit switching at scale",
      "Knows that real-time services still work over packet-switched networks via QoS/jitter buffers rather than needing true circuit switching",
      "Distinguishes hard guarantees from practically-good-enough statistical guarantees",
    ],
    followUpQuestions: [
      "What is a jitter buffer and why does VoIP need one?",
      "How does QoS/traffic prioritization work at a router level?",
      "Would 5G's network slicing count as a modern form of circuit-switching-like guarantees?",
    ],
    commonMistakes: [
      "Assuming real-time services literally require circuit switching to work",
      "Not connecting the answer back to cost/scale economics",
    ],
    discussionPoints: ["Statistical multiplexing economics", "QoS and jitter buffers", "VoIP over packet-switched networks"],
  },
  {
    id: "switching-techniques-iv-5",
    question: "You're designing the backbone network for an ISP that needs to guarantee low, consistent latency for premium enterprise customers' traffic while still efficiently sharing physical links with regular best-effort internet traffic. Which switching approach would you use, and how would you justify it?",
    difficulty: "Hard",
    detailedAnswer:
      "I'd use virtual-circuit packet switching, specifically something like MPLS, rather than either pure datagram routing or true circuit switching. Pure datagram routing (plain IP forwarding) can't give premium customers consistent, predictable paths — routing decisions happen independently per packet and can shift due to routing table changes or load balancing, causing variable latency/jitter. True circuit switching would guarantee predictability but would mean statically reserving dedicated bandwidth for every premium customer regardless of their actual usage, which doesn't scale economically and wastes capacity that could serve best-effort traffic during idle periods. MPLS gives the best of both: I'd establish labeled paths (LSPs) for premium traffic with traffic engineering to route them over specific, well-provisioned, low-congestion paths, and use MPLS's support for QoS classes (via EXP/Traffic Class bits) to prioritize premium-labeled packets at each hop's queue — while still letting best-effort traffic statistically share the same physical links and unused capacity. This achieves consistent, low latency for premium traffic without the capacity waste of true reserved circuits.",
    idealAnswer:
      "I'd reach for MPLS — a virtual-circuit-style approach — rather than pure IP routing or true circuit switching. Pure datagram routing can't guarantee a consistent path or priority for premium traffic since every packet is routed independently. True circuit switching would guarantee it but at the cost of statically reserving bandwidth that sits idle whenever the premium customer isn't actively using it, which is expensive at ISP backbone scale. MPLS lets me set up traffic-engineered labeled paths specifically for premium traffic, routed over well-provisioned links, and tag those packets for priority queuing at each hop, while regular best-effort traffic still statistically shares the same physical infrastructure. That gets premium customers consistent low latency without permanently sacrificing capacity that could otherwise serve everyone else.",
    interviewerExpectations: [
      "Chooses virtual-circuit/MPLS specifically and justifies why over both pure alternatives",
      "Explains the economic argument against reserving true dedicated circuits at ISP scale",
      "Mentions concrete mechanisms — labeled paths, traffic engineering, QoS prioritization",
    ],
    followUpQuestions: [
      "How does MPLS's label-switching lookup differ from a full IP routing table lookup, and why is that faster?",
      "What happens to premium traffic if the primary MPLS path fails?",
      "How would you monitor whether the premium SLA is actually being met in production?",
    ],
    commonMistakes: [
      "Defaulting to 'just use circuit switching' without addressing the cost/scale problem",
      "Not knowing a concrete real-world virtual-circuit technology (MPLS) to anchor the answer",
    ],
    discussionPoints: ["MPLS/label switching", "Traffic engineering", "QoS prioritization", "Cost vs. guarantee tradeoffs at ISP scale"],
    scenarioBased: true,
  },
];

export default switchingTechniquesInterviewQuestions;
