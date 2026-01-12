export const MilestoneStatus = {
  OPEN: "OPEN",
  FUND_REQUESTED: "FUND_REQUESTED",
  FUNDED: "FUNDED",
  RELEASE_REQUESTED: "RELEASE_REQUESTED",
  RELEASED: "RELEASED",
  WORKED: "WORKED",
  CLOSED: "CLOSED",
  DISPUTED: "DISPUTED",
  RESOLVED: "RESOLVED",
  UNKNOWN: "UNKNOWN",
} as const;

export type MilestoneStatus =
  (typeof MilestoneStatus)[keyof typeof MilestoneStatus];

export type Date_ISO8601 = string;

// a milestone that is not yet stored in a workroom (has no proper id)
export interface LocalMilestone {
  name: string;
  status: MilestoneStatus;
  start: Date_ISO8601;
  deadline: Date_ISO8601;
  amount?: string; // this can be amount (money), but also time (hours)!
  amountWithoutFee?: string; // this one can be only money
  deliverables?: string;
  escrow?: string;
}

// a milestone that is stored in a workroom and has a proper identifier
export interface Milestone extends LocalMilestone {
  id: string;
  createdAt: string;
}

export interface MilestoneFormValues {
  name: string;
  start: string;
  deadline: string;
  amount: number;
  deliverables?: string;
}
