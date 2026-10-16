// src/content/cs-fundamentals/networks/articles/networkSecurity.ts

import type { Article } from "@/types";

const networkSecurityArticle: Article = {
  slug: "network-security",
  title: "Network Security Fundamentals",
  summary:
    "Network security is the set of tools and practices — firewalls, VPNs, encryption, and attack awareness — that keep traffic confidential, authentic, and available against eavesdroppers, impersonators, and disruptors.",
  readingTimeMins: 9,
  beginnerExplanation:
    "Think of a network like a building. A firewall is the security guard at the door, checking every packet against a rulebook and deciding what's allowed in or out based on source, destination, and port — it doesn't care about the packet's content, just whether it's allowed to pass. A VPN (Virtual Private Network) is like a private, armored tunnel dug from your location straight into a trusted network, so anything you send is invisible and untouchable to anyone standing between you and the destination — useful both for privacy on untrusted networks (like public Wi-Fi) and for securely reaching internal company resources from outside. Encryption is the lock-and-key system that keeps the contents of a message secret even if someone intercepts it in transit.\n\nAt the fundamentals level, network security is less about memorizing every attack and more about understanding the handful of core building blocks — access control (firewalls), tunneling/encryption (VPNs), and the two families of cryptography (symmetric and asymmetric) — that everything else is built from.",
  detailedBreakdown:
    "Firewalls filter traffic based on rules. A packet-filtering firewall inspects each packet's source/destination IP, port, and protocol against static rules ('allow inbound TCP on port 443, deny everything else') — fast but stateless, treating every packet independently. A stateful firewall tracks the state of active connections, so it can allow return traffic for a connection that was legitimately initiated outbound without needing a separate rule for it, and reject packets that don't belong to any known connection — this is what most modern firewalls (including cloud security groups) actually do. Application-layer (proxy/next-gen) firewalls go further, inspecting the actual content of traffic (e.g., a web application firewall inspecting HTTP requests for SQL injection patterns), trading more overhead for deeper protection.\n\nVPNs create an encrypted tunnel between two endpoints, commonly using protocols like IPsec or WireGuard/OpenVPN, so that traffic traveling across an untrusted network (the public internet, a hotel Wi-Fi) is wrapped in encryption end-to-end between the client and the VPN gateway. This serves two related but distinct purposes: site-to-site VPNs connect two trusted networks (e.g., a company's two offices) over the public internet as if they were on the same private network, while remote-access VPNs let an individual device securely join a private network from anywhere, commonly used so remote employees can reach internal-only services as if they were physically in the office.\n\nCryptography splits into two families with very different performance and use-case profiles. Symmetric encryption (AES being the dominant standard) uses the same single key to both encrypt and decrypt — it's fast and efficient, well-suited to encrypting large volumes of data, but requires both parties to already share that secret key, which creates a bootstrapping problem: how do you safely give someone a shared secret over a network an attacker might be watching? Asymmetric encryption (RSA, or elliptic-curve variants like ECDHE) uses a mathematically linked key pair — a public key anyone can have and use to encrypt data or verify a signature, and a private key kept secret that alone can decrypt that data or produce a valid signature. Asymmetric crypto solves the bootstrapping problem (you can safely publish your public key; only your private key can decrypt what was sent to it) but is computationally much slower than symmetric crypto. This is exactly why TLS/HTTPS uses asymmetric crypto briefly during the handshake to safely establish a shared secret, then switches to fast symmetric encryption for the actual bulk data — hybrid cryptography, not a choice between the two.\n\nCommon attacks worth knowing at a fundamentals level: a Man-in-the-Middle (MITM) attack is when an attacker secretly intercepts and potentially alters communication between two parties who believe they're talking directly to each other — HTTPS/TLS with proper certificate validation is the primary defense, since a MITM attacker can't produce a valid certificate for a domain they don't own. DNS spoofing (cache poisoning) tricks a DNS resolver into caching a forged record, redirecting victims to an attacker-controlled server even though they typed the correct domain — DNSSEC defends against this by cryptographically signing DNS responses. A DDoS (Distributed Denial of Service) attack floods a target with traffic from many distributed sources (often a botnet) to exhaust its bandwidth, connection capacity, or application resources, denying service to legitimate users — mitigated through traffic scrubbing services, rate limiting, and massively distributed infrastructure (like a CDN or anycast network) that can absorb volume no single origin server could.",
  realWorldExamples:
    "Corporate remote-access VPNs (like Cisco AnyConnect or WireGuard-based setups) are the standard way employees securely reach internal tools from home. Public Wi-Fi security advice ('use a VPN on airport/coffee-shop Wi-Fi') exists specifically because an unencrypted local network makes MITM attacks trivially easy for anyone else on that same network. Cloudflare and AWS Shield are commercial examples of DDoS mitigation at massive scale, absorbing and filtering attack traffic before it ever reaches a customer's actual servers. The 2016 Dyn DNS attack, a large-scale DDoS against a major DNS provider, illustrates how attacking network infrastructure (not the target application itself) can take down huge portions of the internet (Twitter, Spotify, Reddit, and more) simultaneously.",
  useCases: [
    "Restricting inbound/outbound traffic to only what's necessary (firewalls / cloud security groups)",
    "Securely connecting remote employees or branch offices to a private network over the public internet (VPNs)",
    "Protecting data confidentiality in transit and at rest (symmetric encryption for bulk data, asymmetric for key exchange/signatures)",
    "Detecting and absorbing volumetric attacks before they reach production infrastructure (DDoS mitigation)",
  ],
  advantages: [
    "Defense in depth: firewalls, encryption, and monitoring together cover different attack surfaces, so no single failure exposes everything",
    "Modern encryption (properly implemented) makes intercepted traffic practically useless to an attacker without the key",
    "Stateful firewalls and VPNs let organizations expose only the minimum necessary surface area to untrusted networks",
  ],
  disadvantages: [
    "Security controls add real operational complexity and latency (handshake round trips, VPN tunnel overhead, deep packet inspection cost)",
    "Firewalls and VPNs only protect what they're configured to protect — misconfiguration (an overly permissive rule, an unpatched VPN gateway) can undermine the whole control",
    "No network security measure defends against a compromised or malicious insider who already has legitimate access",
  ],
  commonMisconceptions: [
    "\"A firewall protects against all attacks\" — firewalls control network access based on rules; they don't inspect application logic, and can't stop attacks that ride on allowed traffic (like a malicious payload sent over an already-permitted HTTPS connection to a vulnerable app).",
    "\"VPNs make you anonymous\" — a VPN hides your traffic from your local network and ISP and shifts trust to the VPN provider, but it doesn't make you anonymous to the destination service if you log in with identifiable credentials.",
    "\"Asymmetric encryption is always better than symmetric because it's more secure\" — they solve different problems; asymmetric solves key distribution, symmetric is what actually encrypts bulk data efficiently. Real systems use both together.",
    "\"HTTPS alone prevents all MITM attacks\" — it prevents them when certificate validation works correctly; attacks like tricking users into accepting a fake certificate, or compromising a trusted CA, can still succeed.",
  ],
  interviewPerspective:
    "At the fundamentals/interview level (not a dedicated security role), interviewers expect a clear grasp of symmetric vs asymmetric trade-offs (speed vs key-distribution problem), what a firewall actually filters on (and stateless vs stateful), what a VPN provides (confidentiality and network-level access, not anonymity), and the ability to describe 2-3 common attacks (MITM, DNS spoofing, DDoS) along with their primary real-world defense. A frequent follow-up is connecting these concepts back to HTTPS: 'why does TLS use both symmetric and asymmetric crypto?' is a very common bridge question between the HTTP/HTTPS and network security topics.",
  oaPerspective:
    "OA MCQs test definitions and matching: symmetric vs asymmetric algorithm examples (AES is symmetric; RSA is asymmetric), what a stateful firewall does differently from a stateless one, which attack matches which description (MITM vs DDoS vs DNS spoofing), and the basic purpose of a VPN.",
  keyTakeaways: [
    "Firewalls filter traffic by rules; stateful firewalls track connection state, application-layer firewalls inspect content.",
    "VPNs create an encrypted tunnel over an untrusted network, providing confidentiality and private network access — not anonymity.",
    "Symmetric encryption (e.g., AES) is fast but requires a pre-shared key; asymmetric encryption (e.g., RSA) solves key distribution via public/private key pairs but is slower — real systems (like TLS) combine both.",
    "MITM attacks intercept communication between two parties; proper certificate validation in HTTPS is the primary defense.",
    "DDoS attacks flood a target with distributed traffic to exhaust its capacity; mitigated via scrubbing, rate limiting, and distributed infrastructure.",
  ],
  summaryClosing:
    "Network security fundamentals boil down to a small set of composable building blocks — controlling who can talk to what (firewalls), protecting data in transit (VPNs and encryption), and understanding how attackers exploit trust (MITM, DNS spoofing, DDoS) — and nearly every more advanced security topic you'll encounter is built by combining and hardening these same primitives.",
  relatedTopics: ["HTTP & HTTPS", "DNS", "Sockets & Client-Server Communication"],
  furtherReading: [
    { label: "OWASP Top 10", note: "The most common web application security risks, useful context beyond pure network-layer security." },
    { label: "\"Network Security Essentials\" by William Stallings", note: "A widely used foundational textbook covering cryptography and network security together." },
  ],
};

export default networkSecurityArticle;
