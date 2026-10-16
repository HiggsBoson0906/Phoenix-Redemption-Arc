// src/content/cs-fundamentals/networks/articles/routingAlgorithms.ts

import type { Article } from "@/types";

const routingAlgorithmsArticle: Article = {
  slug: "routing-algorithms",
  title: "Routing Algorithms",
  summary:
    "Routing algorithms decide the path a packet takes across a network of routers — distance-vector and link-state are the two foundational approaches underlying protocols like RIP, OSPF, and BGP.",
  readingTimeMins: 10,
  beginnerExplanation:
    "When you send data across the internet, it doesn't take one fixed path — it hops from router to router, and each router has to decide, packet by packet, which direction gets it closer to the destination. Routing algorithms are the rules routers use to build and maintain their routing tables (a map of 'to reach destination X, send it out this direction') so that these hop-by-hop decisions actually add up to an efficient end-to-end path.\n\nThere are two foundational families of routing algorithm. Distance-vector routing is like asking your neighbors 'how far are you from the destination?' and picking whichever neighbor reports the shortest total distance — you never see the whole map, only what your immediate neighbors tell you. Link-state routing is like every router getting a complete map of the entire network (who's connected to whom, and at what cost) and then independently calculating the best path itself, similar to using GPS with full map data rather than asking for directions turn by turn.",
  detailedBreakdown:
    "Distance-vector routing (based on the Bellman-Ford algorithm) has each router maintain a table of (destination, cost, next-hop) and periodically share its entire table with only its directly connected neighbors. A router updates its table by comparing: for each destination, is (my neighbor's advertised cost to that destination) + (cost of the link to that neighbor) less than what I currently have? If so, I adopt that neighbor as my new next-hop and update my cost — this is the Bellman-Ford relaxation step. RIP (Routing Information Protocol) is the classic example, using hop count as its metric with a maximum of 15 hops (16 = infinity/unreachable), which caps RIP's usable network diameter. Distance-vector's core weaknesses are slow convergence and the count-to-infinity problem: when a link fails, routers can keep incrementing bad information back and forth between each other before realizing the destination is truly unreachable, because each router only trusts its neighbor's summary, not the underlying topology. Mitigations include split horizon (never advertise a route back to the neighbor you learned it from), split horizon with poison reverse (actively advertise that route back as infinity/unreachable), and triggered updates (announce changes immediately rather than waiting for the next periodic update).\n\nLink-state routing (based on Dijkstra's shortest-path algorithm) has each router flood information about its directly connected links (which neighbors it has and at what cost) to every other router in the network, typically via a Link-State Advertisement (LSA) that gets reliably propagated network-wide. Every router ends up with an identical, complete topology map (the link-state database), and each independently runs Dijkstra's algorithm on that map to compute the shortest path to every destination, rooted at itself. OSPF (Open Shortest Path First) is the canonical example, widely used inside enterprise and ISP networks (an Interior Gateway Protocol, IGP). Link-state converges faster and avoids count-to-infinity because every router computes routes from full topology knowledge rather than trusting secondhand neighbor summaries, but it costs more memory (storing the whole topology) and more computation (running Dijkstra) per router.\n\nBGP (Border Gateway Protocol) is neither pure distance-vector nor pure link-state — it's a path-vector protocol, the routing protocol that actually connects autonomous systems (ASes, i.e. distinct organizations/ISPs) across the public internet, making it the Exterior Gateway Protocol (EGP) of the internet. Instead of just a cost, BGP advertises the entire AS-path (sequence of autonomous systems) a route traverses, which lets routers detect and avoid loops trivially (if your own AS number already appears in the path, reject it) and lets route selection incorporate policy (business relationships, cost, preference) rather than just a numeric shortest-path metric — this is critical since ISPs make routing decisions based on peering agreements and money, not pure distance.\n\nDijkstra's algorithm itself: starting from a source node, maintain a set of 'settled' nodes with known shortest distance and a priority queue of candidates; repeatedly extract the unsettled node with the smallest tentative distance, mark it settled, and relax (update) the tentative distances of its neighbors if going through it is shorter. This requires non-negative edge weights (which is true for routing metrics like hop count, bandwidth-based cost, or delay) and, with a binary heap, runs in O((V+E) log V). Bellman-Ford (underlying distance-vector) instead relaxes all edges repeatedly, up to V-1 times, and can tolerate negative edge weights (irrelevant for routing) but converges slower and is exactly why distance-vector protocols propagate information more slowly than link-state ones.",
  realWorldExamples:
    "RIP is largely legacy today (found in very small or educational networks) due to its 15-hop limit and slow convergence, but it's still the canonical teaching example of pure distance-vector routing. OSPF runs inside most enterprise networks and ISP backbones as the Interior Gateway Protocol, computing efficient paths within a single organization's network using link-state flooding and Dijkstra. BGP is what actually holds the internet together at the macro level — every time you access a website hosted by a different ISP than your own, BGP has already negotiated an AS-path between the autonomous systems involved; BGP route leaks or hijacks (a misconfigured or malicious AS falsely announcing routes it shouldn't) have caused real, major internet outages (e.g. the 2008 Pakistan Telecom incident that accidentally blackholed YouTube globally for a period).",
  useCases: [
    "Distance-vector (RIP): small, simple networks where minimal router configuration/overhead matters more than fast convergence",
    "Link-state (OSPF): enterprise and ISP internal networks (IGP) needing fast convergence and efficient shortest-path routing across many routers",
    "Path-vector (BGP): inter-domain routing across the public internet, where policy and business relationships matter as much as path length",
  ],
  advantages: [
    "Distance-vector: simple to implement, low computational overhead per router (no full topology map needed)",
    "Link-state: fast convergence, avoids count-to-infinity, each router has full topology visibility enabling more informed routing decisions",
    "Path-vector (BGP): scales to the entire internet's autonomous systems, supports policy-based routing, and naturally prevents loops via AS-path inspection",
  ],
  disadvantages: [
    "Distance-vector: slow convergence, susceptible to routing loops and the count-to-infinity problem without mitigations like split horizon/poison reverse",
    "Link-state: higher memory and CPU cost (storing full topology, running Dijkstra), and flooding LSAs network-wide adds control-plane overhead",
    "Path-vector (BGP): convergence after a large-scale change can still take minutes across the global internet, and misconfigured route advertisements can cause widespread outages (BGP hijacks)",
  ],
  commonMisconceptions: [
    "\"Link-state routing is always better than distance-vector\" — link-state has real memory/CPU overhead; for very small, simple networks distance-vector's simplicity can be entirely sufficient.",
    "\"BGP picks the shortest path like Dijkstra\" — BGP route selection is driven by policy and AS-path attributes (and a long list of tie-breaking rules), not a pure shortest-path metric; the 'best' BGP route is often not the geographically shortest one.",
    "\"OSPF and BGP do the same job\" — OSPF is an Interior Gateway Protocol (routing within one organization's network); BGP is an Exterior Gateway Protocol (routing between different organizations'/ISPs' networks).",
    "\"Distance-vector protocols know the full network topology\" — they only know their direct neighbors' advertised costs, never the actual topology, which is precisely why they're prone to count-to-infinity.",
  ],
  interviewPerspective:
    "This is one of the most conceptually dense networking topics, and interviewers use it to gauge depth beyond memorized protocol names. Be ready to explain Bellman-Ford vs. Dijkstra as algorithms first, then map them to distance-vector vs. link-state routing, then name real protocols (RIP, OSPF) as instances of each. The count-to-infinity problem and split-horizon/poison-reverse mitigation is a very common deep-dive follow-up. Also expect 'why is BGP different from OSPF' — the IGP vs. EGP distinction, and the fact that BGP optimizes for policy, not pure path length, is the answer interviewers are fishing for.",
  oaPerspective:
    "OA rounds test both algorithmic computation (run Dijkstra or a distance-vector table update by hand on a small given graph and report the resulting shortest distances/next-hops) and protocol classification MCQs (is RIP distance-vector or link-state? is OSPF an IGP or EGP?). A very common numeric pattern: given a router's neighbors and their advertised distance-vector costs to some destination, compute the new best cost and next-hop using the Bellman-Ford relaxation rule (min over neighbors of link-cost-to-neighbor + neighbor's-advertised-cost).",
  keyTakeaways: [
    "Distance-vector routing (Bellman-Ford, e.g. RIP) shares full routing tables with immediate neighbors only and knows nothing about full topology.",
    "Link-state routing (Dijkstra, e.g. OSPF) floods link information network-wide so every router computes shortest paths from a complete topology map.",
    "Count-to-infinity is distance-vector's core weakness, mitigated by split horizon and poison reverse.",
    "BGP is a path-vector protocol used for inter-AS (inter-ISP) routing on the public internet, driven by policy and AS-path attributes rather than pure shortest-path metrics.",
    "OSPF is an Interior Gateway Protocol (within one organization); BGP is an Exterior Gateway Protocol (between organizations/ISPs).",
  ],
  summaryClosing:
    "Routing algorithms translate two classic graph algorithms — Bellman-Ford and Dijkstra — into the real, distributed, imperfect-information protocols that keep every packet on the internet moving toward its destination. Understanding both families, their tradeoffs, and where BGP's policy-driven path-vector approach fits in is core vocabulary for reasoning about network design, outages, and internet-scale routing decisions.",
  relatedTopics: ["OSI & TCP/IP Models", "IP Addressing & Subnetting", "Switching Techniques", "TCP vs UDP"],
  furtherReading: [
    { label: "RFC 2453 — RIP Version 2", note: "The formal spec for the canonical distance-vector protocol, including the 15-hop limit and timers." },
    { label: "RFC 2328 — OSPF Version 2", note: "The formal spec for the canonical link-state IGP." },
    { label: "RFC 4271 — BGP-4", note: "The protocol that holds the internet's autonomous systems together." },
  ],
};

export default routingAlgorithmsArticle;
