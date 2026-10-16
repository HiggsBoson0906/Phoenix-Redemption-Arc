// src/content/cs-fundamentals/networks/articles/dns.ts

import type { Article } from "@/types";

const dnsArticle: Article = {
  slug: "dns",
  title: "DNS",
  summary:
    "DNS (Domain Name System) is the internet's distributed directory service — it translates human-readable names like example.com into the IP addresses computers actually use to route traffic.",
  readingTimeMins: 8,
  beginnerExplanation:
    "DNS is essentially the internet's phonebook. Nobody wants to memorize an IP address like 142.250.190.14 to visit a website, so DNS lets you type example.com and quietly resolves it into the numeric address your computer needs to actually open a connection. What makes DNS remarkable is that it isn't one giant database sitting on one server — it's a massive, distributed, hierarchical system spread across millions of servers worldwide, each responsible for a small slice of the naming hierarchy, yet the whole thing resolves a typical lookup in milliseconds.\n\nEvery time you visit a new website, browse an app that hits an API, or send an email, DNS runs invisibly in the background, translating names to addresses before any actual data can be exchanged.",
  detailedBreakdown:
    "The DNS namespace is a hierarchy, read right to left: the root ('.', usually invisible), then a top-level domain (TLD) like .com, .org, or .in, then the second-level domain like example, then optional subdomains like www or api. Each level of this hierarchy is managed by different, delegated servers — the root servers know which servers handle .com, the .com TLD servers know which servers are authoritative for example.com, and example.com's own authoritative servers hold the actual records (like the IP address for www.example.com).\n\nA full resolution walks through several actors. When you type a URL, your OS/browser first checks its own local cache; if not found, it asks a configured recursive resolver (often your ISP's resolver, or a public one like Google's 8.8.8.8 or Cloudflare's 1.1.1.1). If the resolver doesn't have it cached, it performs the actual walk down the hierarchy on your behalf: it asks a root server, which doesn't know the answer but redirects it to the correct TLD server; the TLD server doesn't know the final answer either but redirects it to the domain's authoritative name server; that authoritative server finally returns the actual record (e.g., the IP address). The resolver caches this result (respecting its TTL) and hands the answer back to your browser, which also caches it locally. The standard lookup order is therefore: browser cache -> OS cache -> recursive resolver cache -> root server -> TLD server -> authoritative server.\n\nDNS records come in several standard types, each serving a distinct purpose: A records map a hostname to an IPv4 address; AAAA records map a hostname to an IPv6 address; CNAME records alias one hostname to another (e.g., www.example.com -> example.com), letting the target's IP change without updating every alias; MX records specify which mail servers handle email for a domain, each with a priority value; NS records declare which name servers are authoritative for a domain/zone; and TXT records hold arbitrary text, commonly used for domain verification and email security policies (SPF, DKIM, DMARC). Every record carries a TTL (time to live, in seconds) that tells caching resolvers how long they're allowed to reuse that answer before re-querying — a low TTL means changes propagate fast but generates more query traffic; a high TTL reduces load but means stale data lingers longer after a change. DNS itself runs primarily over UDP port 53 for fast, low-overhead lookups, falling back to TCP port 53 for larger responses (like zone transfers or DNSSEC-signed answers) that exceed UDP's practical size limits.",
  realWorldExamples:
    "CDNs like Cloudflare and Akamai exploit DNS heavily: they return different IP addresses for the same hostname depending on the requester's geographic location (via GeoDNS) or current server load, routing users to the nearest or healthiest edge server without the user doing anything differently. During a DNS outage — like the widely reported Dyn DNS DDoS attack in 2016 — huge swaths of the internet (Twitter, Netflix, Reddit, and more) became unreachable even though the underlying web servers were perfectly healthy, because clients simply couldn't resolve the names to addresses anymore. Companies routinely use low TTLs before a planned server migration so that once they cut over, clients pick up the new IP quickly instead of being stuck talking to a decommissioned server for hours.",
  useCases: [
    "Translating human-readable domain names into IP addresses for every web/app request",
    "Load balancing and geographic routing via multiple A records or GeoDNS (used heavily by CDNs)",
    "Email routing via MX records, directing mail to the correct mail servers for a domain",
    "Domain ownership verification and email authentication via TXT records (SPF/DKIM/DMARC)",
  ],
  advantages: [
    "Massively distributed and hierarchical, so no single server is a bottleneck or single point of failure for the whole system",
    "Caching at every layer (browser, OS, resolver) makes repeated lookups extremely fast and reduces load on authoritative servers",
    "Decouples human-friendly names from the underlying infrastructure, letting IPs change freely without users needing to know or care",
  ],
  disadvantages: [
    "Plain DNS queries are unencrypted and unauthenticated by default, making them vulnerable to eavesdropping and spoofing/cache poisoning",
    "TTL-based caching means changes (like a failover to a new IP) don't propagate instantly — clients with cached old records can be stuck until the TTL expires",
    "A misconfigured or attacked DNS layer takes down access to a service even if the actual servers behind it are perfectly healthy",
  ],
  commonMisconceptions: [
    "\"DNS lookups always hit the root servers\" — in practice, caching at the resolver, OS, and browser level means most lookups never leave the local cache or resolver.",
    "\"DNS is just A records\" — DNS is a general-purpose distributed key-value system with many record types (MX, TXT, CNAME, NS, SRV, etc.), not only hostname-to-IP mapping.",
    "\"A CNAME and an A record do the same thing\" — a CNAME is an alias to another name (which then gets its own lookup), while an A record directly holds an IP address; you cannot have a CNAME coexist with other records at the same name.",
    "\"Lowering TTL instantly updates everyone's cached record\" — a TTL change itself is also subject to the old TTL; you have to lower TTL well in advance of a planned change for it to take effect quickly.",
  ],
  interviewPerspective:
    "DNS resolution order is one of the most commonly asked 'walk me through what happens' interview questions in networking, often as an opener to a larger 'what happens when you type a URL into a browser' question. Interviewers want the correct order (browser cache -> OS cache -> resolver -> root -> TLD -> authoritative), the distinction between recursive and iterative queries, and comfort naming record types and their purposes. Bonus depth: explaining why DNS uses UDP by default, what TTL trade-offs look like operationally, and awareness of DNS-based attacks like cache poisoning or DDoS on resolvers.",
  oaPerspective:
    "OA MCQs commonly test the exact resolution order, matching record types to their purpose (which record type handles email routing, which handles IPv6, etc.), the default DNS port (53) and default transport protocol (UDP, with TCP fallback), and terminology (recursive vs. iterative query, authoritative vs. recursive resolver).",
  keyTakeaways: [
    "DNS translates domain names to IP addresses through a distributed, hierarchical system: root -> TLD -> authoritative servers.",
    "Resolution order is browser cache -> OS cache -> recursive resolver -> root -> TLD -> authoritative server.",
    "Key record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (name server delegation), TXT (arbitrary text/verification).",
    "TTL controls how long a record can be cached before being re-queried — a direct trade-off between propagation speed and query load.",
    "DNS runs on port 53, primarily over UDP, falling back to TCP for larger responses.",
  ],
  summaryClosing:
    "DNS is the quiet, distributed backbone that makes the human-usable web possible — by turning memorable names into routable addresses through a caching hierarchy of root, TLD, and authoritative servers, it lets the internet's actual addressing scheme change constantly underneath us without users ever noticing.",
  relatedTopics: ["HTTP & HTTPS", "Sockets & Client-Server Communication", "Network Security Fundamentals"],
  furtherReading: [
    { label: "RFC 1035 — Domain Names: Implementation and Specification", note: "The original core specification of the DNS protocol and message format." },
    { label: "Cloudflare Learning Center: What is DNS?", note: "An accessible walkthrough of the resolution process and record types." },
  ],
};

export default dnsArticle;
