// src/content/cs-fundamentals/networks/articles/ipAddressingSubnetting.ts

import type { Article } from "@/types";

const ipAddressingSubnettingArticle: Article = {
  slug: "ip-addressing-subnetting",
  title: "IP Addressing & Subnetting",
  summary:
    "IP addresses uniquely identify devices on a network; subnetting carves a large address block into smaller, efficiently-sized networks using a subnet mask or CIDR prefix.",
  readingTimeMins: 11,
  beginnerExplanation:
    "An IP address is like a postal address for a device on a network — it lets packets find their way to the right destination. IPv4 addresses are 32 bits long, written as four decimal numbers 0-255 separated by dots (e.g. 192.168.1.10), called dotted-decimal notation. Every IP address has two conceptual parts: a network portion (which network the device is on) and a host portion (which specific device within that network) — similar to how a postal address has a street/city part and a house-number part.\n\nSubnetting is the process of borrowing bits from the host portion to create smaller sub-networks (subnets) out of one larger network block. This is done for organization (separate departments/floors onto their own subnets), security (isolate traffic between subnets with firewalls), and efficiency (don't waste hundreds of addresses on a subnet that only needs 10). A subnet mask (or its shorthand, CIDR notation like /24) tells you exactly where the network portion ends and the host portion begins.",
  detailedBreakdown:
    "An IPv4 address is 32 bits, and address classes were historically used to size networks: Class A (first bit 0, range 1.0.0.0-126.255.255.255, default mask /8, 16.7M hosts), Class B (first two bits 10, range 128.0.0.0-191.255.255.255, default mask /16, 65,534 hosts), Class C (first three bits 110, range 192.0.0.0-223.255.255.255, default mask /24, 254 hosts), Class D (multicast, 224.0.0.0-239.255.255.255), and Class E (reserved/experimental, 240.0.0.0-255.255.255.255). Classful addressing is obsolete in practice — modern networks use CIDR (Classless Inter-Domain Routing), which discards rigid class boundaries and lets any prefix length (/1 to /32) define the network/host split, which is far more address-efficient.\n\nA subnet mask is a 32-bit value with 1s marking the network+subnet portion and 0s marking the host portion — e.g. 255.255.255.0 (which is /24) means the first 24 bits are network, the last 8 are host. CIDR notation writes this as a slash followed by the number of network bits, e.g. 192.168.1.0/24. To subnet, you borrow bits from the host portion: going from /24 to /26 borrows 2 bits, turning one 256-address block into four 64-address blocks (2^2 = 4 subnets), each with 64 - 2 = 62 usable host addresses (the first address in each block is the network address, the last is the broadcast address, and neither is assignable to a host).\n\nThe core subnetting formulas: number of subnets created by borrowing n bits = 2^n; number of addresses per subnet = 2^h where h is remaining host bits; usable hosts per subnet = 2^h - 2 (subtracting the network and broadcast addresses). The 'magic number' / block-size trick for quick mental math: block size = 256 - (the octet value of the mask in the interesting octet). E.g. for /26, the mask's 4th octet is 192, so block size = 256 - 192 = 64, meaning subnets fall on boundaries 0, 64, 128, 192.\n\nPrivate (RFC 1918) address ranges are reserved for internal networks and never routed on the public internet: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. These require Network Address Translation (NAT) at a router/gateway to communicate with the public internet, which is also how most home and corporate networks share one public IP among many internal devices. Other reserved ranges: 127.0.0.0/8 is loopback (127.0.0.1 = localhost), 169.254.0.0/16 is APIPA/link-local (auto-assigned when DHCP fails), and 0.0.0.0 represents 'this network' or an unspecified address.\n\nVLSM (Variable Length Subnet Masking) extends subnetting by allowing different subnets within the same network to have different prefix lengths, sized to their actual host requirements rather than forcing every subnet to be the same size — e.g. a point-to-point WAN link needing only 2 addresses gets a /30 (4 addresses, 2 usable), while a department needing 100 hosts gets a /25 (128 addresses, 126 usable), all carved out of the same larger address block without waste. The reverse operation, combining multiple contiguous smaller blocks into one larger advertised route, is called route summarization/aggregation (e.g. supernetting two /24s into one /23) and is central to keeping internet routing tables small.\n\nIPv6, by contrast, uses 128-bit addresses written in 8 groups of 4 hex digits (e.g. 2001:0db8:85a3:0000:0000:8a2e:0370:7334), with the address space so vast (2^128) that address exhaustion is a non-issue and NAT is largely unnecessary — it was designed specifically to solve IPv4 exhaustion, which CIDR and NAT had only postponed.",
  realWorldExamples:
    "Your home router typically hands out addresses like 192.168.1.x (or 192.168.0.x) to your devices — that's the RFC 1918 private range /24, NATed to a single public IP by your ISP-facing WAN interface. A company with 4 departments might take a 172.16.0.0/22 block and subnet it into four /24s (172.16.0.0/24, 172.16.1.0/24, 172.16.2.0/24, 172.16.3.0/24), one per department, each isolated by VLANs and firewall rules. Cloud VPCs (AWS VPC, GCP VPC) require you to explicitly define a CIDR block (e.g. 10.0.0.0/16) at creation and then subnet it into smaller subnets per availability zone or tier (public/private) — getting this wrong (too small a block) is a common real production mistake since VPC CIDR ranges are difficult to expand later.",
  useCases: [
    "Segmenting a corporate network into department-based or floor-based subnets for organizational clarity and traffic isolation",
    "Sizing cloud VPC subnets to match actual workload scale (small /28 for a NAT gateway subnet, larger /20 for an application tier)",
    "Conserving address space with VLSM by giving point-to-point links tiny /30 subnets instead of wasting a full /24",
    "Route summarization to keep backbone routing tables small by advertising one aggregate prefix instead of many individual subnets",
  ],
  advantages: [
    "Efficient address utilization — CIDR/VLSM avoids the massive waste of rigid classful addressing (a Class C wastes addresses for a 10-host subnet needing only 14)",
    "Improves security and fault isolation by containing broadcast domains and enabling per-subnet firewall/ACL rules",
    "Reduces the size of routing tables through summarization, improving router performance and convergence time",
    "Enables logical, scalable network design that maps to organizational structure (per department, per environment, per availability zone)",
  ],
  disadvantages: [
    "Subnetting design mistakes (too small a block) are expensive to fix later, especially in cloud VPCs where CIDR ranges are hard to resize post-creation",
    "More subnets means more router/Layer-3 configuration complexity and more inter-subnet routing hops",
    "IPv4 private address exhaustion within very large organizations can still occur, forcing awkward re-addressing or heavier NAT layering",
    "Miscalculating usable host counts (forgetting to subtract network/broadcast addresses) is a very common real-world planning error",
  ],
  commonMisconceptions: [
    "\"A /24 has 256 usable host addresses\" — it has 256 total addresses but only 254 usable ones; the first is the network address and the last is the broadcast address.",
    "\"Class-based addressing (A/B/C) is still how modern networks are designed\" — real networks use CIDR, which ignores class boundaries entirely and picks whatever prefix length fits the actual need.",
    "\"Private IP addresses are 192.168.x.x specifically\" — the full RFC 1918 private space includes 10.0.0.0/8 and 172.16.0.0/12 too, not just 192.168.0.0/16.",
    "\"A larger subnet mask number (like /28) means a bigger network\" — it's the opposite: a higher prefix length means fewer host bits and therefore a smaller subnet.",
    "\"Subnetting and NAT are the same thing\" — subnetting divides an address space into smaller logical networks; NAT translates private addresses to public ones at a boundary router. They're unrelated mechanisms that are often used together.",
  ],
  interviewPerspective:
    "IP addressing and subnetting is one of the highest-frequency topics in both interviews and OAs because it's objectively verifiable — interviewers can hand you an IP+mask and watch you compute network address, broadcast address, and usable range live on a whiteboard. Practice doing this fast without a calculator: convert the mask to a block size (256 - last non-255/non-0 octet) and find the nearest subnet boundary below the given IP. Also expect conceptual questions like 'why does CIDR exist' (classful addressing wasted enormous address space) and 'what's VLSM good for' (sizing subnets to actual need instead of one-size-fits-all). A very common trap question: 'how many hosts can a /30 support' — the honest answer is 2 usable (4 total minus network/broadcast), which is exactly why /30s are the standard choice for point-to-point router links.",
  oaPerspective:
    "OA rounds love pure computation here: given an IP and a subnet mask or CIDR prefix, compute the network address, broadcast address, number of usable hosts, or number of subnets. The two formulas to have memorized cold are: usable hosts = 2^h - 2 (h = host bits) and number of subnets = 2^n (n = borrowed bits). Also expect 'which of these IPs are in the same subnet as X' questions, which test whether you can correctly AND the IP with the mask. Private IP range identification (is 172.20.5.5 private? yes, it's within 172.16.0.0/12) is another very common MCQ pattern — memorize all three RFC 1918 ranges exactly, not just the popular 192.168.x.x one.",
  keyTakeaways: [
    "An IPv4 address is 32 bits split into network and host portions, defined by a subnet mask or CIDR prefix (e.g. /24).",
    "Usable hosts per subnet = 2^h - 2; number of subnets from borrowing n bits = 2^n.",
    "The first address in a subnet is the network address, the last is the broadcast address — neither is assignable to a host.",
    "RFC 1918 private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 — none are routable on the public internet without NAT.",
    "VLSM sizes each subnet to its actual host requirement instead of forcing uniform subnet sizes, and CIDR/summarization keeps routing tables compact.",
  ],
  summaryClosing:
    "IP addressing and subnetting is the arithmetic backbone of every larger networking topic — you can't reason clearly about routing, NAT, or network security design without being fluent in computing subnet boundaries by hand. It's also one of the few CS-fundamentals topics where interviewers can objectively check your answer against a fixed correct number, so speed and accuracy here compound directly into interview performance.",
  relatedTopics: ["OSI & TCP/IP Models", "Routing Algorithms", "Switching Techniques", "TCP vs UDP"],
  furtherReading: [
    { label: "RFC 1918 — Address Allocation for Private Internets", note: "The authoritative source for the three private IP ranges." },
    { label: "RFC 4632 — Classless Inter-Domain Routing (CIDR)", note: "Explains why and how CIDR replaced classful addressing." },
  ],
};

export default ipAddressingSubnettingArticle;
