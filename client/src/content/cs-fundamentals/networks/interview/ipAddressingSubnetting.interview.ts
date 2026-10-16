// src/content/cs-fundamentals/networks/interview/ipAddressingSubnetting.interview.ts

import type { InterviewQuestion } from "@/types";

const ipAddressingSubnettingInterviewQuestions: InterviewQuestion[] = [
  {
    id: "ip-addressing-subnetting-iv-1",
    question: "What is the difference between an IP address and a subnet mask, and how do they work together?",
    difficulty: "Easy",
    detailedAnswer:
      "An IP address is a 32-bit identifier for a specific device on a network. A subnet mask is also 32 bits, but it doesn't identify anything on its own — it's a template that tells you which bits of the IP address represent the network portion (1s in the mask) and which represent the host portion (0s in the mask). Performing a bitwise AND between the IP address and the subnet mask yields the network address, which is how a device or router determines whether a destination is on the local network or needs to be routed elsewhere.",
    idealAnswer:
      "The IP address says 'who you are,' and the subnet mask says 'how much of that address is your neighborhood versus your house number.' If I AND the IP with the mask, I get the network address — that's literally how a host decides 'is this destination on my local subnet, or do I need to send it to my default gateway instead?' Every routing decision at Layer 3 ultimately comes down to that AND operation.",
    interviewerExpectations: [
      "Understands the network/host split concept clearly",
      "Can explain the bitwise AND operation",
      "Connects this to practical routing decisions (same subnet vs. needs a gateway)",
    ],
    followUpQuestions: [
      "How would you compute the network address for 10.1.2.3/20 by hand?",
      "What's the difference between a subnet mask and a wildcard mask?",
      "Why do devices need to know if a destination is on the local subnet?",
    ],
    commonMistakes: [
      "Describing subnet mask as 'another type of IP address' rather than a bitmask template",
      "Not knowing the AND operation is how the network address is derived",
    ],
    discussionPoints: ["Network vs host portion", "Bitwise AND", "Local vs. routed delivery decision"],
  },
  {
    id: "ip-addressing-subnetting-iv-2",
    question: "Walk me through computing the network address, broadcast address, and usable host range for 192.168.10.130/27.",
    difficulty: "Medium",
    detailedAnswer:
      "A /27 mask is 255.255.255.224, leaving 5 host bits, so block size = 256 - 224 = 32. Subnet boundaries in the last octet fall at 0, 32, 64, 96, 128, 160, 192, 224. The address 192.168.10.130 falls between 128 and 160, so the network address is 192.168.10.128 and the broadcast address is 192.168.10.159 (one less than the next boundary, 160). The usable host range is 192.168.10.129 through 192.168.10.158 — 30 usable addresses (2^5 - 2 = 30).",
    idealAnswer:
      "First I convert /27 to a block size: 32 - 27 = 5 host bits, so 2^5 = 32 addresses per block, meaning subnets step by 32 in the last octet — 0, 32, 64, 96, 128, 160... 130 sits between 128 and 160, so 192.168.10.128 is my network address and 192.168.10.159 is my broadcast address, one below the next boundary. That leaves .129 through .158 as usable, which is 30 hosts, matching 2^5 - 2.",
    interviewerExpectations: [
      "Correctly derives block size = 32 from /27",
      "Correctly identifies network address 192.168.10.128 and broadcast 192.168.10.159",
      "Can do this without a calculator, showing the block-size shortcut",
    ],
    followUpQuestions: [
      "How would this change if the prefix were /28 instead?",
      "What's the fastest way to find a subnet boundary without listing every one?",
      "Why can't the network and broadcast addresses be assigned to a host?",
    ],
    commonMistakes: [
      "Off-by-one errors on the broadcast address (using 160 instead of 159)",
      "Forgetting to subtract 2 for usable hosts",
    ],
    discussionPoints: ["Block size shortcut", "Subnet boundary computation", "Usable host range"],
  },
  {
    id: "ip-addressing-subnetting-iv-3",
    question: "What is VLSM and why is it preferred over fixed-length subnetting in real network design?",
    difficulty: "Medium",
    detailedAnswer:
      "VLSM (Variable Length Subnet Masking) allows different subnets carved from the same address block to have different prefix lengths, sized according to actual host requirements, rather than forcing every subnet in a design to be the same fixed size. For example, from a single /24, you might allocate a /25 to a department needing 100 hosts, a /28 to a smaller team needing 10 hosts, and a /30 to a point-to-point router link needing only 2 addresses — all coexisting without overlap. Fixed-length subnetting, by contrast, would force every subnet to the same size as the largest requirement, wasting enormous numbers of addresses on small subnets (e.g. giving a 2-host point-to-point link a full /24 with 254 wasted addresses). VLSM is what makes efficient use of a limited IPv4 address block possible in real enterprise and ISP network design.",
    idealAnswer:
      "VLSM just means not every subnet has to be the same size — you carve each one to fit what it actually needs. Without it, if my biggest subnet needs a /24, every subnet in the design — even a router-to-router link that only needs 2 addresses — would also get a full /24, which is a massive waste. With VLSM I can give that link a /30, hand a small team a /28, and a big department a /23, all from the same parent block, which is exactly how real enterprise and ISP address plans are built.",
    interviewerExpectations: [
      "Clearly explains that VLSM allows mixed subnet sizes within one address block",
      "Gives a concrete example contrasting VLSM with wasteful fixed-size subnetting",
      "Connects this to real-world address conservation",
    ],
    followUpQuestions: [
      "Can you design a VLSM scheme for a network needing subnets of 100, 50, and 2 hosts from a /24?",
      "What's the relationship between VLSM and CIDR?",
      "Does VLSM apply to IPv6 the same way, or is it less necessary there?",
    ],
    commonMistakes: [
      "Confusing VLSM with plain subnetting (not recognizing the 'variable length' distinction)",
      "Not being able to give a concrete sizing example",
    ],
    discussionPoints: ["Address conservation", "Mixed subnet sizes", "Enterprise/ISP address planning"],
  },
  {
    id: "ip-addressing-subnetting-iv-4",
    question: "What are the RFC 1918 private IP address ranges, and why can't they be routed on the public internet?",
    difficulty: "Medium",
    detailedAnswer:
      "The three RFC 1918 private ranges are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. These ranges are reserved specifically for use inside private networks and are, by convention and by configuration on all public internet routers, never forwarded across the public internet — ISPs and backbone routers drop or filter traffic to/from these ranges rather than routing it globally. This is intentional: it lets any number of independent private networks reuse the exact same address ranges internally (every home router uses 192.168.1.x) without any global coordination or collision, and it's what NAT exists to bridge — translating a private address to a globally routable public one at the network's edge when internet access is needed.",
    idealAnswer:
      "They're 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. The reason they can't be routed publicly is as much a policy convention as a technical one — every internet backbone router is configured to never accept or forward routes for these ranges, precisely so that millions of independent private networks can all reuse the same address space internally without any coordination. That's only possible because NAT translates those private addresses to a single public one at the boundary — which is also why IPv4 hasn't fully collapsed under address exhaustion despite there being far more devices than public IPv4 addresses.",
    interviewerExpectations: [
      "Correctly names all three RFC 1918 ranges, not just 192.168.x.x",
      "Explains that non-routability is a convention enforced by internet routers, not an inherent property of the addresses",
      "Connects this to why NAT is necessary",
    ],
    followUpQuestions: [
      "What would happen if a private-range packet did somehow reach the public internet?",
      "How does NAT actually rewrite packet headers to make this work?",
      "How does this differ in an IPv6 world?",
    ],
    commonMistakes: [
      "Only naming 192.168.x.x and forgetting 10.0.0.0/8 and 172.16.0.0/12",
      "Saying private IPs are 'physically incapable' of routing rather than explaining it's a routing/filtering convention",
    ],
    discussionPoints: ["RFC 1918", "NAT", "Global address reuse"],
  },
  {
    id: "ip-addressing-subnetting-iv-5",
    question: "You're setting up a new AWS VPC for a service expected to scale to several thousand instances across 3 availability zones, with separate public and private subnet tiers. How would you plan the CIDR allocation, and what mistakes would you specifically avoid?",
    difficulty: "Hard",
    detailedAnswer:
      "I'd start with a VPC CIDR block large enough to comfortably outgrow initial estimates, since AWS VPC CIDR ranges are difficult to expand after creation (you can add secondary CIDR blocks, but it's operationally messier than sizing correctly upfront) — something like a /16 (65,536 addresses) rather than a /20 that looks 'big enough' today. Within that, I'd carve out subnets per availability zone and per tier: e.g. from 10.0.0.0/16, allocate 10.0.0.0/20 to AZ-a public, 10.0.16.0/20 to AZ-a private, and mirror that pattern for AZ-b and AZ-c, leaving large unused ranges reserved for future AZs or tiers rather than packing subnets edge-to-edge. Key mistakes to avoid: sizing the VPC CIDR too small initially (a classic real-world failure that forces a painful VPC peering/re-IP migration later), overlapping CIDR ranges with other VPCs you might later need to peer or connect via VPN/Transit Gateway (overlapping ranges make peering impossible without NAT gymnastics), and not reserving enough headroom in each subnet for AWS's reserved addresses (AWS reserves 5 addresses per subnet — network address, VPC router, DNS, future use, and broadcast — which matters more than people expect on small subnets).",
    idealAnswer:
      "I'd oversize the top-level VPC CIDR deliberately — something like a /16 — because resizing a VPC after the fact is painful, and the addresses are free to reserve even if unused. Then I'd lay out subnets per AZ and per tier with big gaps between them, not packed tightly, so I have room to add more AZs or tiers later without a re-architecture. The two mistakes I'd be most careful about: overlapping CIDR ranges with any VPC I might need to peer with later, since overlapping ranges make peering essentially impossible, and forgetting that AWS reserves 5 addresses per subnet, which can bite you on smaller subnets like /28s where that's a third of your total address space gone before you've placed a single instance.",
    interviewerExpectations: [
      "Thinks about future growth and headroom, not just current requirements",
      "Explicitly mentions the risk of overlapping CIDR ranges blocking future VPC peering",
      "Aware of AWS-specific reserved address behavior (5 reserved addresses per subnet)",
    ],
    followUpQuestions: [
      "How many usable addresses does AWS actually give you in a /28 subnet, accounting for its 5 reserved addresses?",
      "What would you do if you discovered two VPCs you now need to peer have overlapping CIDR ranges?",
      "How would you design this differently if the service needed to span multiple regions?",
    ],
    commonMistakes: [
      "Sizing the VPC CIDR too small because 'we don't need that many addresses right now'",
      "Ignoring the possibility of future VPC peering and creating overlapping ranges",
      "Forgetting cloud-provider-specific reserved address counts when sizing small subnets",
    ],
    discussionPoints: ["VPC CIDR planning", "Reserved addresses in cloud subnets", "VPC peering and overlap risk", "Growth headroom"],
    scenarioBased: true,
  },
];

export default ipAddressingSubnettingInterviewQuestions;
