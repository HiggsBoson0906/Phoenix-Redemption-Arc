// src/content/cs-fundamentals/networks/interview/networkSecurity.interview.ts

import type { InterviewQuestion } from "@/types";

const networkSecurityInterviewQuestions: InterviewQuestion[] = [
  {
    id: "network-security-iv-1",
    question: "What is the difference between symmetric and asymmetric encryption, and why do real systems like TLS use both?",
    difficulty: "Easy",
    detailedAnswer:
      "Symmetric encryption uses a single shared key for both encryption and decryption (e.g., AES) — it's computationally fast and well-suited to encrypting large amounts of data, but both parties need to already possess that same secret key, which creates a bootstrapping problem over an untrusted network. Asymmetric encryption uses a mathematically linked key pair — a public key that can be freely shared and used to encrypt data or verify signatures, and a private key kept secret that alone can decrypt or sign — solving the key-distribution problem, but at a significant computational cost compared to symmetric crypto. TLS uses asymmetric crypto briefly during the handshake specifically to safely establish a shared secret over an insecure channel, then switches to fast symmetric encryption for the actual bulk application data, combining the strengths of both.",
    idealAnswer:
      "Symmetric is one key that both encrypts and decrypts — fast, but you need a way to safely share that key first. Asymmetric uses a public/private key pair, so you can hand out the public key freely and only the private key can undo what it encrypts — that solves the sharing problem, but it's much slower computationally. TLS uses both because they're complementary: asymmetric crypto handles the tricky part of safely agreeing on a secret over a network an attacker might be watching, and once that's done, everything switches to fast symmetric encryption for the actual data, since you wouldn't want every byte of a video stream going through slow asymmetric operations.",
    interviewerExpectations: [
      "Correctly describes the shared-key vs key-pair mechanics",
      "States the trade-off (speed vs key-distribution problem)",
      "Connects it back to TLS's hybrid usage",
    ],
    followUpQuestions: [
      "Can you name a specific symmetric and a specific asymmetric algorithm?",
      "What happens to a private key if it's ever leaked?",
      "How does a digital signature use asymmetric crypto differently from encryption?",
    ],
    commonMistakes: [
      "Claiming one is 'strictly better' than the other rather than explaining the trade-off",
      "Not knowing that TLS uses both together rather than picking one",
    ],
    discussionPoints: ["Symmetric vs asymmetric trade-offs", "Key distribution problem", "TLS hybrid usage"],
  },
  {
    id: "network-security-iv-2",
    question: "What's the difference between a stateless (packet-filtering) firewall and a stateful firewall, and why do most modern firewalls use the stateful model?",
    difficulty: "Medium",
    detailedAnswer:
      "A stateless firewall evaluates each packet independently against static rules based on source/destination IP, port, and protocol — it has no memory of prior packets, so to allow a legitimate response to an outbound request, you'd need an explicit rule permitting that inbound traffic too, which is both cumbersome and less secure (that rule stays open even when no such connection exists). A stateful firewall tracks the state of active connections in a table, so once it sees a legitimate outbound connection initiated, it automatically permits the corresponding inbound return traffic for that specific connection, and rejects unsolicited inbound packets that don't correspond to any tracked connection. This gives much tighter default security (deny-by-default for anything not part of a known conversation) with less manual rule sprawl, which is why stateful inspection is the default model in essentially all modern firewalls and cloud security groups.",
    idealAnswer:
      "Stateless just looks at each packet in isolation against a rule list — source, destination, port, protocol — no memory at all. So if you want to allow responses to outbound requests, you'd have to write a separate rule for that inbound traffic, which is messy and leaves a wider door open than necessary. Stateful firewalls instead track active connections, so if a connection was legitimately initiated from inside, the return traffic for that specific connection gets through automatically, and anything else that doesn't match a tracked connection gets dropped by default. That's just a much safer default posture with way less manual rule maintenance, which is why basically every modern firewall — and things like AWS security groups — work this way.",
    interviewerExpectations: [
      "Correctly explains what 'state' means in this context (tracking connections)",
      "Explains the practical security/operational benefit of stateful over stateless",
      "Bonus: connects to a real example like cloud security groups",
    ],
    followUpQuestions: [
      "What is a connection tracking table and what happens when it fills up?",
      "How does a stateful firewall handle UDP, which has no formal connection concept?",
      "What's the difference between a firewall and a WAF?",
    ],
    commonMistakes: [
      "Not being able to explain what specifically is being 'tracked' in a stateful firewall",
      "Confusing firewall filtering with application-layer content inspection",
    ],
    discussionPoints: ["Connection state tracking", "Deny-by-default posture", "Cloud security groups as a real example"],
  },
  {
    id: "network-security-iv-3",
    question: "Describe how a DNS spoofing (cache poisoning) attack works, and how DNSSEC helps prevent it.",
    difficulty: "Medium",
    detailedAnswer:
      "Classic DNS is unauthenticated: when a resolver sends a query, it accepts the first response that appears to match (matching transaction ID and query, arriving from what looks like the right source), without any cryptographic proof the response actually came from the legitimate authoritative server. In a cache poisoning attack, an attacker races a forged response to the resolver before (or instead of) the real authoritative server's answer, and if the forged response is accepted and cached, every subsequent query for that domain from that resolver returns the attacker's malicious IP until the record expires — effectively redirecting an arbitrary number of victims to a malicious server even though they typed the correct domain name. DNSSEC prevents this by having authoritative servers cryptographically sign their DNS records with a private key; resolvers that support DNSSEC validation can verify that signature against a chain of trust rooted at the DNS root zone, and reject any response that isn't properly signed or whose signature doesn't validate — making it computationally infeasible for an attacker to forge a convincing response without possessing the actual private signing key.",
    idealAnswer:
      "Plain DNS doesn't authenticate its responses — a resolver just trusts whatever answer comes back that looks like it matches its query. So an attacker can try to race a fake response to the resolver before the real authoritative server's answer gets there, and if that forged answer gets cached, everyone using that resolver gets sent to the attacker's IP for that domain until the cache entry expires, even though they typed the right name. DNSSEC fixes this by having the real authoritative servers cryptographically sign their records, and a DNSSEC-validating resolver checks that signature against a chain of trust before accepting an answer — so a forged response without the real private key just fails validation and gets rejected.",
    interviewerExpectations: [
      "Correctly explains the lack of authentication in plain DNS as the root vulnerability",
      "Describes the forged-response/race mechanism clearly",
      "Explains DNSSEC's signature-based defense and chain of trust concept",
    ],
    followUpQuestions: [
      "Does DNSSEC encrypt DNS traffic? Why or why not?",
      "What is the Kaminsky attack and why was it significant historically?",
      "What are DoH and DoT, and how do they differ from DNSSEC's protection?",
    ],
    commonMistakes: [
      "Confusing DNSSEC (authenticity) with encryption (confidentiality)",
      "Not explaining why plain DNS is vulnerable in the first place (no authentication)",
    ],
    discussionPoints: ["Unauthenticated DNS", "Forged response race", "DNSSEC signature chain"],
  },
  {
    id: "network-security-iv-4",
    question: "Your service starts returning errors under a massive, sudden spike in traffic from thousands of distinct IP addresses, all hitting the same endpoint. How do you determine if this is a DDoS attack versus a legitimate traffic surge, and what would you do about it?",
    difficulty: "Hard",
    detailedAnswer:
      "First, gather evidence rather than assuming: look at request patterns — DDoS traffic often shows suspicious uniformity (identical or near-identical request signatures, unusual user-agent strings, requests hitting endpoints with no realistic legitimate reason to spike, or coming disproportionately from data-center IP ranges rather than typical consumer ISPs), whereas a legitimate surge (a viral post, a marketing campaign, a product launch) usually correlates with a known external trigger and shows more natural traffic diversity (varied user agents, realistic referrers, a mix of new and returning users). Checking whether the traffic correlates with an expected event (a link going viral on social media, an email campaign firing) versus no explainable cause is often the fastest signal. Once confirmed as an attack, mitigation includes: enabling upstream traffic scrubbing (Cloudflare, AWS Shield, or a similar DDoS protection service) that filters malicious traffic before it reaches origin servers, applying rate limiting per IP/API key at the edge, using CAPTCHA or challenge pages for suspicious clients, and leveraging anycast/CDN distribution so attack volume is spread across many points of presence rather than concentrated on one origin. If it's a legitimate surge instead, the fix is scaling capacity (autoscaling, caching, queueing) rather than blocking traffic.",
    idealAnswer:
      "I wouldn't assume it's an attack immediately — I'd look at the traffic pattern first. Is there a real external reason for a spike, like a marketing email or something going viral? Legitimate surges usually have a story behind them and show pretty normal traffic diversity — different user agents, realistic referrers. DDoS traffic tends to look suspiciously uniform — identical request signatures, weird or missing user agents, often coming from data-center IP ranges rather than normal consumer ISPs, and hitting an endpoint that has no reason to be popular right now. If it checks out as an attack, I'd lean on an upstream scrubbing service like Cloudflare or AWS Shield to filter it before it even reaches our servers, add rate limiting at the edge, and maybe throw a challenge page at suspicious clients. If it turns out to be legitimate demand instead, then the fix is completely different — that's a scaling problem, not a security problem, so I'd focus on autoscaling and caching instead of blocking anyone.",
    interviewerExpectations: [
      "Proposes concrete signals to distinguish attack traffic from legitimate surge (pattern uniformity, IP origin, correlated external cause)",
      "Names real mitigation tools/techniques (scrubbing services, rate limiting, CDN/anycast)",
      "Recognizes the response should differ completely depending on which it turns out to be",
    ],
    followUpQuestions: [
      "What's the difference between a volumetric DDoS attack and an application-layer (L7) DDoS attack?",
      "How would rate limiting alone be insufficient against a large, distributed botnet?",
      "How does anycast routing help absorb DDoS traffic geographically?",
    ],
    commonMistakes: [
      "Jumping straight to 'block all traffic' without first distinguishing attack from legitimate demand",
      "Not naming any concrete real-world mitigation tooling",
    ],
    discussionPoints: ["Attack vs legitimate surge signals", "Scrubbing services", "Rate limiting", "Anycast/CDN distribution"],
    scenarioBased: true,
  },
  {
    id: "network-security-iv-5",
    question: "How would you explain the security value of HTTPS to someone who says 'my site doesn't handle passwords or payments, so I don't need it'?",
    difficulty: "Medium",
    detailedAnswer:
      "Even without passwords or payments, plain HTTP exposes every page a visitor requests, every cookie, and the full response content to anyone on the network path — a coffee-shop Wi-Fi attacker, a compromised router, or an ISP can see exactly what content each visitor is reading, which has real privacy implications regardless of whether 'sensitive' data is involved. More concretely damaging: without HTTPS, there's no integrity guarantee, meaning an on-path attacker (or in some documented cases, ISPs themselves) can inject content into the page — ads, malicious scripts, cryptocurrency miners — since nothing prevents tampering with unencrypted traffic in transit. There's also a practical/reputational angle: browsers actively flag HTTP sites as 'Not Secure,' and search engines factor HTTPS into ranking, so skipping it costs credibility and visibility independent of the direct security argument. In short, HTTPS isn't only about protecting secrets typed into a form — it protects the integrity and privacy of the entire page for every visitor.",
    idealAnswer:
      "I'd push back gently on the framing — HTTPS isn't just about hiding a password. Without it, anyone on the network path between the visitor and the server, like someone on the same public Wi-Fi, can see exactly which pages someone's reading, and worse, can actually modify the content in transit, since there's no integrity check on plain HTTP — that's how some ISPs have historically injected their own ads into unencrypted pages. There's also a very practical cost: browsers mark HTTP sites as 'Not Secure' right in the address bar, and that alone hurts trust and search ranking regardless of what data the site handles. So I'd frame it less as 'do you have secrets to protect' and more as 'do you want to guarantee nobody can silently read or tamper with what your visitors see' — which is basically always yes.",
    interviewerExpectations: [
      "Goes beyond 'passwords need encryption' to explain confidentiality AND integrity value for all content",
      "Mentions concrete tampering/injection risk on plain HTTP, not just eavesdropping",
      "Optionally mentions the practical browser/SEO reputational angle",
    ],
    followUpQuestions: [
      "What specifically stops an attacker from injecting content into an HTTPS page in transit?",
      "Is HTTPS alone sufficient, or does the site still need other security measures?",
      "What's the cost/complexity argument someone might raise against adopting HTTPS, and how would you respond?",
    ],
    commonMistakes: [
      "Only talking about password/payment protection and missing the integrity/tampering argument",
      "Not being able to explain a concrete real-world consequence of skipping HTTPS",
    ],
    discussionPoints: ["Confidentiality vs integrity", "Content injection/tampering risk", "Browser trust indicators"],
  },
];

export default networkSecurityInterviewQuestions;
