// src/content/cs-fundamentals/networks/index.ts
// Assembles every Computer Networks content file into one Subject object
// consumed by the cs-fundamentals pages.

import type { Subject, Topic } from "@/types";
import { networksTopicsMeta } from "./topics";
import networksTop40 from "./top-40";

import osiTcpIpModelsArticle from "./articles/osiTcpIpModels";
import ipAddressingSubnettingArticle from "./articles/ipAddressingSubnetting";
import switchingTechniquesArticle from "./articles/switchingTechniques";
import routingAlgorithmsArticle from "./articles/routingAlgorithms";
import tcpVsUdpArticle from "./articles/tcpVsUdp";
import congestionControlArticle from "./articles/congestionControl";
import dnsArticle from "./articles/dns";
import httpHttpsArticle from "./articles/httpHttps";
import networkSecurityArticle from "./articles/networkSecurity";
import socketsClientServerArticle from "./articles/socketsClientServer";

import { osiTcpIpModelsRevisionNotes, osiTcpIpModelsOAQuestions } from "./oa/osiTcpIpModels.oa";
import { ipAddressingSubnettingRevisionNotes, ipAddressingSubnettingOAQuestions } from "./oa/ipAddressingSubnetting.oa";
import { switchingTechniquesRevisionNotes, switchingTechniquesOAQuestions } from "./oa/switchingTechniques.oa";
import { routingAlgorithmsRevisionNotes, routingAlgorithmsOAQuestions } from "./oa/routingAlgorithms.oa";
import { tcpVsUdpRevisionNotes, tcpVsUdpOAQuestions } from "./oa/tcpVsUdp.oa";
import { congestionControlRevisionNotes, congestionControlOAQuestions } from "./oa/congestionControl.oa";
import { dnsRevisionNotes, dnsOAQuestions } from "./oa/dns.oa";
import { httpHttpsRevisionNotes, httpHttpsOAQuestions } from "./oa/httpHttps.oa";
import { networkSecurityRevisionNotes, networkSecurityOAQuestions } from "./oa/networkSecurity.oa";
import { socketsClientServerRevisionNotes, socketsClientServerOAQuestions } from "./oa/socketsClientServer.oa";

import osiTcpIpModelsInterviewQuestions from "./interview/osiTcpIpModels.interview";
import ipAddressingSubnettingInterviewQuestions from "./interview/ipAddressingSubnetting.interview";
import switchingTechniquesInterviewQuestions from "./interview/switchingTechniques.interview";
import routingAlgorithmsInterviewQuestions from "./interview/routingAlgorithms.interview";
import tcpVsUdpInterviewQuestions from "./interview/tcpVsUdp.interview";
import congestionControlInterviewQuestions from "./interview/congestionControl.interview";
import dnsInterviewQuestions from "./interview/dns.interview";
import httpHttpsInterviewQuestions from "./interview/httpHttps.interview";
import networkSecurityInterviewQuestions from "./interview/networkSecurity.interview";
import socketsClientServerInterviewQuestions from "./interview/socketsClientServer.interview";

const articlesBySlug = {
  "osi-tcp-ip-models": osiTcpIpModelsArticle,
  "ip-addressing-subnetting": ipAddressingSubnettingArticle,
  "switching-techniques": switchingTechniquesArticle,
  "routing-algorithms": routingAlgorithmsArticle,
  "tcp-vs-udp": tcpVsUdpArticle,
  "congestion-control": congestionControlArticle,
  dns: dnsArticle,
  "http-https": httpHttpsArticle,
  "network-security": networkSecurityArticle,
  "sockets-client-server": socketsClientServerArticle,
} as const;

const oaBySlug: Record<
  string,
  { notes: typeof osiTcpIpModelsRevisionNotes; questions: typeof osiTcpIpModelsOAQuestions }
> = {
  "osi-tcp-ip-models": { notes: osiTcpIpModelsRevisionNotes, questions: osiTcpIpModelsOAQuestions },
  "ip-addressing-subnetting": { notes: ipAddressingSubnettingRevisionNotes, questions: ipAddressingSubnettingOAQuestions },
  "switching-techniques": { notes: switchingTechniquesRevisionNotes, questions: switchingTechniquesOAQuestions },
  "routing-algorithms": { notes: routingAlgorithmsRevisionNotes, questions: routingAlgorithmsOAQuestions },
  "tcp-vs-udp": { notes: tcpVsUdpRevisionNotes, questions: tcpVsUdpOAQuestions },
  "congestion-control": { notes: congestionControlRevisionNotes, questions: congestionControlOAQuestions },
  dns: { notes: dnsRevisionNotes, questions: dnsOAQuestions },
  "http-https": { notes: httpHttpsRevisionNotes, questions: httpHttpsOAQuestions },
  "network-security": { notes: networkSecurityRevisionNotes, questions: networkSecurityOAQuestions },
  "sockets-client-server": { notes: socketsClientServerRevisionNotes, questions: socketsClientServerOAQuestions },
};

const interviewBySlug: Record<string, typeof osiTcpIpModelsInterviewQuestions> = {
  "osi-tcp-ip-models": osiTcpIpModelsInterviewQuestions,
  "ip-addressing-subnetting": ipAddressingSubnettingInterviewQuestions,
  "switching-techniques": switchingTechniquesInterviewQuestions,
  "routing-algorithms": routingAlgorithmsInterviewQuestions,
  "tcp-vs-udp": tcpVsUdpInterviewQuestions,
  "congestion-control": congestionControlInterviewQuestions,
  dns: dnsInterviewQuestions,
  "http-https": httpHttpsInterviewQuestions,
  "network-security": networkSecurityInterviewQuestions,
  "sockets-client-server": socketsClientServerInterviewQuestions,
};

const networksTopics: Topic[] = networksTopicsMeta.map((meta) => {
  const article = articlesBySlug[meta.slug as keyof typeof articlesBySlug];
  const oa = oaBySlug[meta.slug];
  return {
    ...meta,
    readingTimeMins: article?.readingTimeMins,
    article,
    oaRevisionNotes: oa?.notes,
    oaQuestions: oa?.questions,
    interviewQuestions: interviewBySlug[meta.slug],
  };
});

const networksSubject: Subject = {
  slug: "networks",
  title: "Computer Networks",
  shortTitle: "CN",
  description:
    "OSI/TCP-IP layers, IP addressing, routing, congestion control, DNS, HTTP internals, and network security — the networking core of every SDE interview loop.",
  icon: "🌐",
  status: "live",
  topics: networksTopics,
  top40: networksTop40,
};

export default networksSubject;
