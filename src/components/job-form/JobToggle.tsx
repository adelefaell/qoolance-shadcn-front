import type { FC, ChangeEvent } from "react";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";

interface JobToggleProps {
  id?: string;
  name?: string;
  label?: string;
  title?: string;
  subtitle?: React.ReactNode;
  checked: boolean;
  disabled?: boolean;
  "data-testid"?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  control?: Control<any>;
}

export const JobToggle: FC<JobToggleProps> = ({
  id,
  name,
  label,
  title,
  subtitle,
  checked,
  disabled,
  "data-testid": testId,
  onChange,
  control,
}) => {
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <FieldContent>
              <div className="flex items-center justify-between w-full">
                <div className="flex-1">
                  <FieldLabel>{label || title}</FieldLabel>
                  {subtitle && (
                    <div className="text-muted-foreground text-sm leading-normal font-normal mt-1">
                      {subtitle}
                    </div>
                  )}
                </div>
                <Switch
                  id={id}
                  checked={field.value}
                  disabled={disabled}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (onChange) {
                      onChange({
                        target: { checked, name: name || "" },
                      } as ChangeEvent<HTMLInputElement>);
                    }
                  }}
                  data-testid={testId}
                />
              </div>
            </FieldContent>
          </Field>
        )}
      />
    );
  }

  return (
    <Field orientation="horizontal">
      <FieldContent>
        <div className="flex items-center justify-between w-full">
          <div className="flex-1">
            <FieldLabel>{label || title}</FieldLabel>
            {subtitle && (
              <div className="text-muted-foreground text-sm leading-normal font-normal mt-1">
                {subtitle}
              </div>
            )}
          </div>
          <Switch
            id={id}
            checked={checked}
            disabled={disabled}
            onCheckedChange={(checked) => {
              if (onChange) {
                onChange({
                  target: { checked, name: name || "" },
                } as ChangeEvent<HTMLInputElement>);
              }
            }}
            data-testid={testId}
          />
        </div>
      </FieldContent>
    </Field>
  );
};
