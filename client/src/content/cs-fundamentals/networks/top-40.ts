// src/content/cs-fundamentals/networks/top-40.ts
// The 40 highest-frequency Computer Networks interview questions across
// product companies, startups, service companies, and FAANG-style loops.

import type { Top40Question } from "@/types";

const networksTop40: Top40Question[] = [
  {
    id: "cn-top40-1",
    rank: 1,
    question: "Explain the OSI model and the TCP/IP model. How do they map to each other?",
    difficulty: "Easy",
    frequency: "Very High",
    shortAnswer:
      "OSI is a 7-layer conceptual model (Physical, Data Link, Network, Transport, Session, Presentation, Application); TCP/IP is the practically-used 4-layer model (Link, Internet, Transport, Application) that real networks actually implement, with OSI's session/presentation/application layers folded into TCP/IP's single Application layer.",
    detailedAnswer:
      "OSI is primarily a teaching and reference model for understanding networking concerns in isolation; TCP/IP is what the actual internet runs on. Each OSI layer maps roughly to a TCP/IP layer: Physical+Data Link → Link, Network → Internet, Transport → Transport, and Session+Presentation+Application → Application.",
    deepExplanation:
      "Being able to name what happens at each layer (e.g. Data Link does framing/MAC addressing, Network does IP addressing/routing, Transport does port-based multiplexing/reliability) is what separates a memorized answer from a real one — interviewers often ask 'which layer does X live at' as a rapid-fire follow-up.",
    realWorldRelevance:
      "When debugging 'the internet is down,' experienced engineers mentally walk the stack bottom-up (cable/wifi → IP reachability via ping → port/firewall via telnet/curl → application-level errors) — that instinct comes directly from this layered model.",
    keywords: ["OSI 7 layers", "TCP/IP 4 layers", "encapsulation"],
    commonMistakes: ["Reciting layer names out of order", "Not being able to map OSI layers to TCP/IP layers"],
    relatedTopics: ["Switching Techniques", "Routing Algorithms", "TCP vs UDP"],
    followUpQuestions: ["What happens at the Data Link layer specifically?", "What is encapsulation/decapsulation?"],
    tags: ["Must Know"],
    companyStyleTags: ["Startup-style", "Amazon-style"],
  },
  {
    id: "cn-top40-2",
    rank: 2,
    question: "What is the difference between TCP and UDP?",
    difficulty: "Easy",
    frequency: "Very High",
    shortAnswer:
      "TCP is connection-oriented, reliable, and ordered (via handshake, acknowledgments, and retransmission); UDP is connectionless, unreliable, and unordered but has far lower overhead and latency.",
    detailedAnswer:
      "TCP guarantees delivery and order at the cost of extra round-trips (handshake) and header overhead (20+ bytes); UDP just fires packets with an 8-byte header and no delivery guarantee, leaving reliability to the application if needed.",
    deepExplanation:
      "The real skill is knowing WHEN to use which: TCP for anything where losing/reordering data is unacceptable (web pages, file transfer, APIs); UDP for latency-sensitive real-time data where a dropped packet is better than a late one (video calls, live gaming, DNS queries).",
    realWorldRelevance:
      "Video calls use UDP-based protocols (like WebRTC over UDP) because a slightly glitchy frame is better than the whole call freezing waiting for a retransmitted packet — a design trade-off directly explained by TCP vs UDP.",
    keywords: ["connection-oriented", "connectionless", "reliability", "header overhead"],
    commonMistakes: ["Saying UDP is 'always worse' rather than explaining the latency/reliability trade-off"],
    relatedTopics: ["TCP vs UDP", "Congestion & Flow Control", "Sockets & Client-Server Communication"],
    followUpQuestions: ["When would you deliberately choose UDP?", "How does TCP guarantee ordering?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Google-style", "Amazon-style", "Startup-style"],
  },
  {
    id: "cn-top40-3",
    rank: 3,
    question: "Walk me through the TCP three-way handshake.",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "Client sends SYN, server responds SYN-ACK, client responds ACK — after this, both sides have confirmed they can send and receive, and the connection is established.",
    detailedAnswer:
      "SYN carries the client's initial sequence number; SYN-ACK acknowledges it and carries the server's own initial sequence number; the final ACK acknowledges the server's sequence number, completing bidirectional sequence number synchronization.",
    deepExplanation:
      "This is why TCP has connection setup latency (at least 1 RTT before any data flows) that UDP doesn't — and why protocols like TLS 1.3 and QUIC specifically optimize around reducing handshake round-trips.",
    realWorldRelevance:
      "TCP connection setup latency is a real, measurable cost in mobile networks with high RTT, which is a major reason HTTP/2 connection reuse and QUIC (0-RTT resumption) exist.",
    keywords: ["SYN", "SYN-ACK", "ACK", "sequence numbers"],
    commonMistakes: ["Getting the flag order wrong", "Not knowing what happens on connection teardown (FIN/ACK, four-way)"],
    relatedTopics: ["TCP vs UDP", "HTTP & HTTPS"],
    followUpQuestions: ["How does TCP connection teardown work?", "What is a half-open connection / SYN flood?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "cn-top40-4",
    rank: 4,
    question: "What is IP addressing, and how does subnetting work?",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "An IP address identifies a device on a network; subnetting divides a larger network into smaller sub-networks by borrowing bits from the host portion of the address for additional network bits, using a subnet mask.",
    detailedAnswer:
      "A /24 network (255.255.255.0) has 256 addresses (254 usable after network+broadcast); subnetting it into /26s creates 4 subnets of 64 addresses (62 usable) each — the math is always powers of 2 based on how many bits are borrowed.",
    deepExplanation:
      "CIDR notation (e.g. 192.168.1.0/24) replaced the old class-based (A/B/C) system specifically to allow arbitrary, efficient subnet sizing instead of wasting huge blocks of addresses on class boundaries.",
    realWorldRelevance:
      "Cloud VPC design (AWS/GCP/Azure) is fundamentally a subnetting exercise — choosing CIDR blocks for VPCs and subnets to avoid IP exhaustion or overlap is a real, common cloud infrastructure task.",
    keywords: ["CIDR", "subnet mask", "network vs host bits"],
    commonMistakes: ["Confusing network address/broadcast address with usable host addresses", "Miscounting usable hosts (forgetting to subtract 2)"],
    relatedTopics: ["IP Addressing & Subnetting", "Routing Algorithms"],
    followUpQuestions: ["How many usable hosts does a /27 subnet have?", "What is CIDR and why did it replace classful addressing?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "cn-top40-5",
    rank: 5,
    question: "What's the difference between a router and a switch?",
    difficulty: "Easy",
    frequency: "High",
    shortAnswer:
      "A switch operates at the Data Link layer, forwarding frames within a single network based on MAC addresses; a router operates at the Network layer, forwarding packets between different networks based on IP addresses.",
    detailedAnswer:
      "A switch learns which MAC address lives on which port and forwards frames accordingly within a LAN; a router makes forwarding decisions by consulting a routing table to determine the best path toward a destination IP network, often connecting entirely different networks together.",
    deepExplanation:
      "This is also why switches don't need IP addresses to do their basic job (though manageable switches have one for administration) while routing fundamentally requires IP-layer awareness.",
    realWorldRelevance:
      "Your home Wi-Fi router is actually doing both jobs — switching between devices on your LAN and routing between your LAN and your ISP's network — which is a common source of confusion.",
    keywords: ["Data Link layer", "Network layer", "MAC address", "routing table"],
    commonMistakes: ["Saying they do the same thing", "Not knowing which OSI layer each operates at"],
    relatedTopics: ["OSI & TCP/IP Models", "Switching Techniques", "Routing Algorithms"],
    followUpQuestions: ["What is a hub, and why is it different from both?", "How does a switch learn MAC addresses?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Startup-style", "Microsoft-style"],
  },
  {
    id: "cn-top40-6",
    rank: 6,
    question: "Compare distance-vector and link-state routing algorithms.",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "Distance-vector protocols (like RIP) share only their own routing table with direct neighbors and compute paths using Bellman-Ford; link-state protocols (like OSPF) flood full topology information to every router, which independently computes shortest paths using Dijkstra's algorithm.",
    detailedAnswer:
      "Distance-vector is simpler but converges slowly and is prone to routing loops (fixed with techniques like split horizon and route poisoning); link-state converges faster and avoids loops since every router has a complete topology view, at the cost of more memory/computation and flooding overhead.",
    deepExplanation:
      "The 'count-to-infinity' problem is the classic distance-vector failure mode worth naming specifically — nodes can slowly increment a bad route's cost instead of immediately detecting it's unreachable, which is exactly what split-horizon/poison-reverse mitigate.",
    realWorldRelevance:
      "OSPF (link-state) is the standard choice for internal enterprise routing today specifically because of its fast convergence, while BGP (a path-vector protocol, a distinct third category) governs routing between autonomous systems across the internet.",
    keywords: ["Bellman-Ford", "Dijkstra", "count-to-infinity", "OSPF", "RIP"],
    commonMistakes: ["Not knowing which real protocol is which type", "Confusing distance-vector with path-vector (BGP)"],
    relatedTopics: ["Routing Algorithms", "Switching Techniques"],
    followUpQuestions: ["What is the count-to-infinity problem and how is it fixed?", "Where does BGP fit into this classification?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "cn-top40-7",
    rank: 7,
    question: "What is DNS, and walk me through what happens when you type a URL and hit enter.",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "DNS translates human-readable domain names into IP addresses via a hierarchical, cached lookup (browser cache → OS cache → recursive resolver → root → TLD → authoritative nameserver), after which the browser opens a TCP connection (and TLS handshake for HTTPS) and sends an HTTP request.",
    detailedAnswer:
      "The full flow: DNS resolution finds the IP → TCP three-way handshake connects to that IP on port 80/443 → for HTTPS, a TLS handshake negotiates encryption → the browser sends an HTTP request → the server responds → the browser parses HTML and fetches additional resources (CSS, JS, images), often opening more connections.",
    deepExplanation:
      "This question is really testing whether you understand how ALL the networking layers compose together in a real request — a strong answer touches DNS, TCP, TLS, and HTTP in the correct order without prompting.",
    realWorldRelevance:
      "This exact flow is why 'the site is down' debugging follows a specific order: check DNS resolution first (nslookup/dig), then TCP reachability (telnet/curl -v), then TLS cert validity, then the actual HTTP response — mirroring the request's own layered construction.",
    keywords: ["DNS resolution", "TCP handshake", "TLS handshake", "HTTP request"],
    commonMistakes: ["Skipping steps (e.g. forgetting TLS for HTTPS)", "Not mentioning caching at multiple levels"],
    relatedTopics: ["DNS", "HTTP & HTTPS", "TCP vs UDP"],
    followUpQuestions: ["What is a CNAME record and when would you use one?", "What is DNS caching and what is TTL?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style", "Startup-style"],
  },
  {
    id: "cn-top40-8",
    rank: 8,
    question: "What is the difference between HTTP and HTTPS?",
    difficulty: "Easy",
    frequency: "Very High",
    shortAnswer:
      "HTTPS is HTTP layered on top of TLS/SSL encryption — same request/response model, but the connection is encrypted, authenticated (via certificates), and tamper-protected.",
    detailedAnswer:
      "A TLS handshake happens before any HTTP data is sent: the client and server negotiate a cipher suite, the server presents a certificate (verified against a trusted CA) to prove its identity, and a shared symmetric session key is established (via asymmetric key exchange) for encrypting the actual HTTP traffic.",
    deepExplanation:
      "The 'why not just always use asymmetric encryption' follow-up is common — the answer is performance: asymmetric encryption is computationally expensive, so TLS uses it only briefly to securely exchange a symmetric key, then switches to fast symmetric encryption for the actual data.",
    realWorldRelevance:
      "Browsers now flag plain HTTP sites as 'Not Secure,' and free certificate authorities (Let's Encrypt) made HTTPS-everywhere the default expectation for any production web service.",
    keywords: ["TLS/SSL", "certificate", "symmetric vs asymmetric encryption"],
    commonMistakes: ["Saying HTTPS is 'just HTTP with a password'", "Not explaining why symmetric+asymmetric are combined"],
    relatedTopics: ["HTTP & HTTPS", "Network Security Fundamentals"],
    followUpQuestions: ["Walk through the TLS handshake in more detail.", "What does a certificate authority actually verify?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Startup-style"],
  },
  {
    id: "cn-top40-9",
    rank: 9,
    question: "Explain TCP congestion control — slow start, congestion avoidance, and how TCP reacts to packet loss.",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "TCP starts conservatively (slow start: congestion window doubles each RTT until a threshold), then grows linearly (congestion avoidance), and on detecting loss, cuts its window aggressively (multiplicative decrease) before ramping back up — this AIMD (additive increase, multiplicative decrease) pattern is what keeps a shared network from collapsing under overload.",
    detailedAnswer:
      "On packet loss detected via timeout, TCP resets to slow start from a small window; on loss detected via triple duplicate ACKs (fast retransmit), it only halves the window and enters fast recovery, resuming linear growth without a full reset — a lighter-weight response to what's usually a less severe signal.",
    deepExplanation:
      "The distinction between timeout-triggered loss (severe, reset hard) and duplicate-ACK-triggered loss (mild, react lighter) is exactly the kind of nuance that separates a strong interview answer from a memorized one.",
    realWorldRelevance:
      "This algorithm is why a new TCP connection on a fast link takes a moment to 'ramp up' to full throughput, and why bulk transfer tools sometimes use multiple parallel TCP connections to work around any single connection's conservative growth.",
    keywords: ["slow start", "AIMD", "fast retransmit", "fast recovery"],
    commonMistakes: ["Not distinguishing timeout-triggered vs duplicate-ACK-triggered loss response", "Confusing congestion control with flow control"],
    relatedTopics: ["Congestion & Flow Control", "TCP vs UDP"],
    followUpQuestions: ["What's the difference between flow control and congestion control?", "What is TCP's sliding window used for?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "cn-top40-10",
    rank: 10,
    question: "What is the difference between flow control and congestion control in TCP?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "Flow control prevents a fast sender from overwhelming a slow RECEIVER (managed via the receiver's advertised window size); congestion control prevents the sender from overwhelming the shared NETWORK itself (managed via the sender's congestion window).",
    detailedAnswer:
      "The receiver advertises how much buffer space it has left (flow control); the sender separately tracks how much the network seems able to handle without loss (congestion control) — the actual amount of data TCP sends is the minimum of both windows.",
    deepExplanation:
      "This distinction — endpoint-focused vs network-focused — is exactly what trips people up, since both mechanisms limit how much data is 'in flight,' but for entirely different reasons.",
    realWorldRelevance:
      "A slow mobile client with limited buffer memory triggers flow control; a congested shared network link triggers congestion control — diagnosing which one is limiting throughput requires knowing this distinction.",
    keywords: ["receiver window", "congestion window", "in-flight data"],
    commonMistakes: ["Treating flow control and congestion control as the same mechanism"],
    relatedTopics: ["Congestion & Flow Control", "TCP vs UDP"],
    followUpQuestions: ["What determines the actual send window size at any moment?", "How does the receiver communicate its window size?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "cn-top40-11",
    rank: 11,
    question: "What is NAT (Network Address Translation) and why is it needed?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "NAT lets many devices on a private network share a single public IP address by rewriting source addresses/ports as traffic leaves the network, which conserves the limited pool of IPv4 addresses.",
    detailedAnswer:
      "A NAT device (usually a home router) maintains a translation table mapping (private IP, private port) pairs to (public IP, public port) pairs, rewriting outgoing packets and reverse-translating replies so the private devices remain reachable for return traffic despite not having their own public IP.",
    deepExplanation:
      "NAT is also why unsolicited inbound connections to devices behind a home router don't just work by default — the router has no existing translation table entry to route them to, which is exactly why port forwarding exists.",
    realWorldRelevance:
      "Practically every home and office network relies on NAT — it's a major reason IPv4 address exhaustion hasn't caused a full-blown crisis despite IPv6 adoption still being incomplete decades after IPv4 addresses ran low.",
    keywords: ["private IP", "public IP", "port forwarding"],
    commonMistakes: ["Confusing NAT with a firewall (related but distinct purposes)"],
    relatedTopics: ["IP Addressing & Subnetting", "Network Security Fundamentals"],
    followUpQuestions: ["Why can't two devices behind the same NAT easily accept unsolicited inbound connections?", "How does NAT relate to IPv4 exhaustion?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Startup-style", "Microsoft-style"],
  },
  {
    id: "cn-top40-12",
    rank: 12,
    question: "What is the difference between IPv4 and IPv6?",
    difficulty: "Easy",
    frequency: "Medium",
    shortAnswer:
      "IPv4 uses 32-bit addresses (~4.3 billion, effectively exhausted), written in dotted decimal (e.g. 192.168.1.1); IPv6 uses 128-bit addresses (an astronomically larger space), written in hexadecimal groups (e.g. 2001:0db8::1), designed specifically to solve address exhaustion and simplify routing/configuration.",
    detailedAnswer:
      "IPv6 also removes the need for NAT in most designs (since there are enough addresses for every device to have a public one), simplifies header processing (fixed-size, simpler header than IPv4's variable options), and has built-in support for features like stateless address auto-configuration.",
    deepExplanation:
      "IPv6 adoption has been famously slow due to backward-compatibility inertia — most of the internet runs a dual-stack or NAT-heavy IPv4 setup rather than a clean IPv6 cutover, decades after the design was finalized.",
    realWorldRelevance:
      "Mobile carriers are among the heaviest IPv6 adopters today, since they need to assign enormous numbers of addresses to phones at a scale IPv4 genuinely cannot support without heavy NAT layering (CGNAT).",
    keywords: ["32-bit vs 128-bit", "address exhaustion", "CGNAT"],
    commonMistakes: ["Not knowing the bit-length difference", "Assuming IPv6 is universally deployed"],
    relatedTopics: ["IP Addressing & Subnetting"],
    followUpQuestions: ["Why has IPv6 adoption been slow?", "What is CGNAT and why do carriers use it?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Startup-style"],
  },
  {
    id: "cn-top40-13",
    rank: 13,
    question: "What is ARP (Address Resolution Protocol)?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "ARP resolves a known IP address to the corresponding MAC address on a local network, which is necessary because Data Link layer frames need a destination MAC address, while applications only know IP addresses.",
    detailedAnswer:
      "A device broadcasts an ARP request ('who has this IP?') to the local network; the device owning that IP replies directly with its MAC address, which the requester then caches (the ARP cache) to avoid repeating the broadcast for every packet.",
    deepExplanation:
      "ARP only works within a single broadcast domain (local network) — routing to a different network relies on the router's MAC address being resolved instead, since packets get re-framed at each hop.",
    realWorldRelevance:
      "ARP spoofing/poisoning (sending forged ARP replies to redirect traffic) is a classic local-network man-in-the-middle attack technique, which is why switches/networks sometimes implement dynamic ARP inspection as a defense.",
    keywords: ["MAC resolution", "ARP cache", "broadcast domain"],
    commonMistakes: ["Confusing ARP with DNS (different layers, different purposes)"],
    relatedTopics: ["Switching Techniques", "Network Security Fundamentals"],
    followUpQuestions: ["What is ARP spoofing?", "Why doesn't ARP work across different networks?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style"],
  },
  {
    id: "cn-top40-14",
    rank: 14,
    question: "What is a firewall, and what's the difference between a firewall and a VPN?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "A firewall filters traffic based on rules (allow/deny by IP, port, protocol) to control what can enter or leave a network; a VPN creates an encrypted tunnel between two points over an untrusted network so traffic looks like it originates from a different, trusted location.",
    detailedAnswer:
      "Firewalls can be stateless (rule-based on each packet independently) or stateful (tracking connection state to make smarter allow/deny decisions); VPNs solve a fundamentally different problem — confidentiality and trusted-network extension over the public internet, not traffic filtering.",
    deepExplanation:
      "The two are often used together, not as alternatives: a company might require VPN access to even reach internal resources, which are then further protected by internal firewalls — they solve complementary, not competing, problems.",
    realWorldRelevance:
      "Remote work infrastructure commonly requires VPN access specifically so employee traffic to internal systems is encrypted and appears to originate from the corporate network, satisfying firewall rules that only allow internal-looking traffic.",
    keywords: ["stateful vs stateless firewall", "encrypted tunnel"],
    commonMistakes: ["Treating firewall and VPN as solving the same problem"],
    relatedTopics: ["Network Security Fundamentals"],
    followUpQuestions: ["What's the difference between a stateful and stateless firewall?", "How does a VPN actually encrypt traffic?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "cn-top40-15",
    rank: 15,
    question: "Explain symmetric vs asymmetric encryption, and why TLS uses both.",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "Symmetric encryption uses one shared key for both encryption and decryption (fast, but the key must somehow be securely shared first); asymmetric encryption uses a public/private key pair (solves key distribution, but computationally expensive) — TLS uses asymmetric encryption briefly to securely exchange a symmetric session key, then uses fast symmetric encryption for the actual data.",
    detailedAnswer:
      "This hybrid approach gets the best of both: asymmetric encryption's public-key distribution solves the 'how do two strangers agree on a secret over an insecure channel' problem, while symmetric encryption's speed makes bulk data transfer practical — pure asymmetric encryption for an entire TLS session would be far too slow.",
    deepExplanation:
      "Modern TLS (1.3) uses ephemeral Diffie-Hellman key exchange specifically to achieve forward secrecy — even if a private key is later compromised, past session keys (and thus past traffic) can't be decrypted retroactively.",
    realWorldRelevance:
      "This hybrid pattern isn't unique to TLS — it's the standard design for essentially every secure communication protocol (SSH, signed software updates, etc.) for exactly the same performance/key-distribution trade-off reasons.",
    keywords: ["public/private key", "session key", "forward secrecy"],
    commonMistakes: ["Claiming TLS uses only one type of encryption throughout the whole session"],
    relatedTopics: ["Network Security Fundamentals", "HTTP & HTTPS"],
    followUpQuestions: ["What is forward secrecy and why does it matter?", "What is a certificate authority's role in this?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "cn-top40-16",
    rank: 16,
    question: "What is a DDoS attack, and how are they typically mitigated?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A Distributed Denial-of-Service attack floods a target with traffic from many sources simultaneously to exhaust its resources (bandwidth, connections, or compute) and make it unavailable to legitimate users. Mitigation includes traffic scrubbing/filtering, rate limiting, CDN/anycast distribution to absorb load, and blackholing malicious sources.",
    detailedAnswer:
      "Attacks vary by layer: volumetric attacks flood bandwidth (e.g. UDP/DNS amplification), protocol attacks exhaust connection state (e.g. SYN floods exploiting the TCP handshake), and application-layer attacks mimic legitimate but expensive requests (e.g. repeated slow HTTP requests).",
    deepExplanation:
      "A SYN flood is a classic protocol-layer DDoS: sending many SYN packets without completing the handshake exhausts a server's half-open connection table — mitigated by SYN cookies, which avoid allocating state until the handshake actually completes.",
    realWorldRelevance:
      "Large-scale DDoS mitigation services (Cloudflare, AWS Shield) work by absorbing and filtering attack traffic across a globally distributed network before it ever reaches the origin server — a practical application of this exact theory.",
    keywords: ["SYN flood", "volumetric attack", "traffic scrubbing"],
    commonMistakes: ["Not distinguishing DoS (single source) from DDoS (distributed)"],
    relatedTopics: ["Network Security Fundamentals", "TCP vs UDP"],
    followUpQuestions: ["What is a SYN flood and how do SYN cookies mitigate it?", "What's the difference between DoS and DDoS?"],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Uber-style"],
  },
  {
    id: "cn-top40-17",
    rank: 17,
    question: "What is a CDN (Content Delivery Network), and how does it improve performance?",
    difficulty: "Easy",
    frequency: "Medium",
    shortAnswer:
      "A CDN caches content across geographically distributed edge servers so users are served from a location physically closer to them, reducing latency, offloading traffic from the origin server, and improving resilience.",
    detailedAnswer:
      "DNS-based or anycast routing directs a user's request to the nearest edge node; if that edge has the content cached, it serves it directly (a cache hit), otherwise it fetches from the origin, caches it, and serves it (a cache miss) — subsequent nearby users then get fast cache hits.",
    deepExplanation:
      "CDNs also absorb significant DDoS traffic and reduce origin load simply by design, which is why performance and security benefits are often bundled together in CDN product offerings.",
    realWorldRelevance:
      "Video streaming, large static assets, and increasingly full API/dynamic content acceleration all rely on CDN infrastructure — it's foundational to how any global-scale web service actually achieves low latency worldwide.",
    keywords: ["edge servers", "cache hit/miss", "anycast"],
    commonMistakes: ["Thinking CDNs only serve static files (modern CDNs do much more)"],
    relatedTopics: ["HTTP & HTTPS", "Routing Algorithms"],
    followUpQuestions: ["What is cache invalidation and why is it hard?", "How does anycast routing work?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Startup-style"],
  },
  {
    id: "cn-top40-18",
    rank: 18,
    question: "What is a proxy server, and what's the difference between a forward proxy and a reverse proxy?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A forward proxy sits in front of CLIENTS, making requests on their behalf (hiding client identity, enforcing access policy); a reverse proxy sits in front of SERVERS, receiving client requests on the server's behalf (load balancing, caching, TLS termination, hiding server topology).",
    detailedAnswer:
      "A forward proxy is what a corporate network might use to filter/monitor employee internet access; a reverse proxy (like Nginx or a load balancer) is what sits in front of a company's own backend services, distributing incoming traffic and shielding internal architecture from the outside world.",
    deepExplanation:
      "The 'which side it represents' framing is the cleanest way to keep these straight — forward proxies act on behalf of the requester, reverse proxies act on behalf of the destination.",
    realWorldRelevance:
      "Nginx and HAProxy as reverse proxies are ubiquitous in production web architecture for load balancing, SSL termination, and request routing across microservices.",
    keywords: ["forward proxy", "reverse proxy", "load balancing"],
    commonMistakes: ["Mixing up which proxy represents the client vs the server"],
    relatedTopics: ["HTTP & HTTPS", "Sockets & Client-Server Communication"],
    followUpQuestions: ["What is SSL/TLS termination and why do it at the proxy?", "How does a reverse proxy help with load balancing?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Uber-style"],
  },
  {
    id: "cn-top40-19",
    rank: 19,
    question: "What are HTTP status code categories, and what do the common ones mean?",
    difficulty: "Easy",
    frequency: "Very High",
    shortAnswer:
      "1xx = informational, 2xx = success, 3xx = redirection, 4xx = client error, 5xx = server error. Common ones: 200 OK, 201 Created, 301 Moved Permanently, 304 Not Modified, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable.",
    detailedAnswer:
      "The category (first digit) alone tells you a lot: any 4xx means the client did something wrong (bad input, missing auth), any 5xx means the server failed despite a valid request — which is the first branching point when debugging a failed API call.",
    deepExplanation:
      "Knowing the difference between 401 (not authenticated at all) and 403 (authenticated but not authorized for this resource) is a common, sharp follow-up that many candidates get wrong.",
    realWorldRelevance:
      "API design and monitoring dashboards are built entirely around these categories — alerting on 5xx rate spikes is a standard production health signal distinct from tracking 4xx (often just bad client requests, less urgent).",
    keywords: ["4xx client error", "5xx server error", "401 vs 403"],
    commonMistakes: ["Confusing 401 and 403", "Not knowing 3xx redirect semantics"],
    relatedTopics: ["HTTP & HTTPS"],
    followUpQuestions: ["What's the difference between 401 and 403?", "What's the difference between 301 and 302?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Startup-style"],
  },
  {
    id: "cn-top40-20",
    rank: 20,
    question: "What is the difference between HTTP/1.1, HTTP/2, and HTTP/3?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "HTTP/1.1 sends requests over a connection mostly sequentially (with limited pipelining issues); HTTP/2 introduces multiplexing (many requests/responses interleaved over one TCP connection) and header compression; HTTP/3 replaces TCP with QUIC (built on UDP) to eliminate head-of-line blocking at the transport layer entirely and reduce connection setup latency.",
    detailedAnswer:
      "HTTP/2's multiplexing still suffers head-of-line blocking at the TCP layer — a single lost packet stalls ALL multiplexed streams on that connection, since TCP guarantees strict ordering; HTTP/3's QUIC (over UDP) handles streams independently, so a lost packet only stalls its own stream.",
    deepExplanation:
      "This TCP-level head-of-line blocking limitation is precisely why HTTP/3 needed a new transport (QUIC) rather than just another HTTP-layer change — it's a genuinely deep architectural fix, not an incremental one.",
    realWorldRelevance:
      "Major CDNs and browsers have rapidly adopted HTTP/3/QUIC specifically for its improved performance on lossy networks (mobile), where head-of-line blocking previously caused noticeably worse page load times.",
    keywords: ["multiplexing", "head-of-line blocking", "QUIC"],
    commonMistakes: ["Not knowing HTTP/3 changes the transport layer (UDP-based QUIC), not just the HTTP semantics"],
    relatedTopics: ["HTTP & HTTPS", "TCP vs UDP"],
    followUpQuestions: ["What is head-of-line blocking specifically?", "Why is QUIC built on UDP instead of TCP?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style"],
  },
  {
    id: "cn-top40-21",
    rank: 21,
    question: "What is a socket, and how does the socket API relate to TCP/UDP?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A socket is an endpoint for network communication, identified by an (IP address, port, protocol) tuple, and the socket API (e.g. Berkeley sockets) is the programming interface applications use to create connections, send/receive data, and listen for incoming connections over TCP or UDP.",
    detailedAnswer:
      "A TCP socket workflow is socket() → bind() → listen() → accept() (server) or connect() (client) → send()/recv() → close(); UDP skips connection-oriented steps (no listen/accept/connect needed in the same way) since it's connectionless — you just sendto()/recvfrom() directly.",
    deepExplanation:
      "Understanding that a listening socket and each accepted connection are actually DIFFERENT sockets (the OS creates a new socket per accepted TCP connection while the original keeps listening) is a subtle but important detail for reasoning about concurrent servers.",
    realWorldRelevance:
      "Every network library in every language (Python's `socket` module, Node's `net`/`dgram`) is a thin wrapper around this exact OS-level socket API, which is why understanding it transfers directly to real backend development.",
    keywords: ["bind/listen/accept/connect", "socket tuple"],
    commonMistakes: ["Not knowing the listening socket and accepted connections are distinct sockets"],
    relatedTopics: ["Sockets & Client-Server Communication", "TCP vs UDP"],
    followUpQuestions: ["What's the difference between a listening socket and a connected socket?", "How would you build a server that handles many concurrent connections?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "cn-top40-22",
    rank: 22,
    question: "What is bandwidth vs latency vs throughput? How are they different?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Bandwidth is the maximum theoretical data rate a link can carry; latency is the time for a single bit/packet to travel from sender to receiver; throughput is the actual achieved data rate in practice, which is always ≤ bandwidth due to overhead, congestion, and protocol limitations.",
    detailedAnswer:
      "A high-bandwidth, high-latency link (like a satellite connection) can still have poor throughput for small transfers because of round-trip-dependent protocols (like TCP's handshake and slow start) — bandwidth alone doesn't determine real-world performance.",
    deepExplanation:
      "The bandwidth-delay product (bandwidth × RTT) determines how much data can be 'in flight' at once, which is exactly why high-latency high-bandwidth links need larger TCP window sizes to actually achieve their theoretical throughput — a classic 'why is my fast internet still slow for this specific transfer' explanation.",
    realWorldRelevance:
      "Satellite internet is the textbook example: high bandwidth but very high latency (600ms+ RTT) means real-world throughput for latency-sensitive protocols is far below the advertised bandwidth number.",
    keywords: ["bandwidth-delay product", "RTT", "throughput vs bandwidth"],
    commonMistakes: ["Using 'bandwidth' and 'throughput' interchangeably"],
    relatedTopics: ["Congestion & Flow Control"],
    followUpQuestions: ["What is the bandwidth-delay product and why does it matter for TCP window sizing?", "Why might a 'faster' internet plan not improve a specific application's performance?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Uber-style"],
  },
  {
    id: "cn-top40-23",
    rank: 23,
    question: "What is packet fragmentation, and what is MTU?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "MTU (Maximum Transmission Unit) is the largest packet size a network link can carry without fragmentation; if a packet exceeds the MTU of a link along its path, it gets split into smaller fragments (IPv4) or the sender is told to shrink it (Path MTU Discovery, common in modern practice).",
    detailedAnswer:
      "Fragmentation adds overhead and failure risk (losing any one fragment requires retransmitting the whole original packet in many implementations), which is why Path MTU Discovery — probing to find the smallest MTU along a path and avoiding fragmentation entirely — is preferred in modern networking, especially since IPv6 removed in-transit router fragmentation entirely.",
    deepExplanation:
      "A classic real-world MTU issue: VPN tunnels add header overhead, effectively shrinking the usable MTU, which can cause mysterious connectivity issues for large packets specifically (small requests work, large ones silently fail) if Path MTU Discovery is blocked by a misconfigured firewall dropping ICMP.",
    realWorldRelevance:
      "'Works fine for small requests but big file uploads hang' is a classic symptom of an MTU/fragmentation-related network misconfiguration, often behind VPNs or certain cloud networking setups.",
    keywords: ["MTU", "Path MTU Discovery", "fragmentation"],
    commonMistakes: ["Not knowing IPv6 disallows in-transit fragmentation by routers"],
    relatedTopics: ["Switching Techniques", "TCP vs UDP"],
    followUpQuestions: ["What is Path MTU Discovery and how does it work?", "Why might blocking ICMP break Path MTU Discovery?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Uber-style"],
  },
  {
    id: "cn-top40-24",
    rank: 24,
    question: "What is DHCP, and how does a device get an IP address automatically?",
    difficulty: "Easy",
    frequency: "Medium",
    shortAnswer:
      "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses (and other config like DNS servers, default gateway) to devices joining a network, via a four-step process: Discover, Offer, Request, Acknowledge (DORA).",
    detailedAnswer:
      "A new device broadcasts a DHCP Discover; a DHCP server responds with an Offer (a proposed IP); the client broadcasts a Request confirming it wants that offer (allowing multiple DHCP servers to see who won); the server sends an Acknowledge finalizing the lease for a set duration.",
    deepExplanation:
      "IP addresses are 'leased,' not permanently assigned — the client must periodically renew the lease before it expires, which is why devices sometimes need to release/renew their DHCP lease to fix certain networking issues.",
    realWorldRelevance:
      "Every device joining a Wi-Fi network without manual configuration relies on DHCP — it's the reason 'just connect to Wi-Fi' works without anyone manually typing in an IP address.",
    keywords: ["DORA process", "IP lease"],
    commonMistakes: ["Not knowing the DORA four-step sequence"],
    relatedTopics: ["IP Addressing & Subnetting"],
    followUpQuestions: ["What happens when a DHCP lease expires?", "What is DHCP starvation as an attack?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Startup-style"],
  },
  {
    id: "cn-top40-25",
    rank: 25,
    question: "What is a checksum, and how does error detection work in networking?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A checksum is a small computed value derived from a packet's data, sent alongside it, that the receiver recomputes and compares to detect transmission errors (corrupted bits) — a mismatch means the data was altered in transit and should be discarded/retransmitted.",
    detailedAnswer:
      "Both TCP and UDP headers include a checksum field; it's a lightweight, fast-to-compute error DETECTION mechanism (not correction) — if it fails, the corrupted data is simply dropped, relying on higher-layer retransmission (TCP) or the application (UDP) to recover.",
    deepExplanation:
      "Checksums can miss certain error patterns (e.g. some multi-bit errors can cancel out and still produce a matching checksum), which is why more robust systems (like storage or critical links) sometimes use stronger error-detecting/correcting codes (CRC, Hamming codes) instead of simple checksums.",
    realWorldRelevance:
      "A UDP packet with a failed checksum is silently dropped — no retransmission happens automatically, which is exactly the kind of reliability gap application-layer protocols using UDP (like a custom game protocol) need to handle themselves.",
    keywords: ["error detection", "TCP/UDP checksum field", "CRC"],
    commonMistakes: ["Confusing error detection (checksum) with error correction"],
    relatedTopics: ["TCP vs UDP"],
    followUpQuestions: ["What's the difference between error detection and error correction?", "What happens when a UDP packet's checksum fails?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style"],
  },
  {
    id: "cn-top40-26",
    rank: 26,
    question: "What is a MAN-in-the-middle (MITM) attack, and how does HTTPS help prevent it?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A MITM attack intercepts communication between two parties, potentially reading or altering it without either side knowing; HTTPS mitigates this via certificate-based server authentication (proving you're really talking to the intended server) plus encryption (making intercepted traffic unreadable).",
    detailedAnswer:
      "Without certificate validation, an attacker could impersonate a server (e.g. via DNS spoofing or ARP poisoning to redirect traffic) and the client would have no way to know — the certificate, signed by a trusted CA and validated against the domain, is what closes that gap.",
    deepExplanation:
      "Certificate pinning (hardcoding which certificate/CA an app trusts for a specific domain) is a further defense used in high-security mobile apps specifically to prevent MITM even if an attacker compromises a trusted CA or the device's trust store.",
    realWorldRelevance:
      "Public Wi-Fi networks are a classic real-world MITM risk surface, which is exactly why HTTPS-everywhere and VPN usage on untrusted networks are standard security recommendations.",
    keywords: ["certificate validation", "DNS spoofing", "ARP poisoning"],
    commonMistakes: ["Not explaining HOW HTTPS specifically prevents MITM (both authentication AND encryption matter)"],
    relatedTopics: ["Network Security Fundamentals", "HTTP & HTTPS"],
    followUpQuestions: ["What is certificate pinning?", "How does DNS spoofing enable a MITM attack?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "cn-top40-27",
    rank: 27,
    question: "What is the sliding window protocol, and why does TCP use it?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "Sliding window lets a sender transmit multiple packets before waiting for individual acknowledgments, up to a window size limit, dramatically improving throughput over a strict stop-and-wait approach — the window 'slides' forward as acknowledgments confirm earlier data was received.",
    detailedAnswer:
      "Without sliding windows, a sender would send one packet, wait for its ACK, then send the next — wasting an entire RTT per packet; sliding windows let many packets be 'in flight' simultaneously, using RTT far more efficiently, especially critical on high-bandwidth-delay-product links.",
    deepExplanation:
      "TCP's window size is dynamically constrained by both the receiver's advertised window (flow control) and the sender's congestion window (congestion control) — the actual window used is the minimum of the two at any given moment.",
    realWorldRelevance:
      "TCP window scaling (an option that lets the window exceed the original 16-bit field's 65KB limit) is why modern high-bandwidth long-distance connections can achieve much higher throughput than older TCP implementations without it.",
    keywords: ["stop-and-wait vs sliding window", "in-flight packets", "window scaling"],
    commonMistakes: ["Not explaining why stop-and-wait is inefficient by comparison"],
    relatedTopics: ["Congestion & Flow Control", "TCP vs UDP"],
    followUpQuestions: ["What is TCP window scaling and why was it introduced?", "How does the sliding window relate to the bandwidth-delay product?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style"],
  },
  {
    id: "cn-top40-28",
    rank: 28,
    question: "What is load balancing, and what are common load balancing strategies?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "Load balancing distributes incoming traffic across multiple backend servers to improve availability and performance; common strategies include round robin, least connections, weighted distribution, and IP/consistent hashing (for session affinity or cache locality).",
    detailedAnswer:
      "Round robin is simple but ignores server load; least-connections routes to whichever server currently has the fewest active connections, adapting better to uneven request costs; consistent hashing is used when you want the same client (or key) to consistently route to the same backend, useful for caching.",
    deepExplanation:
      "Load balancers also operate at different layers: Layer 4 (transport, routing based on IP/port, fast but less flexible) versus Layer 7 (application, routing based on HTTP content like URL path or headers, more flexible but more overhead).",
    realWorldRelevance:
      "Consistent hashing specifically is what lets distributed caches (like a Redis cluster or CDN) route the same key to the same node reliably even as nodes are added/removed, minimizing cache-miss storms during scaling events.",
    keywords: ["round robin", "least connections", "consistent hashing", "L4 vs L7"],
    commonMistakes: ["Not knowing the L4 vs L7 load balancing distinction"],
    relatedTopics: ["HTTP & HTTPS", "Sockets & Client-Server Communication"],
    followUpQuestions: ["What's the difference between L4 and L7 load balancing?", "When would you specifically want consistent hashing over round robin?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Uber-style"],
  },
  {
    id: "cn-top40-29",
    rank: 29,
    question: "What is a WebSocket, and how does it differ from a regular HTTP request?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A WebSocket upgrades a single HTTP connection into a persistent, full-duplex TCP connection, letting the server push data to the client at any time without the client having to repeatedly poll — unlike regular HTTP's request-response-close pattern.",
    detailedAnswer:
      "The connection starts as a normal HTTP request with an 'Upgrade: websocket' header; once the server agrees (101 Switching Protocols), the same underlying TCP connection is repurposed for bidirectional WebSocket framing instead of further HTTP requests.",
    deepExplanation:
      "This is why WebSockets are ideal for real-time features (chat, live notifications, collaborative editing) where server-initiated pushes matter — plain HTTP has no native mechanism for the server to send unsolicited data to the client.",
    realWorldRelevance:
      "Before WebSockets were standard, developers used hacks like long-polling to simulate real-time updates over HTTP — WebSockets (and later, Server-Sent Events for one-directional cases) made this a first-class, efficient capability.",
    keywords: ["101 Switching Protocols", "full-duplex", "persistent connection"],
    commonMistakes: ["Not knowing WebSockets start as a regular HTTP request before upgrading"],
    relatedTopics: ["HTTP & HTTPS", "Sockets & Client-Server Communication"],
    followUpQuestions: ["What's the difference between WebSockets and Server-Sent Events?", "How would you scale a WebSocket-based service across multiple servers?"],
    tags: ["Advanced"],
    companyStyleTags: ["Uber-style", "Startup-style"],
  },
  {
    id: "cn-top40-30",
    rank: 30,
    question: "What is packet switching, and how is it different from circuit switching?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Circuit switching (traditional telephone networks) reserves a dedicated end-to-end path for the entire duration of a communication; packet switching (the internet) breaks data into independently-routed packets that share network links dynamically, with no dedicated reserved path.",
    detailedAnswer:
      "Packet switching is more efficient for bursty data traffic (unused capacity can be used by other traffic) but doesn't guarantee consistent latency/bandwidth the way a dedicated circuit does — which is a real trade-off for latency-sensitive applications like voice calls.",
    deepExplanation:
      "This is exactly why real-time voice/video over packet-switched networks (VoIP) needs additional mechanisms (jitter buffers, QoS prioritization) to approximate the consistent quality a dedicated circuit would have guaranteed by design.",
    realWorldRelevance:
      "The entire internet is built on packet switching for efficiency and resilience (packets can reroute around failures), which is a core architectural reason it scaled globally where circuit-switched telephone networks didn't in the same way.",
    keywords: ["dedicated path", "shared/dynamic routing", "VoIP jitter"],
    commonMistakes: ["Not explaining the efficiency vs consistency trade-off between the two"],
    relatedTopics: ["Switching Techniques"],
    followUpQuestions: ["Why might VoIP still have quality issues on a packet-switched network?", "What is a virtual circuit, and how does it try to bridge both approaches?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Microsoft-style"],
  },
  {
    id: "cn-top40-31",
    rank: 31,
    question: "What is the purpose of ports in networking, and what are some well-known port numbers?",
    difficulty: "Easy",
    frequency: "High",
    shortAnswer:
      "A port number lets a single IP address support many simultaneous network services/connections by identifying which application on that host should receive the traffic. Well-known ports: 80 (HTTP), 443 (HTTPS), 53 (DNS), 22 (SSH), 25 (SMTP), 21 (FTP).",
    detailedAnswer:
      "Ports 0-1023 are 'well-known' ports reserved for standard services; 1024-49151 are registered ports; 49152-65535 are dynamic/ephemeral ports, commonly used as the CLIENT's source port for outgoing connections.",
    deepExplanation:
      "A TCP connection is uniquely identified by the 4-tuple (source IP, source port, destination IP, destination port) — this is exactly why a server can handle many simultaneous connections on the same destination port 443 from different clients (or even the same client on different source ports).",
    realWorldRelevance:
      "Firewall rules are frequently written in terms of allowed ports (e.g. 'only allow 443 inbound') — understanding well-known ports is directly practical for reading and writing basic network security configuration.",
    keywords: ["well-known ports", "ephemeral ports", "4-tuple"],
    commonMistakes: ["Not knowing common port numbers by name"],
    relatedTopics: ["Sockets & Client-Server Communication", "TCP vs UDP"],
    followUpQuestions: ["What identifies a unique TCP connection?", "What's an ephemeral port and when is it used?"],
    tags: ["Must Know"],
    companyStyleTags: ["Startup-style", "Amazon-style"],
  },
  {
    id: "cn-top40-32",
    rank: 32,
    question: "What is a VPN, and how does it work at a technical level?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A VPN creates an encrypted tunnel between a client and a VPN server, encapsulating the client's traffic inside encrypted packets — to the rest of the network it looks like the client is communicating only with the VPN server, while the VPN server forwards (and receives replies for) the client's actual traffic.",
    detailedAnswer:
      "Because all traffic is encrypted end-to-end to the VPN server, intermediate networks (like a coffee shop Wi-Fi) can't inspect or tamper with it; and because the traffic exits from the VPN server's location, the client also appears to be browsing from wherever the VPN server is.",
    deepExplanation:
      "This tunneling/encapsulation adds overhead (extra headers, encryption cost) which is why VPN connections are typically somewhat slower than a direct connection — a real, measurable trade-off for the privacy/security benefit.",
    realWorldRelevance:
      "Corporate VPNs let remote employees securely reach internal-only resources as if they were physically on the office network, which is the most common enterprise use case beyond personal privacy tools.",
    keywords: ["tunneling", "encapsulation", "encrypted tunnel"],
    commonMistakes: ["Thinking a VPN makes you completely anonymous (it shifts trust to the VPN provider, not eliminates it)"],
    relatedTopics: ["Network Security Fundamentals"],
    followUpQuestions: ["Why does using a VPN typically reduce your connection speed?", "What's the difference between a VPN and a proxy?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Startup-style"],
  },
  {
    id: "cn-top40-33",
    rank: 33,
    question: "What is ICMP, and what is it used for?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "ICMP (Internet Control Message Protocol) is used for network diagnostics and error reporting — it's not used to carry application data, but to communicate network-level information like 'destination unreachable' or to implement tools like ping and traceroute.",
    detailedAnswer:
      "Ping sends ICMP Echo Request messages and listens for Echo Reply to test reachability and measure round-trip time; traceroute cleverly sends packets with increasing TTL (time-to-live) values, relying on each router along the path sending back an ICMP 'TTL exceeded' message when TTL hits zero, revealing the path hop by hop.",
    deepExplanation:
      "Blocking ICMP entirely (a common but debated security practice) can break useful diagnostics AND Path MTU Discovery, which specifically depends on ICMP 'fragmentation needed' messages — an example of a security measure having a real functional cost.",
    realWorldRelevance:
      "'Why does traceroute show some hops as timing out but the connection still works fine' is a common confusion resolved by knowing that intermediate routers can simply choose not to respond to ICMP without it affecting actual data forwarding.",
    keywords: ["ping", "traceroute", "TTL"],
    commonMistakes: ["Thinking ICMP carries application data like TCP/UDP"],
    relatedTopics: ["Routing Algorithms", "Network Security Fundamentals"],
    followUpQuestions: ["How does traceroute actually work using TTL?", "Why might blocking ICMP cause other problems?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style"],
  },
  {
    id: "cn-top40-34",
    rank: 34,
    question: "What is BGP, and why is it important for the internet?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "BGP (Border Gateway Protocol) is the path-vector routing protocol that governs how autonomous systems (large networks, like ISPs) exchange routing information and determine paths between each other — it's effectively the routing protocol that holds the global internet together.",
    detailedAnswer:
      "Unlike internal routing protocols (OSPF, RIP) used within one organization's network, BGP operates between organizations, making policy-based routing decisions (not just shortest-path) based on business relationships, cost, and configured preferences between autonomous systems.",
    deepExplanation:
      "BGP's trust-based design (routers largely trust announcements from peers) is exactly why BGP hijacking — an AS falsely announcing routes it doesn't actually own — is a real, periodically newsworthy internet security issue, since BGP wasn't originally designed with strong authentication.",
    realWorldRelevance:
      "Major internet outages are sometimes caused by BGP misconfigurations (a bad route announcement propagating globally) rather than actual infrastructure failure — a famous real-world failure mode directly tied to this protocol.",
    keywords: ["autonomous system", "path-vector protocol", "BGP hijacking"],
    commonMistakes: ["Confusing BGP with internal routing protocols like OSPF"],
    relatedTopics: ["Routing Algorithms"],
    followUpQuestions: ["What is BGP hijacking and why is it possible?", "How does BGP differ from OSPF in what it optimizes for?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style"],
  },
  {
    id: "cn-top40-35",
    rank: 35,
    question: "What is the difference between unicast, broadcast, and multicast?",
    difficulty: "Easy",
    frequency: "Medium",
    shortAnswer:
      "Unicast is one sender to one specific receiver; broadcast is one sender to every device on the local network; multicast is one sender to a specific interested group of receivers (who've opted in), without reaching everyone.",
    detailedAnswer:
      "Most everyday internet traffic (loading a webpage) is unicast; DHCP discovery and ARP requests use broadcast within a local network; multicast is used for things like streaming the same live video efficiently to many subscribed viewers without duplicating the stream per viewer or blasting it to everyone.",
    deepExplanation:
      "Multicast requires specific network support (multicast routing, IGMP for group membership) and isn't universally deployed across the public internet the way unicast is, which is why most consumer streaming services actually use unicast (via CDN edge servers) rather than true network-level multicast despite multicast being theoretically more efficient for that use case.",
    realWorldRelevance:
      "IPTV and some enterprise video conferencing systems on controlled internal networks do use real multicast, but public internet streaming (Netflix, YouTube) relies on CDN-based unicast distribution instead due to multicast's limited internet-wide deployment.",
    keywords: ["one-to-one", "one-to-all", "one-to-group"],
    commonMistakes: ["Confusing multicast with broadcast"],
    relatedTopics: ["Switching Techniques", "Routing Algorithms"],
    followUpQuestions: ["Why isn't multicast widely used for public internet video streaming?", "What is IGMP?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Microsoft-style"],
  },
  {
    id: "cn-top40-36",
    rank: 36,
    question: "How would you debug a situation where a service is reachable via ping but a specific application (e.g. a web server) isn't responding?",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "Ping only confirms Network-layer (ICMP) reachability — I'd check whether the specific port is open and the application is actually listening (telnet/nc/curl to that port), then check application logs, then check anything in between (firewall rules, security groups, load balancer health checks) that might allow ICMP but block the actual application port.",
    detailedAnswer:
      "This is a classic layer-by-layer debugging exercise: confirm L3 reachability (ping succeeded, so this layer's fine) → check L4 (is the port open and accepting connections? `telnet host port` or `nc -zv host port`) → check L7 (if the port's open but the app doesn't respond correctly, check application logs, is the process actually running, is it crashing, is it overloaded).",
    deepExplanation:
      "A very common real cause: a security group/firewall allows ICMP (ping) but not the specific TCP port the application uses — since these are configured as entirely separate rules, one being open doesn't imply the other is.",
    realWorldRelevance:
      "This exact scenario ('I can ping it but can't connect') is one of the most common real production networking debugging tickets, and walking through the layers methodically (rather than guessing) is exactly the skill being tested.",
    keywords: ["layer-by-layer debugging", "telnet/nc", "security groups"],
    commonMistakes: ["Assuming ping success means the whole network path/application is healthy"],
    relatedTopics: ["Sockets & Client-Server Communication", "Network Security Fundamentals"],
    followUpQuestions: ["What tools would you use to check if a specific port is open remotely?", "What's a common misconfiguration that causes exactly this symptom?"],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Uber-style", "Google-style"],
  },
  {
    id: "cn-top40-37",
    rank: 37,
    question: "What is QoS (Quality of Service) in networking?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "QoS refers to techniques that prioritize certain network traffic over others (e.g. voice/video over bulk downloads) to guarantee acceptable performance for latency/jitter-sensitive applications when a network is congested.",
    detailedAnswer:
      "Mechanisms include traffic classification and marking (e.g. DSCP tagging), prioritized queuing (sending marked high-priority packets first), and bandwidth reservation/shaping to prevent any single traffic type from starving others.",
    deepExplanation:
      "QoS is more straightforward to implement on networks you fully control (enterprise LANs) than across the public internet, where you generally can't dictate how third-party ISPs prioritize your packets — which is why applications also build in their own adaptive resilience (like adaptive bitrate streaming) rather than relying purely on network QoS.",
    realWorldRelevance:
      "Enterprise VoIP deployments commonly configure QoS on internal network equipment specifically to keep call quality high even when the network is simultaneously handling heavy file transfer traffic.",
    keywords: ["DSCP", "traffic prioritization", "bandwidth shaping"],
    commonMistakes: ["Assuming QoS can be guaranteed across the public internet the same way as on a private network"],
    relatedTopics: ["Congestion & Flow Control", "TCP vs UDP"],
    followUpQuestions: ["Why is QoS harder to guarantee across the public internet than on a LAN?", "What is adaptive bitrate streaming and how does it relate to this?"],
    tags: ["Advanced"],
    companyStyleTags: ["Uber-style"],
  },
  {
    id: "cn-top40-38",
    rank: 38,
    question: "What is the difference between a stateful and stateless protocol? Is HTTP stateful or stateless?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "A stateless protocol treats each request independently with no memory of prior requests; a stateful protocol maintains context across a sequence of interactions. HTTP itself is stateless — each request is independent — but applications commonly layer state on top using cookies, sessions, or tokens.",
    detailedAnswer:
      "This is exactly why login sessions need a mechanism like a session cookie or JWT: the server has no native memory that you already authenticated on a previous request, so the client must resend some form of identity/session proof with every request.",
    deepExplanation:
      "Statelessness is actually a deliberate architectural strength for scalability — any server in a pool can handle any request without needing shared session state, which is foundational to RESTful API design and horizontal scaling.",
    realWorldRelevance:
      "Sticky sessions (routing a client's requests to the same backend server) are sometimes used as a workaround when an application wasn't designed to be stateless, but this trades away some of the scalability benefits stateless design provides.",
    keywords: ["stateless HTTP", "session/cookie/token", "REST"],
    commonMistakes: ["Saying HTTP is stateful because 'websites remember you're logged in' (that's session state layered ON TOP of stateless HTTP)"],
    relatedTopics: ["HTTP & HTTPS", "Sockets & Client-Server Communication"],
    followUpQuestions: ["How does a session cookie work if HTTP itself has no memory?", "Why is statelessness considered good for scalability?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Startup-style"],
  },
  {
    id: "cn-top40-39",
    rank: 39,
    question: "What is packet loss, and how do applications typically handle it?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Packet loss happens when packets fail to reach their destination (congestion, faulty hardware, wireless interference). TCP handles it via automatic retransmission (using sequence numbers/ACKs); UDP does nothing automatically, leaving loss handling up to the application if it matters for that use case.",
    detailedAnswer:
      "For UDP-based real-time applications (voice/video), applications often tolerate small amounts of loss (a brief glitch) rather than retransmitting, since a late packet is often worse than a missing one for real-time playback — some use forward error correction (sending redundant data) to reconstruct lost packets without needing a retransmission round-trip.",
    deepExplanation:
      "Distinguishing 'loss that must be recovered' (TCP's approach, always retransmit) from 'loss that can be tolerated or proactively protected against' (UDP real-time apps, forward error correction or simple graceful degradation) is exactly the kind of nuanced trade-off understanding interviewers probe for here.",
    realWorldRelevance:
      "Video call quality dynamically adapting (dropping resolution, occasional glitches) under poor network conditions is a direct, visible consequence of an application choosing to tolerate packet loss rather than pay the latency cost of TCP-style retransmission.",
    keywords: ["retransmission", "forward error correction", "graceful degradation"],
    commonMistakes: ["Assuming all applications need lossless delivery"],
    relatedTopics: ["TCP vs UDP", "Congestion & Flow Control"],
    followUpQuestions: ["What is forward error correction and how does it avoid needing a retransmission round-trip?", "Why might a video call app deliberately not use TCP?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Uber-style", "Google-style"],
  },
  {
    id: "cn-top40-40",
    rank: 40,
    question: "Design consideration: you're building a chat application. Would you use TCP or UDP, WebSockets or plain HTTP polling? Justify your choices.",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "TCP (via WebSockets) — chat messages must be reliably delivered and in order (unlike video/voice where a glitch is tolerable), and WebSockets let the server push new messages instantly without the client repeatedly polling, which matters for both latency and server load at scale.",
    detailedAnswer:
      "UDP would risk silently losing messages, which is unacceptable for a chat log; plain HTTP polling would work but wastes resources (constant requests even when nothing's new) and adds latency (message delay depends on poll interval) — WebSockets solve both by keeping one persistent connection open and pushing messages the instant they arrive.",
    deepExplanation:
      "At scale, this decision has real infrastructure implications: WebSocket connections are long-lived and stateful per-server, which complicates horizontal scaling and load balancing (you generally need sticky routing or a shared pub/sub backend like Redis to fan out messages across server instances) compared to stateless HTTP polling's trivial scaling — a strong answer acknowledges this trade-off, not just picks WebSockets and stops.",
    realWorldRelevance:
      "Production chat systems (Slack, Discord) use persistent WebSocket-style connections precisely for this reason, backed by a pub/sub or message-queue layer specifically to solve the multi-server fan-out problem that stateful long-lived connections introduce.",
    keywords: ["reliability requirement", "WebSockets vs polling", "horizontal scaling of stateful connections"],
    commonMistakes: [
      "Picking WebSockets without acknowledging the scaling complexity trade-off",
      "Suggesting UDP for a use case that fundamentally requires reliable, ordered delivery",
    ],
    relatedTopics: ["TCP vs UDP", "Sockets & Client-Server Communication", "HTTP & HTTPS"],
    followUpQuestions: [
      "How would you scale WebSocket connections across multiple backend servers?",
      "What would you use for message delivery guarantees if a client briefly disconnects?",
    ],
    tags: ["Advanced"],
    companyStyleTags: ["Uber-style", "Startup-style", "Amazon-style"],
  },
];

export default networksTop40;
