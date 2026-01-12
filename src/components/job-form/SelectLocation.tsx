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
import type { Location } from "@/types/Location";

interface SelectLocationProps {
  id?: string;
  error?: string | false;
  value?: Location[];
  onChange?: (locations: Location[]) => void;
  disablePrependIcon?: boolean;
  control?: Control<any>;
  name?: string;
  locations?: Location[];
}

export const SelectLocation: FC<SelectLocationProps> = ({
  id = "locations",
  error,
  value = [],
  onChange,
  control,
  name = "locations",
  locations: locationsProp = [],
}) => {
  // Convert locations to AutoCompleteItem format
  const locationOptions: AutoCompleteItem[] = useMemo(
    () =>
      locationsProp.map((loc) => ({
        id: loc.id,
        name: loc.name,
      })),
    [locationsProp]
  );

  // Convert value to AutoCompleteItem format
  const multiSelectValue = useMemo(
    () =>
      value.map((loc) => ({
        id: loc.id,
        name: loc.name,
      })),
    [value]
  );

  // Convert AutoCompleteItem back to Location format
  const handleChange = (items: AutoCompleteItem[]) => {
    const locations = items.map((item) => {
      const originalLocation = locationsProp.find((loc) => loc.id === item.id);
      return (
        originalLocation || {
          id: item.id as number,
          name: item.name,
          standalone: {
            id: item.id as number,
            name: item.name,
            region: "",
            country: "",
          },
        }
      );
    });
    onChange?.(locations);
  };

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const fieldValue = field.value || [];
          const multiSelectValue = fieldValue.map((loc: Location) => ({
            id: loc.id,
            name: loc.name,
          }));

          return (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>Preferred Locations</FieldLabel>
              <FieldContent>
                <MultiSelect
                  id={id}
                  label=""
                  options={locationOptions}
                  value={multiSelectValue}
                  onChange={(items) => {
                    const locations = items.map((item) => ({
                      id: item.id as number,
                      name: item.name,
                    }));
                    field.onChange(locations);
                    handleChange(items);
                  }}
                  error={
                    fieldState.error
                      ? fieldState.error.message ||
                        "At least one location is required"
                      : false
                  }
                  placeholder="Select locations"
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
      <FieldLabel>Preferred Locations</FieldLabel>
      <FieldContent>
        <MultiSelect
          id={id}
          label=""
          options={locationOptions}
          value={multiSelectValue}
          onChange={handleChange}
          error={error || false}
          placeholder="Select locations"
        />
        {error && <FieldError>{error}</FieldError>}
      </FieldContent>
    </Field>
  );
};
