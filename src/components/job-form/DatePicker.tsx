import { type FC } from "react";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, type Control } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";

interface DatePickerNewProps {
  id?: string;
  required?: boolean;
  error?: string | false;
  label?: string;
  name?: string;
  testid?: string;
  value?: string;
  onChange?: (value: string) => void;
  disablePastDays?: boolean;
  weekMode?: boolean;
  control?: Control<any>;
}

// Helper function to convert ISO8601 string to yyyy-MM-dd format
const isoToDateString = (isoString: string | undefined): string | undefined => {
  if (!isoString) return undefined;
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString().split("T")[0];
  } catch {
    return undefined;
  }
};

// Helper function to convert yyyy-MM-dd string to ISO8601 format
const dateStringToIso = (
  dateString: string | undefined
): string | undefined => {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString + "T00:00:00");
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString();
  } catch {
    return undefined;
  }
};

export const DatePickerNew: FC<DatePickerNewProps> = ({
  id,
  required,
  error,
  label,
  name,
  testid,
  value,
  onChange,
  disablePastDays,
  weekMode,
  control,
}) => {
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          // Convert form value (yyyy-MM-dd) to ISO8601 for DatePicker
          const isoValue = dateStringToIso(field.value);

          return (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
              <FieldContent>
                <DatePicker
                  id={id}
                  name={name}
                  label=""
                  value={isoValue}
                  onChange={(isoDate) => {
                    // Convert ISO8601 back to yyyy-MM-dd for form
                    const dateString = isoToDateString(isoDate);
                    field.onChange(dateString || "");
                    onChange?.(dateString || "");
                  }}
                  error={
                    fieldState.error
                      ? fieldState.error.message || "Invalid date"
                      : undefined
                  }
                  disabled={false}
                  required={required}
                  disablePastDays={disablePastDays}
                  weekMode={weekMode}
                  testid={testid}
                />
                <FieldError
                  errors={
                    fieldState.error
                      ? [{ message: fieldState.error.message }]
                      : undefined
                  }
                />
              </FieldContent>
            </Field>
          );
        }}
      />
    );
  }

  // Uncontrolled mode
  const isoValue = dateStringToIso(value);

  return (
    <Field data-invalid={!!error}>
      <FieldLabel>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <FieldContent>
        <DatePicker
          id={id}
          name={name}
          label=""
          value={isoValue}
          onChange={(isoDate) => {
            const dateString = isoToDateString(isoDate);
            onChange?.(dateString || "");
          }}
          error={error || undefined}
          disabled={false}
          required={required}
          disablePastDays={disablePastDays}
          weekMode={weekMode}
          testid={testid}
        />
        {error && <FieldError>{error}</FieldError>}
      </FieldContent>
    </Field>
  );
};
