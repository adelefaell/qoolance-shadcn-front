"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { X, Lock, Plus } from "lucide-react";
import type { BadgeValue } from "@/types/Category";

export interface BadgeCheckboxItem {
  label: string;
  value: BadgeValue;
}

interface BadgeCheckboxProps extends React.ComponentProps<typeof Checkbox> {
  children: React.ReactNode;
  showRemoveIcon?: boolean;
  showLockIcon?: boolean;
  showPlusIcon?: boolean;
}

const BadgeCheckbox: React.FC<BadgeCheckboxProps> = ({
  children,
  className,
  showRemoveIcon = true,
  showLockIcon = false,
  showPlusIcon = false,
  checked,
  ...props
}) => {
  const generatedId = React.useId();
  const checkboxId = props.id || `badge-checkbox-${generatedId}`;

  return (
    <div className={cn("relative inline-flex", className)}>
      <Checkbox
        {...props}
        checked={checked}
        id={checkboxId}
        className="peer sr-only"
      />
      <Label
        htmlFor={checkboxId}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all",
          "bg-background hover:bg-accent hover:text-accent-foreground",
          "peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          "text-sm font-medium whitespace-nowrap",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        )}
      >
        {children}
        {showLockIcon && <Lock className="h-3.5 w-3.5 shrink-0" />}
        {showRemoveIcon && !showLockIcon && !showPlusIcon && checked && (
          <X className="h-3.5 w-3.5 shrink-0" />
        )}
        {showPlusIcon && <Plus className="h-3.5 w-3.5 shrink-0" />}
      </Label>
    </div>
  );
};

type BadgeCheckboxRadioListProps = {
  items: BadgeCheckboxItem[];
  value?: BadgeValue;
  onChange?: (item: BadgeValue | undefined) => unknown;
  step?: number;
  name?: string;
  className?: string;
  id?: string;
  setSelectedCategoriesTitles?: (titles: string[]) => void;
};

const BadgeCheckboxRadioList: React.FC<BadgeCheckboxRadioListProps> = ({
  items,
  id,
  className,
  step,
  value,
  onChange,
  setSelectedCategoriesTitles,
  ...rest
}) => {
  const [index, setIndex] = React.useState(1);
  const generatedId = React.useId();
  const radioGroupId = id || `radio-group-${generatedId}`;

  const bundled = React.useMemo(() => {
    if (step === undefined) {
      return items;
    }
    return items.slice(0, step * index);
  }, [index, step, items]);

  return (
    <RadioGroup
      value={value?.toString()}
      onValueChange={(val) => {
        if (onChange) {
          const newValue = val
            ? typeof value === "number"
              ? Number(val)
              : val
            : undefined;
          onChange(newValue);
          if (setSelectedCategoriesTitles && val) {
            const selectedItem = items.find((x) => x.value.toString() === val);
            if (selectedItem) {
              setSelectedCategoriesTitles([selectedItem.label]);
            }
          }
        }
      }}
      className={cn("flex flex-wrap gap-2", className)}
      {...rest}
    >
      {bundled.map((x) => {
        const isChecked = value?.toString() === x.value.toString();
        return (
          <div key={x.value} className="relative inline-flex">
            <RadioGroupItem
              value={x.value.toString()}
              id={`${radioGroupId}-val-${x.value}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`${radioGroupId}-val-${x.value}`}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all",
                "bg-background hover:bg-accent hover:text-accent-foreground",
                "peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                "text-sm font-medium whitespace-nowrap",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              )}
            >
              {x.label}
              {isChecked && <X className="h-3.5 w-3.5 shrink-0" />}
            </Label>
          </div>
        );
      })}
      {items.length > bundled.length && (
        <BadgeCheckbox
          className="badge-checkbox-expand"
          checked={false}
          id={`${radioGroupId}-more`}
          onCheckedChange={() => setIndex((x) => x + 1)}
          showRemoveIcon={false}
          showPlusIcon={true}
        >
          <span className="sr-only">Show more</span>
        </BadgeCheckbox>
      )}
    </RadioGroup>
  );
};

type BadgeCheckboxListProps = {
  items: BadgeCheckboxItem[];
  value?: BadgeValue[];
  onChange?: (items: BadgeValue[]) => unknown | void;
  step?: number;
  name?: string;
  className?: string;
  id?: string;
  setSelectedCategoriesTitles?: (titles: string[]) => void;
};

const BadgeCheckboxList: React.FC<BadgeCheckboxListProps> = ({
  items,
  id,
  className,
  step,
  value = [],
  onChange,
  setSelectedCategoriesTitles,
  ...rest
}) => {
  const [index, setIndex] = React.useState(1);

  const bundled = React.useMemo(() => {
    if (step === undefined) {
      return items;
    }
    return items.slice(0, step * index);
  }, [index, step, items]);

  const handleChange = (item: BadgeValue, checked: boolean) => {
    if (!onChange) return;

    const newValue = checked
      ? [...value, item]
      : value.filter((v) => v !== item);

    onChange(newValue);
    if (setSelectedCategoriesTitles) {
      setSelectedCategoriesTitles(
        newValue.map((v) => items.find((x) => x.value === v)?.label || "")
      );
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...rest}>
      {bundled.map((x) => {
        const isChecked = value.includes(x.value);
        return (
          <BadgeCheckbox
            key={x.value}
            checked={isChecked}
            id={`${id}-val-${x.value}`}
            name={rest.name}
            onCheckedChange={(checked) =>
              handleChange(x.value, checked as boolean)
            }
            showRemoveIcon={isChecked}
          >
            {x.label}
          </BadgeCheckbox>
        );
      })}
      {items.length > bundled.length && (
        <BadgeCheckbox
          className="badge-checkbox-expand"
          checked={false}
          id={`${id}-more`}
          onCheckedChange={() => setIndex((x) => x + 1)}
          showRemoveIcon={false}
          showPlusIcon={true}
        >
          <span className="sr-only">Show more</span>
        </BadgeCheckbox>
      )}
    </div>
  );
};

const BadgeCheckboxNamespace = Object.assign(BadgeCheckbox, {
  RadioList: BadgeCheckboxRadioList,
  CheckboxList: BadgeCheckboxList,
});

export { BadgeCheckboxNamespace as BadgeCheckbox };
