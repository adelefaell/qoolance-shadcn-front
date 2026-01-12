export const JobType = {
  FIXED: "FIXED",
  HOURLY: "HOURLY",
  HOURLY_NEGOTIABLE: "HOURLY_NEGOTIABLE",
  UNKNOWN: "UNKNOWN",
} as const;

export type JobType = (typeof JobType)[keyof typeof JobType];
