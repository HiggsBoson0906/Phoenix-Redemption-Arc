// src/content/cs-fundamentals/networks/interview/osiTcpIpModels.interview.ts

import type { InterviewQuestion } from "@/types";

const osiTcpIpModelsInterviewQuestions: InterviewQuestion[] = [
  {
    id: "osi-tcp-ip-models-iv-1",
    question: "List the layers of the OSI model in order, and briefly describe each.",
    difficulty: "Easy",
    detailedAnswer:
      "Bottom to top: Physical (raw bit transmission over a medium — cables, radio), Data Link (framing, MAC addressing, local error detection — Ethernet/Wi-Fi), Network (logical IP addressing and routing across networks), Transport (end-to-end delivery, segmentation, reliability — TCP/UDP), Session (establishing/managing/tearing down communication sessions), Presentation (data translation, encryption, compression), and Application (the actual protocols applications speak — HTTP, FTP, DNS).",

    idealAnswer:
      "I'd list them bottom-up since that's how data is actually built up for transmission: Physical, Data Link, Network, Transport, Session, Presentation, Application. I use the mnemonic 'Please Do Not Throw Sausage Pizza Away' to keep the order straight, and I like to immediately anchor each layer to a real protocol or device — Ethernet at Data Link, IP at Network, TCP at Transport, HTTP at Application — because that's what actually gets asked as a follow-up.",
    interviewerExpectations: [
      "Correct order without hesitation",
      "Can name at least one real protocol/device per layer",
      "Doesn't confuse Session/Presentation responsibilities with Application",
    ],
    followUpQuestions: [
      "Which layers does TCP/IP merge compared to OSI?",
      "At which layer does a switch operate, and why?",
      "Where would you place TLS/SSL in this model?",
    ],
    commonMistakes: [
      "Getting the order wrong or skipping a layer",
      "Confusing Session layer with Transport layer responsibilities",
    ],
    discussionPoints: ["Layer responsibilities", "Protocol-to-layer mapping", "Mnemonics as a recall aid"],
  },
  {
    id: "osi-tcp-ip-models-iv-2",
    question: "Why does the TCP/IP model have only 4 layers while OSI has 7? Are functionalities missing?",
    difficulty: "Medium",
    detailedAnswer:
      "No functionality is missing — TCP/IP simply merges layers pragmatically. OSI's Physical and Data Link layers merge into TCP/IP's single Network Interface/Link layer, and OSI's Session, Presentation, and Application layers merge into TCP/IP's single Application layer. This reflects a philosophical difference: OSI was designed top-down by a standards committee (ISO) as an idealized, protocol-agnostic reference model before most of its protocols existed in deployed systems, while TCP/IP was designed bottom-up, describing protocols (IP, TCP, early application protocols) that were already running on ARPANET. Responsibilities like session management and encryption still exist in the TCP/IP world — they're just implemented inside application-level protocols (e.g. TLS handles both encryption and session-like handshaking within what OSI would call Presentation/Session) rather than as universal, separate layers.",
    idealAnswer:
      "The functionality isn't gone, it's consolidated. TCP/IP folds Physical+Data Link into one Link layer, and Session+Presentation+Application into one Application layer. The real story is that OSI is a prescriptive, vendor-neutral reference model built by committee, while TCP/IP is a descriptive model built around protocols that already worked in practice — so where OSI is precise about theoretical boundaries, TCP/IP just groups things the way real implementations actually split responsibilities, like TLS handling encryption and session setup together instead of as two separate universal layers.",
    interviewerExpectations: [
      "Understands this is consolidation, not omission",
      "Can explain the historical/philosophical distinction (prescriptive vs. descriptive)",
      "Gives a concrete example of where 'missing' layer responsibilities actually live (e.g. TLS)",
    ],
    followUpQuestions: [
      "Where does TLS fit if Presentation isn't a distinct layer in TCP/IP?",
      "Can you name a real protocol that implements OSI layer-for-layer?",
      "Why is TCP/IP the one that 'won' as the real internet standard?",
    ],
    commonMistakes: [
      "Claiming TCP/IP simply lacks Session/Presentation functionality",
      "Not knowing which specific OSI layers get merged into which TCP/IP layer",
    ],
    discussionPoints: ["Layer consolidation", "Prescriptive vs. descriptive model design", "TLS as a real-world example"],
  },
  {
    id: "osi-tcp-ip-models-iv-3",
    question: "What's the difference between how a switch and a router forward traffic, in terms of the OSI model?",
    difficulty: "Medium",
    detailedAnswer:
      "A switch operates at Layer 2 (Data Link): it learns which MAC address is reachable off which physical port (building a MAC address table) and forwards Ethernet frames based on destination MAC address, entirely within a single broadcast domain/LAN. A router operates at Layer 3 (Network): it inspects the destination IP address in a packet, consults a routing table, and forwards the packet toward the correct next hop, potentially across many different physical networks — this is what allows communication between different subnets/networks, which a switch alone cannot do. A practical consequence: switches don't need or use IP addresses to forward traffic (though a switch itself may have a management IP), while routing is fundamentally IP-address-driven.",
    idealAnswer:
      "A switch is a Layer 2 device — it forwards frames based on MAC addresses within a single LAN, learning the MAC-to-port mapping as traffic flows through it. A router is a Layer 3 device — it forwards packets based on IP addresses and routing table entries, and it's specifically what lets traffic cross from one network/subnet to another. So if two devices are on the same switch and same subnet, a switch alone gets them talking; the moment you need to go to a different subnet or out to the internet, you need a router making Layer 3 decisions.",
    interviewerExpectations: [
      "Correctly attributes MAC-based forwarding to switches (Layer 2) and IP-based forwarding to routers (Layer 3)",
      "Explains that routers enable inter-network communication, switches don't",
      "Doesn't conflate a switch's own management IP with its forwarding logic",
    ],
    followUpQuestions: [
      "What is a Layer 3 switch, and how does it differ from a traditional router?",
      "How does a switch build and use its MAC address table?",
      "What happens if a switch receives a frame for an unknown destination MAC?",
    ],
    commonMistakes: [
      "Saying routers and switches do 'the same thing but routers are smarter/faster'",
      "Forgetting that switches operate within a single broadcast domain",
    ],
    discussionPoints: ["MAC address table / switching", "Routing table / IP forwarding", "Broadcast domains vs. subnets"],
  },
  {
    id: "osi-tcp-ip-models-iv-4",
    question: "Explain encapsulation and decapsulation with a concrete example, such as loading a webpage.",
    difficulty: "Medium",
    detailedAnswer:
      "When a browser sends an HTTP GET request, the Application layer hands the raw HTTP request text to the Transport layer, which wraps it in a TCP segment (adding source port, e.g. 52341, and destination port 443, plus sequence numbers and flags). The Network/Internet layer wraps that segment in an IP packet, adding source and destination IP addresses. The Data Link/Link layer wraps that packet in an Ethernet frame, adding source and destination MAC addresses (the destination MAC being the next hop, e.g. the local router, not the final server) plus a frame check sequence for error detection. This nested wrapping — segment inside packet inside frame — is encapsulation. When the frame arrives at the destination, each layer strips its own header in reverse order (frame → packet → segment → raw data) and passes the remainder up — this is decapsulation, ending with the web server's HTTP layer reading the original GET request.",
    idealAnswer:
      "I'd walk through it top-down on the sending side: the browser hands HTTP text to Transport, which adds a TCP header (ports, sequence numbers) to make a segment; Network adds an IP header (source/destination IP) to make a packet; Link adds a MAC header and trailer to make a frame that actually goes out on the wire. On the receiving side it unwinds in reverse — strip the frame header to get the packet, strip the packet header to get the segment, strip the segment header to get the original HTTP request. The key insight is each layer only reads its own header and treats everything inside as an opaque blob, which is exactly what lets these layers evolve independently.",
    interviewerExpectations: [
      "Correctly orders the encapsulation as segment → packet → frame",
      "Understands each layer adds its own header, and decapsulation reverses it exactly",
      "Uses a concrete example rather than only abstract terms",
    ],
    followUpQuestions: [
      "What's inside a TCP header versus an IP header?",
      "Why is the destination MAC address the router's, not the final server's?",
      "What happens at each hop along the way — does encapsulation happen just once?",
    ],
    commonMistakes: [
      "Getting the encapsulation order backwards (e.g. saying IP wraps TCP wraps Ethernet)",
      "Thinking the same MAC address is used end-to-end across the whole path",
    ],
    discussionPoints: ["PDU naming per layer", "Header addition/removal", "Next-hop MAC vs. end-to-end IP addressing"],
  },
  {
    id: "osi-tcp-ip-models-iv-5",
    question: "A user reports that they can ping a server's IP address successfully, but their browser can't load the website hosted on it. Using the OSI/TCP-IP layer model, how would you narrow down where the problem is?",
    difficulty: "Hard",
    detailedAnswer:
      "A successful ping (ICMP) confirms connectivity through Layer 3 (Network/Internet) — IP routing between the client and server works, and the Physical/Data Link layers underneath it are also fine, since ICMP packets had to traverse them successfully. So the fault is above Layer 3. Next I'd check Layer 4 (Transport): use a tool like `telnet <ip> 443` or `curl -v` to see if a TCP connection on port 443 (or 80) even completes its three-way handshake — if it hangs or is refused, that points to a firewall blocking the port, or the web server process not listening on that port at all (check with `netstat -tlnp` or `ss -tlnp` on the server). If the TCP connection succeeds but the browser still fails, the issue is at Layer 7 (Application) — this could be a TLS/certificate handshake failure, the web server returning an error response, a DNS mismatch making the browser connect to the wrong virtual host, or an application-level bug. I'd check browser dev tools' Network tab and server access/error logs to pin down exactly which HTTP-level step fails.",
    idealAnswer:
      "Ping succeeding tells me Layers 1 through 3 are healthy — physical connectivity, framing, and IP routing all work. So I'd move up the stack: first test Layer 4 with something like `curl -v` or `telnet host 443` to see if the TCP handshake to the actual web port even completes. If that hangs, it's likely a firewall or security group blocking the port, or nothing listening there — I'd check with `ss -tlnp` on the server. If the TCP connection succeeds, the problem has to be Layer 7 — TLS certificate issues, wrong virtual host routing, or an application error — and I'd pull browser dev tools and server logs to see exactly where the HTTP request fails. The point of the layer model here isn't academic — it's literally how I decide which tool to reach for next instead of guessing.",
    interviewerExpectations: [
      "Uses the layer model as an actual diagnostic funnel, bottom-up from what's already confirmed working",
      "Names concrete tools/commands at each layer (ping, curl/telnet, ss/netstat, browser dev tools)",
      "Correctly reasons that ICMP success rules out Layers 1-3 but says nothing about Layer 4 or 7",
    ],
    followUpQuestions: [
      "Why doesn't a successful ping guarantee the web server is reachable on port 443?",
      "What would you check if the TCP handshake succeeds but the browser shows a certificate error?",
      "How would this diagnosis differ if the site uses a CDN or load balancer in front of the server?",
    ],
    commonMistakes: [
      "Assuming a successful ping means 'the network is fine' and jumping straight to blaming the application",
      "Not knowing which specific tool/command maps to testing each layer",
    ],
    discussionPoints: ["Layered troubleshooting methodology", "ICMP vs TCP vs HTTP as diagnostic signals", "Firewall/security group misconfiguration", "TLS handshake failures"],
    scenarioBased: true,
  },
];

export default osiTcpIpModelsInterviewQuestions;
