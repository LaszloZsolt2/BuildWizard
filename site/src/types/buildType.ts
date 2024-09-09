export const typeExplanations = {
  minimum: "Cheapest build that meets minimum requirements",
  recommended: "Cheapest build that meets recommended requirements",
  recPremium: "Exceeds requirements for a smoother experience",
  maxPerformance:
    "Used most of the budget for parts that highly affect performance",
  balanced: "Used some of the budget for non-performance enhancements",
  premium:
    "Used a significant part of the budget for non-performance enhancements",
};

export type BuildType = keyof typeof typeExplanations;
