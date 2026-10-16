// src/content/cs-fundamentals/networks/articles/osiTcpIpModels.ts

import type { Article } from "@/types";

const osiTcpIpModelsArticle: Article = {
  slug: "osi-tcp-ip-models",
  title: "OSI & TCP/IP Models",
  summary:
    "Two layered reference models for how network communication is organized — OSI is the 7-layer teaching model, TCP/IP is the 4-layer model the real internet actually runs on.",
  readingTimeMins: 9,
  beginnerExplanation:
    "Imagine sending a letter through a company's internal mail system: you write the message, put it in an envelope, hand it to the mailroom, which puts it in a truck, which drives it to another building's mailroom, which delivers it to the recipient's desk. Each \"layer\" of that process only cares about its own job — you don't worry about which truck route was taken, and the truck driver doesn't read your letter. Networking works the same way: data is wrapped in layers of \"envelopes\" (headers) as it goes down the stack on the sending side, and unwrapped layer by layer as it comes up the stack on the receiving side.\n\nThe OSI (Open Systems Interconnection) model is a 7-layer conceptual framework — Physical, Data Link, Network, Transport, Session, Presentation, Application — that describes every possible responsibility a networked system might have. The TCP/IP model is a simpler, 4-layer model (Network Interface/Link, Internet, Transport, Application) that describes what the actual internet protocol suite implements. OSI is the textbook map; TCP/IP is the territory.",
  detailedBreakdown:
    "The OSI model's 7 layers, bottom to top, are: (1) Physical — raw bits over a medium (cables, radio signals, voltages); (2) Data Link — framing, MAC addressing, and error detection on a single local link (Ethernet, Wi-Fi/802.11, switches operate here); (3) Network — logical addressing and routing across multiple networks (IP, routers operate here); (4) Transport — end-to-end delivery, segmentation, reliability, flow/congestion control (TCP, UDP); (5) Session — establishing, managing, and tearing down sessions/dialogues between applications; (6) Presentation — data translation, encryption, compression (SSL/TLS is often mapped here, though in practice it straddles Transport and Application); (7) Application — the actual protocols user software talks (HTTP, FTP, SMTP, DNS). A widely used mnemonic, bottom to top, is 'Please Do Not Throw Sausage Pizza Away.'\n\nThe TCP/IP model, by contrast, has 4 layers because it was designed pragmatically to describe protocols that were already being built, not as an exhaustive taxonomy: (1) Network Interface/Link layer — combines OSI's Physical + Data Link; (2) Internet layer — maps to OSI's Network layer, home of IP, ICMP, ARP; (3) Transport layer — maps to OSI's Transport layer, home of TCP and UDP; (4) Application layer — combines OSI's Session + Presentation + Application into one layer, since in practice things like session management and encryption are handled inside application protocols (e.g. TLS inside HTTPS) rather than as separate universal layers.\n\nData travels down the sender's stack via encapsulation: the Application layer produces data, the Transport layer wraps it in a segment (adding a TCP/UDP header with port numbers), the Network/Internet layer wraps that in a packet (adding an IP header with source/destination IP addresses), and the Link layer wraps that in a frame (adding a MAC header and trailer with source/destination MAC addresses and a frame check sequence). At the receiver, each layer strips its own header and passes the payload up — this is decapsulation. Each layer only needs to understand its own header; it treats everything above it as opaque payload, which is what makes the layered design modular and lets, say, Ethernet be swapped for Wi-Fi without any Transport or Application layer code changing.\n\nA key nuance interviewers probe: OSI is protocol-independent and was designed as a governance/reference standard (by ISO) before most of its protocols existed in practice — few real systems implement OSI layer-for-layer (X.25 being a rare historical exception). TCP/IP was designed after the protocols (ARPANET-era) already worked, describing what was built rather than prescribing an ideal. This is why OSI is taught for conceptual clarity and TCP/IP is what you diagnose real traffic against.",
  realWorldExamples:
    "When your laptop loads a website: the browser (Application layer) creates an HTTP request, the OS Transport layer wraps it in a TCP segment with a source port (random, e.g. 51000+) and destination port 443, the Internet layer wraps that in an IP packet addressed to the server's IP, and your Wi-Fi adapter's Link layer wraps that in an 802.11 frame with your NIC's MAC address as source and your router's MAC as the immediate destination (not the server's MAC — that only matters for the next hop). Wireshark, the most common packet-capture tool, displays captured traffic exactly in these nested layers — you can literally expand a captured packet and see the Ethernet frame containing the IP packet containing the TCP segment containing the HTTP request, which is the encapsulation model made visible.",
  useCases: [
    "OSI model: used as a shared vocabulary for troubleshooting ('is this a Layer 2 switching issue or a Layer 3 routing issue?') and for teaching/certifying networking concepts (CCNA, CompTIA Network+)",
    "TCP/IP model: the actual protocol suite implemented by every device connected to the internet — routers, switches, OSes, and applications all build on it",
    "Layered troubleshooting: isolating whether a fault is physical (cable unplugged), link (switch port down), network (bad routing), transport (port blocked by firewall), or application (server returning 500 errors)",
  ],
  advantages: [
    "Layering enables independent evolution — Ethernet can be replaced by Wi-Fi or fiber without touching IP, TCP, or application code",
    "Standardized layer boundaries let vendors build interoperable hardware/software (a Cisco switch and a Netgear router both speak Ethernet and IP the same way)",
    "Simplifies troubleshooting and reasoning by letting engineers isolate a fault to one layer at a time (the classic 'Layer 1 to Layer 7' checklist)",
  ],
  disadvantages: [
    "OSI's 7 layers are partly redundant/over-specified for real systems — Session and Presentation rarely exist as distinct implementation layers in practice",
    "Strict layering has a performance cost: each layer adds header overhead and processing, which is why some high-performance systems (e.g. kernel bypass networking, RDMA) deliberately violate layer boundaries",
    "TCP/IP's 4-layer model is less precise for teaching, since it hides distinctions (like framing vs. physical signaling) that matter when debugging hardware-level issues",
  ],
  commonMisconceptions: [
    "\"The real internet runs on the OSI model\" — it runs on TCP/IP; OSI is a reference/teaching model that most real systems don't implement layer-for-layer.",
    "\"Presentation and Session layers exist as separate protocols you can point to\" — in the TCP/IP suite, their responsibilities (encryption, session handling) are folded into application protocols like TLS/HTTP, not standalone layers.",
    "\"A switch and a router do the same job at different speeds\" — they operate at fundamentally different layers: switches forward frames using MAC addresses (Layer 2), routers forward packets using IP addresses (Layer 3).",
    "\"Layer numbers are just internet trivia\" — saying 'Layer 3 issue' vs 'Layer 7 issue' is genuine working vocabulary among network engineers for scoping an outage.",
  ],
  interviewPerspective:
    "This topic is a near-guaranteed opener in any networking-flavored interview because it establishes whether you have structural understanding or just protocol trivia. Be ready to list both models' layers in order (bottom-up), explain why TCP/IP has 4 layers while OSI has 7 (collapsed layers, not missing ones), and map real protocols to layers (HTTP→Application, TCP/UDP→Transport, IP→Network/Internet, Ethernet→Data Link/Link). A very common follow-up: 'at which layer does a router operate, and why not a switch?' Also expect 'what layer does a firewall operate at?' — the honest answer is 'it depends on the firewall type' (packet-filtering firewalls: Layer 3/4; application/proxy firewalls: Layer 7), which signals nuanced understanding.",
  oaPerspective:
    "OA MCQs test rote layer-order recall and protocol-to-layer mapping very heavily — expect direct questions like 'which layer does IP belong to?' or 'arrange these layers top to bottom.' A mnemonic is genuinely useful for speed here: 'Please Do Not Throw Sausage Pizza Away' walks OSI bottom-to-top — Physical, Data Link, Network, Transport, Session, Presentation, Application. Also expect questions distinguishing which OSI layers get merged into which TCP/IP layer, and device-to-layer mapping (hub=Physical, switch=Data Link, router=Network).",
  keyTakeaways: [
    "OSI has 7 layers (Physical, Data Link, Network, Transport, Session, Presentation, Application); TCP/IP has 4 (Link, Internet, Transport, Application).",
    "TCP/IP's Application layer absorbs OSI's Session + Presentation + Application layers.",
    "Encapsulation adds a header at each layer going down the sender's stack (segment → packet → frame); decapsulation strips them going up the receiver's stack.",
    "Switches operate at Layer 2 (MAC addresses); routers operate at Layer 3 (IP addresses) — a frequent interview distinction.",
    "OSI is a conceptual/teaching reference; TCP/IP is what real internet infrastructure actually implements.",
  ],
  summaryClosing:
    "OSI and TCP/IP aren't competing technologies — one is a vocabulary for reasoning about networking (OSI), the other is the actual specification the internet runs on (TCP/IP). Fluency in mapping real protocols and devices onto both models is the foundation every other networking topic (IP addressing, routing, TCP/UDP) builds on.",
  relatedTopics: ["IP Addressing & Subnetting", "TCP vs UDP", "Switching Techniques", "Routing Algorithms"],
  furtherReading: [
    { label: "RFC 1122 — Requirements for Internet Hosts", note: "The closest thing to an authoritative spec for how the TCP/IP layers should behave." },
    { label: "Wireshark packet capture walkthroughs", note: "Seeing real encapsulated packets makes the layer model concrete instead of abstract." },
  ],
};

export default osiTcpIpModelsArticle;
