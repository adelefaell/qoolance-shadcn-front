import Decimal from "decimal.js"
import { useCallback } from "react"
import { isAfter, isBefore, parseISO } from "date-fns"

import  { type LocalMilestone } from "@/types/Milestone"
import { type MilestoneConstraints, type TimelineConstraint } from "@/types/MilestoneConstraints"

export const useMilestoneConstraints = () => {
  const sumMilestones = useCallback(
    (milestones: LocalMilestone[], rethrowErrors = false) => {
      try {
        return milestones.reduce(
          (prev, milestone) =>
            milestone.amount ? prev.add(new Decimal(milestone.amount)) : prev,
          new Decimal("0.00")
        )
      } catch (e) {
        if (rethrowErrors) {
          throw e
        } else {
          return new Decimal("0")
        }
      }
    },
    []
  )

  /**
   * Check if a specific date is aligned with a timeline constraints (being inside the timeframe)
   * @param date
   * @param constraints
   */
  const isDateAligned = useCallback(
    (date: Date | string, constraints: TimelineConstraint): boolean => {
      const dateObj = typeof date === "string" ? parseISO(date) : date

      const startCheck = constraints.startDate
        ? isAfter(dateObj, parseISO(constraints.startDate)) ||
          dateObj.getTime() === parseISO(constraints.startDate).getTime()
        : true

      const endCheck = constraints.endDate
        ? isBefore(dateObj, parseISO(constraints.endDate)) ||
          dateObj.getTime() === parseISO(constraints.endDate).getTime()
        : true

      return startCheck && endCheck
    },
    []
  )

  const isSingleAlignedTimeline = useCallback(
    (
      milestone: LocalMilestone,
      constraints?: MilestoneConstraints
    ): boolean => {
      return constraints?.timeline
        ? isDateAligned(milestone.start, constraints.timeline) &&
            isDateAligned(milestone.deadline, constraints.timeline)
        : true
    },
    [isDateAligned]
  )

  const isSingleAlignedBudget = useCallback(
    (
      milestone: LocalMilestone,
      constraints?: MilestoneConstraints
    ): boolean => {
      try {
        return constraints?.maxBudgetOrHours && milestone.amount
          ? new Decimal(milestone.amount).lessThanOrEqualTo(
              constraints.maxBudgetOrHours
            )
          : true
      } catch (e: unknown) {
        console.error("Error in isSingleAlignedBudget:", e)
        return false
      }
    },
    []
  )

  const isSingleAligned = useCallback(
    (
      milestone: LocalMilestone,
      constraints?: MilestoneConstraints
    ): boolean => {
      return (
        isSingleAlignedTimeline(milestone, constraints) &&
        isSingleAlignedBudget(milestone, constraints)
      )
    },
    [isSingleAlignedTimeline, isSingleAlignedBudget]
  )

  const isGroupAlignedTimeline = useCallback(
    (
      milestones: LocalMilestone[],
      constraints?: MilestoneConstraints
    ): boolean => {
      // Ensure milestones is an array
      if (!Array.isArray(milestones) || milestones.length === 0) {
        return true
      }

      if (constraints?.timeline) {
        return milestones.every((milestone) =>
          isSingleAlignedTimeline(milestone, constraints)
        )
      }

      return true
    },
    [isSingleAlignedTimeline]
  )

  const isGroupAlignedBudget = useCallback(
    (
      milestones: LocalMilestone[],
      constraints?: MilestoneConstraints
    ): boolean => {
      if (constraints?.maxBudgetOrHours) {
        try {
          const sumAmounts = sumMilestones(milestones, true)

          return sumAmounts.lessThanOrEqualTo(
            new Decimal(constraints.maxBudgetOrHours)
          )
        } catch (e: unknown) {
          console.error("Error in isGroupAlignedBudget:", e)
          return false
        }
      }

      return true
    },
    [sumMilestones]
  )

  /**
   * Check if a specific group if milestones is aligned with milestone constraints.
   * @param milestones
   * @param constraints
   */
  const isGroupAligned = useCallback(
    (
      milestones: LocalMilestone[],
      constraints: MilestoneConstraints
    ): boolean => {
      return (
        isGroupAlignedTimeline(milestones, constraints) &&
        isGroupAlignedBudget(milestones, constraints)
      )
    },
    [isGroupAlignedTimeline, isGroupAlignedBudget]
  )

  return {
    sumMilestones,
    isDateAligned,
    isSingleAlignedTimeline,
    isSingleAlignedBudget,
    isSingleAligned,
    isGroupAlignedTimeline,
    isGroupAlignedBudget,
    isGroupAligned,
  }
}
