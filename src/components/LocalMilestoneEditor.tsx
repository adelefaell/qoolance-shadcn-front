import Decimal from "decimal.js";
import { type FC, useEffect, useMemo } from "react";
import { z } from "zod";
import { addDays, isAfter, isBefore, parseISO, isValid } from "date-fns";

import { type LocalMilestone, MilestoneStatus } from "@/types/Milestone";
import { useMilestoneConstraints } from "@/hooks/use-milestone-constraints";
import { type MilestoneConstraints } from "@/types/MilestoneConstraints";

import { formatNumberCurrency } from "@/lib/utils/formatNumberCurrency";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/hooks/use-config";

interface LocalMilestoneEditorFC {
  value: LocalMilestone[];
  onChange?: (value: LocalMilestone[]) => unknown;
  onError?: (hasError: boolean) => unknown;
  hourlyRate?: string;

  // styles
  className?: string;

  // policies
  canAdd: boolean;
  canEditAmount: boolean;
  canEditName: boolean;
  canEditTimeline: boolean;
  canRemove: boolean;

  // additional constraints to check
  constraints?: MilestoneConstraints;
}

export const LocalMilestoneEditor: FC<LocalMilestoneEditorFC> = (props) => {
  const {
    value,
    canAdd,
    canEditName,
    canEditAmount,
    canEditTimeline,
    canRemove,
    onChange,
    onError,
    hourlyRate,
    constraints,
    className = "",
  } = props;
  const {
    sumMilestones: _sumMilestones,
    isGroupAlignedBudget,
    isGroupAlignedTimeline,
  } = useMilestoneConstraints();

  const { config } = useConfig();
  const planAmountMinimum = config?.milestone?.plan_amount_minimum;

  const isHourly = constraints?.isHourly;

  const onAdd = () => {
    if (onChange) {
      const now = new Date();
      const defaultStart = constraints?.timeline?.startDate
        ? parseISO(constraints.timeline.startDate)
        : addDays(now, 1);
      const defaultDeadline = constraints?.timeline?.endDate
        ? parseISO(constraints.timeline.endDate)
        : addDays(now, 30);

      onChange([
        ...value,
        {
          name: "",
          amount: "",
          start: defaultStart.toISOString(),
          deadline: defaultDeadline.toISOString(),
          status: MilestoneStatus.OPEN,
          deliverables: "",
        },
      ]);
    }
  };

  const onRemove = (milestone: LocalMilestone) => {
    if (onChange) {
      onChange(value.filter((x) => x !== milestone));
    }
  };

  const onEdit = (
    oldMilestone: LocalMilestone,
    changedMilestone: LocalMilestone
  ) => {
    if (onChange) {
      onChange(value.map((x) => (x === oldMilestone ? changedMilestone : x)));
    }
  };

  const nameSchema = z
    .string()
    .min(1, "Milestone name is required")
    .min(3, "Milestone name must be at least 3 characters");

  const amountSchema = z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
      },
      { message: "Amount must be a valid positive number" }
    )
    .refine(
      (val) => {
        const num = Number(val);
        return Number.isInteger(num);
      },
      { message: "Amount must be an integer" }
    )
    .refine(
      (val) => {
        if (!planAmountMinimum) return true;
        const num = Number(val);
        return new Decimal(num).greaterThanOrEqualTo(
          new Decimal(planAmountMinimum)
        );
      },
      {
        message: `Amount must be at least ${planAmountMinimum}`,
      }
    );

  const startSchema = z
    .string()
    .min(1, "Start date is required")
    .refine(
      (val) => {
        const date = parseISO(val);
        return isValid(date);
      },
      { message: "Invalid date format" }
    )
    .refine(
      (val) => {
        const date = parseISO(val);
        return isAfter(date, new Date());
      },
      { message: "Start date must be in the future" }
    )
    .refine(
      (val) => {
        if (!constraints?.timeline) return true;
        const date = parseISO(val);
        const startDate = constraints.timeline.startDate
          ? parseISO(constraints.timeline.startDate)
          : null;
        const endDate = constraints.timeline.endDate
          ? parseISO(constraints.timeline.endDate)
          : null;

        if (startDate && isBefore(date, startDate)) return false;
        if (endDate && isAfter(date, endDate)) return false;
        return true;
      },
      { message: "Milestone not aligned with job timeline" }
    );

  const deadlineSchema = z
    .string()
    .min(1, "Deadline is required")
    .refine(
      (val) => {
        const date = parseISO(val);
        return isValid(date);
      },
      { message: "Invalid date format" }
    )
    .refine(
      (val) => {
        const date = parseISO(val);
        return isAfter(date, new Date());
      },
      { message: "Deadline must be in the future" }
    )
    .refine(
      (val) => {
        if (!constraints?.timeline) return true;
        const date = parseISO(val);
        const startDate = constraints.timeline.startDate
          ? parseISO(constraints.timeline.startDate)
          : null;
        const endDate = constraints.timeline.endDate
          ? parseISO(constraints.timeline.endDate)
          : null;

        if (startDate && isBefore(date, startDate)) return false;
        if (endDate && isAfter(date, endDate)) return false;
        return true;
      },
      { message: "Milestone not aligned with job timeline" }
    );

  const deliverablesSchema = z.string().optional();

  const validate = (
    schema: z.ZodSchema,
    value: unknown
  ): string | undefined => {
    try {
      schema.parse(value);
      return undefined;
    } catch (e) {
      console.error(e);
      return "Validation error";
    }
  };

  const sumMilestones: Decimal = useMemo(
    () => _sumMilestones(value),
    [value, _sumMilestones]
  );
  const errorBudget = useMemo(
    () => !isGroupAlignedBudget(value, constraints),
    [constraints, value, isGroupAlignedBudget]
  );
  const errorTimeline = useMemo(
    () => !isGroupAlignedTimeline(value, constraints),
    [value, constraints, isGroupAlignedTimeline]
  );
  const hasErrors = useMemo(
    () => errorBudget || errorTimeline,
    [errorBudget, errorTimeline]
  );

  useEffect(() => {
    if (onError) {
      onError(hasErrors);
    }
  }, [onError, hasErrors]);

  const classes = cn("space-y-6", className);

  return (
    <section className={classes}>
      {hasErrors && (
        <div
          className={cn(
            "rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive",
            { "border-destructive": hasErrors }
          )}
        >
          {errorBudget && !props.constraints?.isHourly
            ? `Sum exceeds budget: ${formatNumberCurrency(
                sumMilestones.toString()
              )} / ${formatNumberCurrency(
                constraints?.maxBudgetOrHours || "0"
              )}`
            : ``}
          {errorBudget && props.constraints?.isHourly
            ? `Sum exceeds hours: ${sumMilestones.toString()} / ${
                constraints?.maxBudgetOrHours || "0"
              }`
            : ``}
          {errorTimeline ? "Timeline alignment error" : ``}
        </div>
      )}

      {value.map((milestone, idx) => {
        return (
          <div key={idx} className="space-y-4 rounded-lg border p-4 bg-card">
            <div className="space-y-2">
              <Label htmlFor={`name-${idx}`} className="text-sm font-medium">
                Milestone Name
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                required
                data-testid="milestone-name"
                disabled={!canEditName}
                id={`name-${idx}`}
                name={`name[${idx}]`}
                value={milestone.name}
                onChange={(x) =>
                  onEdit(milestone, { ...milestone, name: x.target.value })
                }
                className={cn(
                  validate(nameSchema, milestone.name) && "border-destructive"
                )}
                aria-invalid={!!validate(nameSchema, milestone.name)}
              />
              {validate(nameSchema, milestone.name) && (
                <p className="text-sm text-destructive">
                  {validate(nameSchema, milestone.name)}
                </p>
              )}
            </div>

            <DatePicker
              disablePastDays
              required
              disabled={!canEditTimeline}
              id={`start-${idx}`}
              label="Starting Date"
              name={`start[${idx}]`}
              testid="milestone-start"
              value={milestone.start}
              weekMode={isHourly}
              onChange={(x) =>
                onEdit(milestone, { ...milestone, start: x || "" })
              }
              error={validate(startSchema, milestone.start)}
            />

            <DatePicker
              disablePastDays
              required
              disabled={!canEditTimeline}
              id={`deadline-${idx}`}
              label="Ending Date"
              name={`deadline[${idx}]`}
              testid="milestone-deadline"
              value={milestone.deadline}
              weekMode={isHourly}
              onChange={(x) =>
                onEdit(milestone, { ...milestone, deadline: x || "" })
              }
              error={validate(deadlineSchema, milestone.deadline)}
            />

            <div className="space-y-2">
              <Label htmlFor={`amount-${idx}`} className="text-sm font-medium">
                {hourlyRate ? "Expected Hours" : "Amount"}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                required
                data-testid="milestone-amount"
                disabled={!canEditAmount}
                id={`amount-${idx}`}
                name={`amount[${idx}]`}
                type="number"
                value={milestone.amount}
                onChange={(x) =>
                  onEdit(milestone, { ...milestone, amount: x.target.value })
                }
                className={cn(
                  validate(amountSchema, milestone.amount) &&
                    "border-destructive"
                )}
                aria-invalid={!!validate(amountSchema, milestone.amount)}
              />
              {validate(amountSchema, milestone.amount) && (
                <p className="text-sm text-destructive">
                  {validate(amountSchema, milestone.amount)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`deliverables-${idx}`}
                className="text-sm font-medium"
              >
                Deliverables
              </Label>
              <Textarea
                data-testid="milestone-deliverables"
                disabled={!canEditAmount}
                id={`deliverables-${idx}`}
                name={`deliverables[${idx}]`}
                value={milestone.deliverables || ""}
                onChange={(x) =>
                  onEdit(milestone, {
                    ...milestone,
                    deliverables: x.target.value,
                  })
                }
                className={cn(
                  validate(deliverablesSchema, milestone.deliverables) &&
                    "border-destructive"
                )}
                aria-invalid={
                  !!validate(deliverablesSchema, milestone.deliverables)
                }
              />
              {validate(deliverablesSchema, milestone.deliverables) && (
                <p className="text-sm text-destructive">
                  {validate(deliverablesSchema, milestone.deliverables)}
                </p>
              )}
            </div>

            {canRemove && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => onRemove(milestone)}
              >
                Remove Milestone
              </Button>
            )}
          </div>
        );
      })}
      {canAdd && !hasErrors && (
        <Button
          disabled={hasErrors}
          variant="outline"
          type="button"
          onClick={onAdd}
        >
          Add Milestone
        </Button>
      )}
    </section>
  );
};
