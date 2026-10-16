// src/content/cs-fundamentals/networks/interview/dns.interview.ts

import type { InterviewQuestion } from "@/types";

const dnsInterviewQuestions: InterviewQuestion[] = [
  {
    id: "dns-iv-1",
    question: "Walk me through what happens, step by step, when you type a URL into a browser and it needs to resolve the domain name.",
    difficulty: "Easy",
    detailedAnswer:
      "The browser first checks its own DNS cache; if empty, it asks the OS to check its cache/hosts file. If still unresolved, the OS forwards the query to a configured recursive resolver (often the ISP's or a public one like 8.8.8.8). That resolver checks its own cache, and if it's a miss, performs the actual hierarchy walk: it queries a root server, which doesn't know the final answer but refers it to the correct TLD server (e.g., for .com); the TLD server refers it to the domain's authoritative name server; the authoritative server returns the actual record (e.g., an A record with the IP). The resolver caches the answer according to its TTL and returns it to the OS, which returns it to the browser, which then opens a TCP connection to that IP.",
    idealAnswer:
      "I'd walk through the caching layers first since that's what actually happens most of the time: browser cache, then OS cache. If both miss, it goes to a recursive resolver, which does the real work — root server tells it which TLD server to ask, the TLD server tells it which authoritative server to ask, and that authoritative server finally hands back the actual IP. The resolver caches that answer for as long as the TTL says, then returns it up the chain to the browser, which can now actually open a TCP connection to that IP and start the HTTP request.",
    interviewerExpectations: [
      "Correct ordering of cache layers before resolver involvement",
      "Correctly names root -> TLD -> authoritative as the hierarchy walk",
      "Mentions caching and TTL as part of the answer",
    ],
    followUpQuestions: [
      "What's the difference between a recursive resolver and an authoritative server?",
      "What happens after DNS resolves — what's the very next network step?",
      "Where would a CDN's GeoDNS logic actually intervene in this flow?",
    ],
    commonMistakes: [
      "Skipping the local caching layers and jumping straight to root servers",
      "Confusing recursive resolver with authoritative server",
    ],
    discussionPoints: ["Cache hierarchy", "Root/TLD/authoritative delegation", "TTL-driven caching"],
  },
  {
    id: "dns-iv-2",
    question: "What's the difference between an A record, a CNAME record, and an MX record?",
    difficulty: "Easy",
    detailedAnswer:
      "An A record maps a hostname directly to an IPv4 address (AAAA does the same for IPv6). A CNAME record aliases one hostname to another hostname rather than to an IP directly — the target name then gets resolved through its own separate lookup, which is useful when the underlying IP might change and you want indirection through a stable name (common for pointing www.example.com at a CDN-provided hostname). An MX record specifies which mail server(s) should receive email for a domain, each with a priority value so multiple mail servers can be tried in order.",
    idealAnswer:
      "A record: hostname straight to an IPv4 address. CNAME: hostname to another hostname — an alias, not a direct address — which is handy when you don't control or don't want to hardcode the underlying IP, like pointing your domain at a CDN's edge hostname. MX: tells the world which mail servers handle email for your domain, with priorities so there's a fallback order. They solve different problems even though they're all just 'DNS records.'",
    interviewerExpectations: [
      "Correctly distinguishes what each record type points to",
      "Explains CNAME as an alias-to-name, not alias-to-IP",
      "Knows MX is specifically for email routing with priority",
    ],
    followUpQuestions: [
      "Why can't a CNAME coexist with other records at the same name?",
      "What's the difference between A and AAAA?",
      "What would a TXT record commonly be used for?",
    ],
    commonMistakes: [
      "Saying CNAME points to an IP address directly",
      "Not knowing MX records carry a priority",
    ],
    discussionPoints: ["A vs AAAA", "CNAME aliasing", "MX priority"],
  },
  {
    id: "dns-iv-3",
    question: "How does DNS-based load balancing / GeoDNS work, and what are its limitations compared to a load balancer at the application layer?",
    difficulty: "Medium",
    detailedAnswer:
      "DNS-based load balancing works by having the authoritative server return different IP addresses for the same hostname depending on factors like the requester's approximate geographic location (inferred from their resolver's IP), current server health, or simple round-robin rotation — this is how CDNs route users to their nearest edge server. The key limitation is that DNS operates at the resolution layer, before any connection is made, and its decisions are cached client-side according to TTL — so it can't react to real-time conditions the way an application-layer load balancer can (which sees live connections and can redirect or fail over mid-session). A client that already cached an old IP will keep using a now-unhealthy server until its TTL expires, whereas a proper load balancer can instantly stop routing traffic to an unhealthy backend.",
    idealAnswer:
      "The authoritative DNS server just returns a different IP for the same hostname depending on who's asking and from where — that's how CDNs get you to the nearest edge node without any special client logic. The catch is TTL: once a client caches an answer, DNS has no way to un-cache it early, so if a server goes down, clients with a cached IP for it keep trying to reach it until the TTL expires. A real application-layer or L4 load balancer doesn't have that problem since it sits in the actual connection path and can react instantly and reroute failed connections in real time. So DNS load balancing is more of a coarse, first-hop routing decision, while a proper load balancer handles the fine-grained, real-time failover.",
    interviewerExpectations: [
      "Explains how GeoDNS returns different answers based on requester",
      "Identifies TTL/caching as the core limitation versus a real load balancer",
      "Can connect this to CDN architecture as a concrete example",
    ],
    followUpQuestions: [
      "How would you handle a sudden server failure if you're relying on DNS-based routing?",
      "What is anycast and how does it relate to (or improve on) this problem?",
      "How does health-check-aware DNS (like Route 53 health checks) try to mitigate the TTL problem?",
    ],
    commonMistakes: [
      "Describing GeoDNS without mentioning the TTL/caching limitation at all",
      "Confusing DNS-based routing with a full L4/L7 load balancer's capabilities",
    ],
    discussionPoints: ["GeoDNS", "TTL as a limiting factor", "Anycast", "CDN routing"],
  },
  {
    id: "dns-iv-4",
    question: "Production is down — users report the site is unreachable. How do you quickly determine whether this is a DNS problem versus an application or hosting problem?",
    difficulty: "Medium",
    detailedAnswer:
      "I'd start with `dig` or `nslookup` against the domain to see if it resolves at all, and compare the result against multiple resolvers (e.g., `dig @8.8.8.8 example.com` vs `dig @1.1.1.1 example.com`) to rule out a single resolver's cache being stale or poisoned. If it resolves to the expected IP, DNS is likely fine and the problem is downstream (server down, firewall, TLS, application error) — I'd then try connecting directly via `curl -v https://<resolved-ip>` with a Host header to bypass DNS entirely and confirm whether the server itself responds. If DNS returns no answer, an unexpected IP, or SERVFAIL, that points at a DNS-layer issue — could be an expired domain registration, a misconfigured record, an authoritative server outage, or (in rare cases) a DDoS on the DNS provider itself, like the 2016 Dyn attack that took down access to many sites whose actual servers were healthy.",
    idealAnswer:
      "First move is `dig`/`nslookup` on the domain from a couple of different resolvers to see if it even resolves, and to what IP. If the IP looks right and consistent everywhere, DNS is probably fine and I'd shift to checking the actual server — try hitting the resolved IP directly with curl and a Host header to bypass DNS entirely, which tells me if the problem is really at the app/hosting layer. If DNS comes back empty, SERVFAIL, or with an unexpected IP, that's my signal it's a DNS issue — could be the domain lapsed, a record got misconfigured, or the DNS provider itself is having an outage. Checking from multiple public resolvers also helps rule out one resolver just serving a stale cached answer.",
    interviewerExpectations: [
      "Names concrete diagnostic commands (dig, nslookup, curl with Host header/resolved IP)",
      "Describes a clear split test: does the name resolve correctly vs does the resolved server respond",
      "Mentions checking multiple resolvers to rule out stale/poisoned cache",
    ],
    followUpQuestions: [
      "What would a SERVFAIL response specifically tell you versus NXDOMAIN?",
      "How would you rule out a DNS cache poisoning attack versus a legitimate misconfiguration?",
      "If it turns out to be a DNS provider outage, what's your mitigation path?",
    ],
    commonMistakes: [
      "Not knowing any DNS diagnostic tooling by name",
      "Not separating 'does DNS resolve correctly' from 'does the server respond' as two distinct checks",
    ],
    discussionPoints: ["dig/nslookup diagnostics", "Bypassing DNS with Host header + resolved IP", "SERVFAIL vs NXDOMAIN", "DNS provider outages"],
    scenarioBased: true,
  },
  {
    id: "dns-iv-5",
    question: "What is DNS cache poisoning, and how do DNSSEC and encrypted DNS (DoH/DoT) address different parts of the problem?",
    difficulty: "Hard",
    detailedAnswer:
      "DNS cache poisoning is an attack where an attacker injects a forged DNS response into a resolver's cache, tricking it (and everyone who queries it afterward) into resolving a legitimate domain to a malicious IP — classically done by racing a forged UDP response to a query before the real authoritative server's answer arrives, exploiting the lack of authentication in plain DNS. DNSSEC addresses the authenticity/integrity half of the problem: it adds cryptographic signatures to DNS records so resolvers can verify a response genuinely came from the claimed authoritative source and wasn't tampered with — but critically, DNSSEC does not encrypt the query or response, so it doesn't stop eavesdropping. DNS-over-HTTPS (DoH) and DNS-over-TLS (DoT) address the confidentiality half instead: they encrypt the DNS query/response in transit (over HTTPS or TLS respectively) so an on-path observer (like an ISP or attacker on the same network) can't see or tamper with which domains you're resolving, but they don't inherently prove the authoritative server's data is authentic the way DNSSEC does. In practice, they're complementary rather than substitutes for each other.",
    idealAnswer:
      "Cache poisoning is when an attacker manages to slip a forged, malicious answer into a resolver's cache — for example, racing a fake UDP response to arrive before the legitimate authoritative server's real answer — so anyone using that resolver afterward gets sent to an attacker-controlled IP for a domain that should be legitimate. DNSSEC and DoH/DoT solve different halves of this: DNSSEC cryptographically signs records so a resolver can verify the answer really came from the authoritative source and wasn't tampered with, but the query itself is still sent in the clear. DoH and DoT instead encrypt the DNS traffic in transit, over HTTPS or TLS respectively, so nobody snooping on the network can see or mess with your queries — but that alone doesn't prove the authoritative data itself is legitimate. So DNSSEC is about authenticity of the data, and DoH/DoT are about confidentiality of the transport, and ideally you'd want both.",
    interviewerExpectations: [
      "Correctly explains the mechanism of cache poisoning",
      "Distinguishes DNSSEC (integrity/authenticity) from DoH/DoT (confidentiality/encryption)",
      "Recognizes these are complementary, not redundant, protections",
    ],
    followUpQuestions: [
      "Why doesn't DNSSEC alone prevent an eavesdropper from seeing which sites a user visits?",
      "What historical vulnerability (e.g., the Kaminsky attack) made DNS cache poisoning a well-known, practical threat?",
      "What tradeoffs come with adopting DoH from an enterprise network-monitoring perspective?",
    ],
    commonMistakes: [
      "Treating DNSSEC and DoH/DoT as solving the exact same problem",
      "Describing cache poisoning vaguely without explaining the actual injection/race mechanism",
    ],
    discussionPoints: ["Cache poisoning mechanics", "DNSSEC (authenticity)", "DoH/DoT (confidentiality)", "Complementary security layers"],
  },
];

export default dnsInterviewQuestions;
