// src/content/aptitude/topics/index.ts
// Barrel export for all live aptitude topic content modules.

export { default as percentageTopic } from "./percentage";
export { default as profitAndLossTopic } from "./profitAndLoss";
export { default as timeAndWorkTopic } from "./timeAndWork";
export { default as numberSystemTopic } from "./numberSystem";

import percentageTopic from "./percentage";
import profitAndLossTopic from "./profitAndLoss";
import timeAndWorkTopic from "./timeAndWork";
import numberSystemTopic from "./numberSystem";

export const liveAptitudeTopics = [
  percentageTopic,
  profitAndLossTopic,
  timeAndWorkTopic,
  numberSystemTopic,
];
