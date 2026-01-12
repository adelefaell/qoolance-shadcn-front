import  { type Date_ISO8601 } from "./Milestone"

export interface TimelineConstraint {
  startDate?: Date_ISO8601 // the start date in which some other date needs to fit in
  endDate?: Date_ISO8601 // the end date in which some other date needs to fit in
}

// constraints that can be used in relation to single milestone or a group of milestones
export interface MilestoneConstraints {
  timeline?: TimelineConstraint // the milestone start/end dates needs to fit in this timeline
  isHourly?: boolean // if the job is hourly
  maxBudgetOrHours?: string // the max allowed budget/hours that can be used for the milestone
}
