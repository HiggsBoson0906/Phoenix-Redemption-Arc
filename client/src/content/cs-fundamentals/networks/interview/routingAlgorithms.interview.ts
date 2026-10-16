// src/content/cs-fundamentals/networks/interview/routingAlgorithms.interview.ts

import type { InterviewQuestion } from "@/types";

const routingAlgorithmsInterviewQuestions: InterviewQuestion[] = [
  {
    id: "routing-algorithms-iv-1",
    question: "What is the core difference between distance-vector and link-state routing?",
    difficulty: "Easy",
    detailedAnswer:
      "Distance-vector routing (Bellman-Ford based, e.g. RIP) has each router know only what its immediate neighbors tell it — a table of (destination, cost) pairs — and it never sees the actual network topology. Link-state routing (Dijkstra based, e.g. OSPF) has each router flood information about its own direct links to every other router in the network, so every router ends up with an identical, complete topology map and independently computes shortest paths from it. The practical consequence: distance-vector converges slower and is prone to routing loops (count-to-infinity) because routers trust secondhand summaries; link-state converges faster and avoids that failure mode because every router computes routes from full, first-hand topology knowledge.",
    idealAnswer:
      "Distance-vector is 'ask your neighbors how far, trust their number.' Link-state is 'get the full map, compute it yourself.' That one difference — trusting a secondhand summary versus having full topology knowledge — is what causes basically every practical difference between them: distance-vector is simpler and lighter-weight but converges slowly and can loop after failures, while link-state needs more memory and computation but converges fast and doesn't suffer from that specific class of loop.",
    interviewerExpectations: [
      "Clearly states the information each router has access to in each model",
      "Names the underlying algorithm for each (Bellman-Ford, Dijkstra)",
      "Connects the information difference to the practical convergence/loop tradeoff",
    ],
    followUpQuestions: [
      "Which real protocols implement each approach?",
      "Why does link-state avoid the count-to-infinity problem specifically?",
      "Which would you choose for a small 3-router network versus a 200-router enterprise network?",
    ],
    commonMistakes: [
      "Not naming the underlying algorithms (Bellman-Ford vs. Dijkstra)",
      "Saying link-state is 'always better' without acknowledging its overhead cost",
    ],
    discussionPoints: ["Local vs. global topology knowledge", "Bellman-Ford vs. Dijkstra", "Convergence speed"],
  },
  {
    id: "routing-algorithms-iv-2",
    question: "Explain the count-to-infinity problem in distance-vector routing with a concrete example, and describe how split horizon with poison reverse mitigates it.",
    difficulty: "Medium",
    detailedAnswer:
      "Consider three routers in a line: A - B - C, where C's direct link to a destination D fails. C no longer has a route to D, but B still has a stale route (B learned 'reach D via C at cost 1' before the failure) and hasn't received C's update yet. If B advertises 'I can reach D at cost 1' back to C, C might incorrectly update its own route to 'reach D via B at cost 2' (B's cost 1 + the B-C link cost 1). Then C re-advertises this to B, B sees a higher cost from C and might increment further, and this ping-pong of incrementing bad information can continue for many rounds before the cost finally climbs high enough (traditionally to RIP's infinity value of 16) for both routers to agree the destination is truly unreachable — this slow climb is the count-to-infinity problem. Split horizon prevents a router from advertising a route back to the same neighbor it learned that route from (B wouldn't advertise its D-route back to C, since B learned it from C), which stops the simplest form of this loop. Poison reverse goes further: instead of just not advertising the route back, B actively advertises it back to C as infinity/unreachable, giving C explicit, immediate information that the path through B is not viable, which speeds up correct convergence.",
    idealAnswer:
      "Picture A-B-C, and C's link to some destination D dies. C loses its route, but B still has a stale 'reach D via C' entry it hasn't updated yet. If B re-advertises that stale route back to C, C might think 'oh, I can reach D via B now' and update accordingly — except that route secretly still depends on C itself, so the two routers just keep inflating each other's cost estimate for D until it hits the protocol's infinity value. Split horizon fixes the naive version by simply never advertising a route back toward the neighbor you learned it from. Poison reverse is the stronger version — actively telling that neighbor 'this route is infinity/unreachable via me,' which resolves the ambiguity immediately instead of relying on the recipient to just not receive misleading information.",
    interviewerExpectations: [
      "Walks through a concrete failure scenario with specific router names and cost increments",
      "Correctly distinguishes split horizon (withhold) from poison reverse (actively advertise infinity)",
      "Understands why this problem is specific to distance-vector, not link-state",
    ],
    followUpQuestions: [
      "Does split horizon fully solve count-to-infinity in all topologies, including ones with more than 3 routers in a loop?",
      "What is a triggered update, and how does it complement split horizon?",
      "Why doesn't OSPF need an equivalent mechanism?",
    ],
    commonMistakes: [
      "Confusing split horizon and poison reverse as the same mechanism",
      "Giving only an abstract definition without walking through a concrete example",
    ],
    discussionPoints: ["Stale route propagation", "Split horizon", "Poison reverse", "Triggered updates"],
  },
  {
    id: "routing-algorithms-iv-3",
    question: "How does BGP differ from OSPF, and why does the internet need both?",
    difficulty: "Medium",
    detailedAnswer:
      "OSPF is an Interior Gateway Protocol (IGP) — it runs within a single autonomous system (one organization's network) and uses link-state/Dijkstra to compute efficient shortest paths across that organization's own routers. BGP is an Exterior Gateway Protocol (EGP) — it runs between autonomous systems, connecting different organizations'/ISPs' networks together, and it's a path-vector protocol: instead of a simple cost metric, it advertises the full sequence of ASes (the AS-path) a route traverses, and route selection is driven heavily by policy (business/peering relationships, cost agreements) rather than pure shortest-path optimization. The internet needs both because they solve fundamentally different problems at different scales: OSPF efficiently routes traffic within one network where the operator controls every router and wants optimal paths; BGP connects thousands of independently-operated networks that don't trust each other's internal topology and need policy control over which routes to accept/advertise, plus loop prevention that works even without any shared trust (checking if your own AS is already in the AS-path).",
    idealAnswer:
      "OSPF runs inside one network — think of it as how Google routes traffic between its own routers efficiently. BGP runs between networks — it's how Google's network talks to Comcast's network talks to a university's network, none of which trust each other's internals. That's why BGP isn't just 'OSPF at a bigger scale' — it's fundamentally policy-driven, because ISPs make routing decisions based on business relationships and peering agreements, not pure path length, and it carries the AS-path explicitly so loop detection works even between mutually distrusting networks. You need an efficient IGP inside each network and a policy-aware EGP connecting all the networks together, and OSPF and BGP are the standard answers to those two different problems.",
    interviewerExpectations: [
      "Correctly identifies OSPF as IGP and BGP as EGP",
      "Explains BGP's path-vector nature and policy-driven route selection",
      "Articulates why a single unified protocol wouldn't work at both scales (trust, policy, scale)",
    ],
    followUpQuestions: [
      "How does BGP prevent routing loops using the AS-path attribute?",
      "What's a real-world example of a BGP misconfiguration causing an outage?",
      "Could you run BGP inside a single organization's network instead of OSPF? Why might you?",
    ],
    commonMistakes: [
      "Treating BGP as 'just a bigger OSPF' rather than a fundamentally different, policy-driven protocol",
      "Not knowing the IGP/EGP terminology",
    ],
    discussionPoints: ["IGP vs EGP", "AS-path and policy routing", "Trust boundaries between networks"],
  },
  {
    id: "routing-algorithms-iv-4",
    question: "Walk through how Dijkstra's algorithm computes shortest paths, and explain why it wouldn't work correctly with negative edge weights.",
    difficulty: "Medium",
    detailedAnswer:
      "Dijkstra maintains a set of 'settled' nodes with a finalized shortest distance from the source, and a priority queue of candidate nodes with tentative distances. It repeatedly extracts the unsettled node with the smallest tentative distance, marks it settled (assumes this distance can never be improved upon later), and relaxes its neighbors — updating their tentative distance if going through the just-settled node is cheaper than their current estimate. This greedy 'settle the closest unsettled node first' strategy relies on the invariant that once a node's distance is finalized, no future path through a not-yet-settled (and therefore, by definition, farther) node could ever produce a shorter path to it — which is only true if all edge weights are non-negative. With a negative edge weight, a node that looks far away right now could later be reached via a path that goes through a settled node and then takes a negative-weight edge to become cheaper than what was already finalized, silently producing an incorrect answer since Dijkstra never revisits settled nodes. Bellman-Ford instead relaxes every edge in the graph up to V-1 times without ever permanently settling a node early, which correctly handles negative weights at the cost of being slower.",
    idealAnswer:
      "Dijkstra is greedy: repeatedly grab the closest not-yet-finalized node, lock in its distance, and use it to try to shorten its neighbors' distances, until everything's finalized. It only works because it assumes once you've locked in a node's shortest distance, nothing later can beat it — which is true as long as all edges only add distance. A negative edge breaks that assumption completely, since a 'longer' path could suddenly become shorter by picking up a negative edge later, and Dijkstra has already moved on and won't reconsider that settled node. Bellman-Ford is the fix — it doesn't lock anything in early, it just keeps relaxing every edge repeatedly until nothing improves, which handles negative weights correctly but takes more iterations.",
    interviewerExpectations: [
      "Correctly describes the greedy settle-and-relax mechanism",
      "Identifies the exact invariant (no future improvement to a settled node) that negative weights violate",
      "Connects this back to why Bellman-Ford, not Dijkstra, underlies distance-vector routing",
    ],
    followUpQuestions: [
      "What is the time complexity of Dijkstra with a binary heap versus a Fibonacci heap?",
      "Are negative edge weights ever realistic in a routing context?",
      "How does Bellman-Ford detect a negative-weight cycle?",
    ],
    commonMistakes: [
      "Describing Dijkstra correctly but not explaining why negative weights specifically break it",
      "Confusing Dijkstra's greedy settling with Bellman-Ford's repeated relaxation",
    ],
    discussionPoints: ["Greedy algorithm invariants", "Relaxation", "Negative edge weights", "Time complexity"],
  },
  {
    id: "routing-algorithms-iv-5",
    question: "Your company's multi-region service suddenly becomes unreachable from a specific set of countries, while working fine everywhere else, and your own infrastructure monitoring shows no issues on your side. How would you investigate whether this is a BGP routing problem, and what would you look for?",
    difficulty: "Hard",
    detailedAnswer:
      "Since the outage is geographically scoped and my own infrastructure looks healthy, I'd suspect an inter-domain routing issue rather than an application or server problem — this points toward BGP rather than anything inside my own network. I'd start by checking public BGP looking-glass tools and route collectors (e.g. RIPE RIS, RouteViews, or a service like BGPStream/BGPmon) to see whether my company's advertised IP prefixes are being correctly propagated and seen by ASes in the affected countries — specifically checking for a route leak (someone incorrectly advertising a more specific or preferred path that diverts traffic away from us), a route hijack (a malicious or misconfigured AS falsely announcing ownership of our IP space), or simply a withdrawn/missing route at a regional internet exchange or transit provider. I'd also check whether the affected countries share a common upstream transit ISP or internet exchange point, which would narrow the fault to that provider's peering rather than a global BGP problem. If it looks like a hijack or leak, the practical mitigation is contacting the affected transit provider/IXP and, if we control our own AS, potentially re-announcing our prefixes more specifically (a more specific prefix is generally preferred in BGP's longest-prefix-match route selection) to reclaim traffic while the upstream issue gets resolved.",
    idealAnswer:
      "Since it's geographically scoped and my own systems look fine, I'd treat this as a routing problem outside my control rather than an application issue, and specifically suspect BGP. I'd check public route-visibility tools like RIPE RIS or RouteViews to see if my prefixes are even being seen correctly in the affected region — looking for signs of a route hijack, a route leak, or just a withdrawn route somewhere upstream. I'd also check if the affected countries funnel through a shared transit provider or IXP, which would point at one specific upstream link rather than a global BGP failure. If I find a hijack, one concrete mitigation I control is announcing a more specific prefix from my own AS, since BGP's longest-prefix-match rule will generally prefer that over the conflicting broader announcement, which can reclaim traffic while I get the upstream provider to fix the underlying leak or hijack.",
    interviewerExpectations: [
      "Correctly reasons from 'geographically scoped + my infra is fine' to 'suspect inter-domain routing, not application layer'",
      "Names concrete real-world tools (route collectors, looking glasses) rather than just saying 'check BGP'",
      "Distinguishes route hijack from route leak and proposes a genuine mitigation (more specific prefix announcement)",
    ],
    followUpQuestions: [
      "What is longest-prefix-match and why does it matter for BGP route selection?",
      "How would you tell the difference between a malicious hijack and an honest misconfiguration?",
      "What's RPKI, and how does it help prevent this class of problem?",
    ],
    commonMistakes: [
      "Jumping straight to checking application servers/load balancers despite the outage being clearly geographically scoped",
      "Not knowing any concrete tools for inspecting real-world BGP route propagation",
    ],
    discussionPoints: ["BGP route hijacks and leaks", "Route collectors/looking glasses", "Longest-prefix-match", "RPKI as a mitigation"],
    scenarioBased: true,
  },
];

export default routingAlgorithmsInterviewQuestions;
