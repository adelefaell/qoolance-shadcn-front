import { type FC } from "react";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, type Control } from "react-hook-form";

interface TermsPrivacyCheckBoxProps {
  error?: string | false;
  value: boolean;
  handleChange: (checked: boolean) => void;
  control?: Control<any>;
  name?: string;
}

export const TermsPrivacyCheckBox: FC<TermsPrivacyCheckBoxProps> = ({
  error,
  value,
  handleChange,
  control,
  name = "terms",
}) => {
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldContent>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    handleChange(!!checked);
                  }}
                />
                <FieldLabel htmlFor="terms" className="cursor-pointer">
                  I accept the{" "}
                  <a href="/terms" className="text-primary underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-primary underline">
                    Privacy Policy
                  </a>
                </FieldLabel>
              </div>
              <FieldError
                errors={
                  fieldState.error
                    ? [{ message: fieldState.error.message }]
                    : undefined
                }
              />
            </FieldContent>
          </Field>
        )}
      />
    );
  }

  return (
    <Field data-invalid={!!error}>
      <FieldContent>
        <div className="flex items-center gap-2">
          <Checkbox id="terms" checked={value} onCheckedChange={handleChange} />
          <FieldLabel htmlFor="terms" className="cursor-pointer">
            I accept the{" "}
            <a href="/terms" className="text-primary underline">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary underline">
              Privacy Policy
            </a>
          </FieldLabel>
        </div>
        {error && <FieldError>{error}</FieldError>}
      </FieldContent>
    </Field>
  );
};
