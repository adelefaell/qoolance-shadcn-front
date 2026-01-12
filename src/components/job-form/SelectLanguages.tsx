import { type FC, useMemo } from "react";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  MultiSelect,
  type AutoCompleteItem,
} from "@/components/ui/multi-select";
import { Controller, type Control } from "react-hook-form";
import type { Language } from "@/types/Language";

interface SelectLanguagesProps {
  id?: string;
  required?: boolean;
  error?: string | false;
  value?: Language[];
  onChange?: (languages: Language[]) => void;
  disablePrependIcon?: boolean;
  control?: Control<any>;
  name?: string;
  languages?: Language[];
}

export const SelectLanguages: FC<SelectLanguagesProps> = ({
  id = "languages",
  required,
  error,
  value = [],
  onChange,
  control,
  name = "languages",
  languages: languagesProp = [],
}) => {
  // Convert languages to AutoCompleteItem format
  const languageOptions: AutoCompleteItem[] = useMemo(
    () =>
      languagesProp.map((lang) => ({
        id: lang.slug,
        name: lang.name,
      })),
    [languagesProp]
  );

  // Convert value to AutoCompleteItem format
  const multiSelectValue = useMemo(
    () =>
      value.map((lang) => ({
        id: lang.slug,
        name: lang.name,
      })),
    [value]
  );

  // Convert AutoCompleteItem back to Language format
  const handleChange = (items: AutoCompleteItem[]) => {
    const languages = items.map((item) => ({
      slug: item.id as string,
      name: item.name,
    }));
    onChange?.(languages);
  };

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const fieldValue = field.value || [];
          const multiSelectValue = fieldValue.map((lang: Language) => ({
            id: lang.slug,
            name: lang.name,
          }));

          return (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>
                Preferred Languages{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
              <FieldContent>
                <MultiSelect
                  id={id}
                  label=""
                  options={languageOptions}
                  value={multiSelectValue}
                  onChange={(items) => {
                    const languages = items.map((item) => ({
                      slug: item.id as string,
                      name: item.name,
                    }));
                    field.onChange(languages);
                    handleChange(items);
                  }}
                  required={required}
                  error={
                    fieldState.error
                      ? fieldState.error.message ||
                        "At least one language is required"
                      : false
                  }
                  placeholder="Select languages"
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

  return (
    <Field data-invalid={!!error}>
      <FieldLabel>
        Preferred Languages{" "}
        {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <FieldContent>
        <MultiSelect
          id={id}
          label=""
          options={languageOptions}
          value={multiSelectValue}
          onChange={handleChange}
          required={required}
          error={error || false}
          placeholder="Select languages"
        />
        {error && <FieldError>{error}</FieldError>}
      </FieldContent>
    </Field>
  );
};
