import { z } from "zod";
import { addDays, isAfter, isValid } from "date-fns";

import { JobType } from "@/types/JobType";
import { budgetRangeOptions } from "@/types/FormCreateJobState";

import { isMin, isNumber } from "@/shared/utils";

export function useJobSchema() {
  // ✅ Base Fields
  const getBaseJobSchemaFields = () => ({
    title: z
      .string()
      .min(1, "Title is required")
      .min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .min(80, "Description must be at least 80 characters"),
    languages: z.array(z.unknown()).min(1, "At least one language is required"),
    skills: z.array(z.unknown()).min(1, "At least one skill is required"),
    locations: z.array(z.unknown()).min(1, "At least one location is required"),
    paymentType: z.string().min(1, "Payment type is required"),
    budget: z.string().optional(),
    confidential: z.boolean().optional(),
    inviteOnly: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms",
    }),
    milestones: z.any(),
  });

  // ✅ Budget Fields
  const getBudgetFields = () => {
    return {
      minBudget: z.number().optional(),
      maxBudget: z.number().optional(),
      minRate: z.number().optional(),
      maxRate: z.number().optional(),
      minHours: z.number().optional(),
      maxHours: z.number().optional(),
    };
  };

  // ✅ Date Fields
  const getDateFields = () => ({
    proposalsUntil: z.any(),
    startDate: z.any(),
    endDate: z.any(),
  });

  // ✅ Invite-Only Users
  const getInviteUsersField = () => z.array(z.unknown()).optional();

  // ✅ SCHEMA BUILDERS
  const createJobSchema = (milestoneMisalignment = false) => {
    const baseSchema = z.object({
      ...getBaseJobSchemaFields(),
      ...getBudgetFields(),
      ...getDateFields(),
      inviteUsers: getInviteUsersField(),
    });

    return baseSchema.superRefine((data, ctx) => {
      // ✅ Milestone validation
      if (milestoneMisalignment) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["milestones"],
          message: "Milestones are not aligned with job timeline",
        });
      }

      // ✅ Custom Budget Fields (only if FIXED + showCustom)
      const isFixed = data.paymentType === JobType.FIXED;
      const option = budgetRangeOptions.find(
        (o: { label: string }) => o.label === data.budget
      );

      if (isFixed && option?.showCustom) {
        // Validate minBudget
        if (data.minBudget === undefined || data.minBudget === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minBudget"],
            message: "Minimum budget is required",
          });
        } else if (!isNumber(data.minBudget)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minBudget"],
            message: "Minimum budget must be a valid number",
          });
        } else if (
          data.maxBudget !== undefined &&
          data.maxBudget !== null &&
          isNumber(data.maxBudget) &&
          isMin(data.minBudget, data.maxBudget)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minBudget"],
            message: "Minimum budget must be less than maximum budget",
          });
        }

        // Validate maxBudget
        if (data.maxBudget === undefined || data.maxBudget === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxBudget"],
            message: "Maximum budget is required",
          });
        } else if (!isNumber(data.maxBudget)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxBudget"],
            message: "Maximum budget must be a valid number",
          });
        } else if (
          data.minBudget !== undefined &&
          data.minBudget !== null &&
          isNumber(data.minBudget) &&
          isNumber(data.maxBudget) &&
          isMin(data.minBudget, data.maxBudget)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxBudget"],
            message: "Maximum budget must be greater than minimum budget",
          });
        }
      }

      // ✅ Hourly Rate Fields
      if (data.paymentType === JobType.HOURLY) {
        if (data.minRate === undefined || data.minRate === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minRate"],
            message: "Minimum rate is required",
          });
        } else if (!isNumber(data.minRate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minRate"],
            message: "Minimum rate must be a valid number",
          });
        } else if (
          data.maxRate !== undefined &&
          data.maxRate !== null &&
          isNumber(data.maxRate) &&
          isMin(data.minRate, data.maxRate)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minRate"],
            message: "Minimum rate must be less than maximum rate",
          });
        }
      }

      if (data.paymentType === JobType.HOURLY_NEGOTIABLE) {
        if (data.maxRate === undefined || data.maxRate === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxRate"],
            message: "Maximum rate is required",
          });
        } else if (!isNumber(data.maxRate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxRate"],
            message: "Maximum rate must be a valid number",
          });
        } else if (
          data.minRate !== undefined &&
          data.minRate !== null &&
          isNumber(data.minRate) &&
          isNumber(data.maxRate) &&
          isMin(data.minRate, data.maxRate)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxRate"],
            message: "Maximum rate must be greater than minimum rate",
          });
        }
      }

      // ✅ Hourly Hours Fields
      if (data.paymentType === JobType.HOURLY) {
        if (data.minHours === undefined || data.minHours === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minHours"],
            message: "Minimum hours is required",
          });
        } else if (!isNumber(data.minHours)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minHours"],
            message: "Minimum hours must be a valid number",
          });
        } else if (
          data.maxHours !== undefined &&
          data.maxHours !== null &&
          isNumber(data.maxHours) &&
          data.minHours > data.maxHours
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minHours"],
            message: "Minimum hours must be less than maximum hours",
          });
        }

        if (data.maxHours === undefined || data.maxHours === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxHours"],
            message: "Maximum hours is required",
          });
        } else if (!isNumber(data.maxHours)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxHours"],
            message: "Maximum hours must be a valid number",
          });
        } else if (
          data.minHours !== undefined &&
          data.minHours !== null &&
          isNumber(data.minHours) &&
          isNumber(data.maxHours) &&
          data.minHours > data.maxHours
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxHours"],
            message: "Maximum hours must be greater than minimum hours",
          });
        }
      }

      // ✅ Date validations
      if (data.proposalsUntil) {
        const proposalsDate =
          data.proposalsUntil instanceof Date
            ? data.proposalsUntil
            : new Date(data.proposalsUntil as string);

        if (!isValid(proposalsDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["proposalsUntil"],
            message: "Invalid date",
          });
        } else if (!isAfter(proposalsDate, addDays(new Date(), 2))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["proposalsUntil"],
            message: "Proposals deadline must be at least 2 days from now",
          });
        }
      }

      if (data.startDate) {
        const startDate =
          data.startDate instanceof Date
            ? data.startDate
            : new Date(data.startDate as string);

        if (!isValid(startDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["startDate"],
            message: "Invalid date",
          });
        } else if (data.proposalsUntil) {
          const proposalsDate =
            data.proposalsUntil instanceof Date
              ? data.proposalsUntil
              : new Date(data.proposalsUntil as string);

          if (isValid(proposalsDate) && isAfter(proposalsDate, startDate)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["startDate"],
              message: "Start date must be after proposals deadline",
            });
          }
        }
      }

      if (data.endDate) {
        const endDate =
          data.endDate instanceof Date
            ? data.endDate
            : new Date(data.endDate as string);

        if (!isValid(endDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["endDate"],
            message: "Invalid date",
          });
        } else if (data.startDate) {
          const startDate =
            data.startDate instanceof Date
              ? data.startDate
              : new Date(data.startDate as string);

          if (isValid(startDate) && !isAfter(endDate, startDate)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["endDate"],
              message: "End date must be after start date",
            });
          }
        }
      }

      // ✅ Invite-Only Users validation
      if (data.confidential && data.inviteOnly === "true") {
        if (!data.inviteUsers || data.inviteUsers.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["inviteUsers"],
            message: "At least one user must be invited for confidential jobs",
          });
        }
      }
    });
  };

  // ✅ For edit schema (can be same as create unless logic differs)
  const editJobSchema = (milestoneMisalignment = false) =>
    createJobSchema(milestoneMisalignment);

  // ✅ For clone schema (same as create in most cases)
  const cloneJobSchema = (milestoneMisalignment = false) =>
    createJobSchema(milestoneMisalignment);

  return { createJobSchema, editJobSchema, cloneJobSchema };
}
