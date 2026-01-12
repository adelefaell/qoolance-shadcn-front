import { type FC, useMemo } from "react";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, type Control } from "react-hook-form";
import {
  MultiSelect,
  type AutoCompleteItem,
} from "@/components/ui/multi-select";

interface User {
  id: number;
  name: string;
}

interface SelectUsersFromContactListProps {
  id?: string;
  label?: string;
  error?: string | false;
  value?: User[];
  onChange?: (users: User[]) => void;
  control?: Control<any>;
  name?: string;
  users?: User[];
}

export const SelectUsersFromContactList: FC<
  SelectUsersFromContactListProps
> = ({
  id = "inviteUsers",
  label = "Invite Users",
  error,
  value = [],
  onChange,
  control,
  name = "inviteUsers",
  users: usersProp = [],
}) => {
  // Convert users to AutoCompleteItem format
  const userOptions: AutoCompleteItem[] = useMemo(
    () =>
      usersProp.map((user) => ({
        id: user.id,
        name: user.name,
      })),
    [usersProp]
  );

  // Convert value to AutoCompleteItem format
  const multiSelectValue = useMemo(
    () =>
      value.map((user) => ({
        id: user.id,
        name: user.name,
      })),
    [value]
  );

  // Convert AutoCompleteItem back to User format
  const handleChange = (items: AutoCompleteItem[]) => {
    const users = items.map((item) => {
      const originalUser = usersProp.find((user) => user.id === item.id);
      return (
        originalUser || {
          id: item.id as number,
          name: item.name,
        }
      );
    });
    onChange?.(users);
  };

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const fieldValue = field.value || [];
          const multiSelectValue = fieldValue.map((user: User) => ({
            id: user.id,
            name: user.name,
          }));

          return (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>{label}</FieldLabel>
              <FieldContent>
                <MultiSelect
                  id={id}
                  label=""
                  options={userOptions}
                  value={multiSelectValue}
                  onChange={(items) => {
                    const users = items.map((item) => {
                      const originalUser = usersProp.find(
                        (user) => user.id === item.id
                      );
                      return (
                        originalUser || {
                          id: item.id as number,
                          name: item.name,
                        }
                      );
                    });
                    field.onChange(users);
                    handleChange(items);
                  }}
                  error={
                    fieldState.error
                      ? fieldState.error.message || "Invalid selection"
                      : false
                  }
                  placeholder="Select users to invite"
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
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <MultiSelect
          id={id}
          label=""
          options={userOptions}
          value={multiSelectValue}
          onChange={handleChange}
          error={error || false}
          placeholder="Select users to invite"
        />
        {error && <FieldError>{error}</FieldError>}
      </FieldContent>
    </Field>
  );
};
