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
import type { UserSkill } from "@/types/Category";

interface SkillsSelectProps {
  id?: string;
  required?: boolean;
  error?: string | false;
  categoryIds: number[];
  disabled?: boolean;
  label?: string;
  value?: UserSkill[];
  onChange?: (skills: UserSkill[]) => void;
  control?: Control<any>;
  name?: string;
  skills?: UserSkill[];
}

export const SkillsSelect: FC<SkillsSelectProps> = ({
  id = "skills",
  required,
  error,
  categoryIds,
  disabled,
  label = "Skill name",
  value = [],
  onChange,
  control,
  name = "skills",
  skills: skillsProp = [],
}) => {
  // Filter skills by categoryIds
  const availableSkills = useMemo(() => {
    if (categoryIds.length === 0) return [];
    return skillsProp.filter((skill) => categoryIds.includes(skill.categoryId));
  }, [skillsProp, categoryIds]);

  // Convert skills to AutoCompleteItem format
  const skillOptions: AutoCompleteItem[] = useMemo(
    () =>
      availableSkills.map((skill) => ({
        id: skill.id,
        name: skill.name,
      })),
    [availableSkills]
  );

  // Convert value to AutoCompleteItem format
  const multiSelectValue = useMemo(
    () =>
      value.map((skill) => ({
        id: skill.id,
        name: skill.name,
      })),
    [value]
  );

  // Convert AutoCompleteItem back to UserSkill format
  const handleChange = (items: AutoCompleteItem[]) => {
    const skills = items.map((item) => {
      const originalSkill = availableSkills.find(
        (skill) => skill.id === item.id
      );
      return (
        originalSkill || {
          id: item.id as number,
          name: item.name,
          order: 0,
          percent: 100,
          isVisible: true,
          categoryId: categoryIds[0] || 0,
          categoryName: "",
        }
      );
    });
    onChange?.(skills);
  };

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const fieldValue = field.value || [];
          const multiSelectValue = fieldValue.map((skill: UserSkill) => ({
            id: skill.id,
            name: skill.name,
          }));

          return (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
              <FieldContent>
                <MultiSelect
                  id={id}
                  label=""
                  options={skillOptions}
                  value={multiSelectValue}
                  onChange={(items) => {
                    const skills = items.map((item) => ({
                      id: item.id as number,
                      name: item.name,
                    }));
                    field.onChange(skills);
                    handleChange(items);
                  }}
                  required={required}
                  disabled={disabled}
                  error={
                    fieldState.error
                      ? fieldState.error.message ||
                        "At least one skill is required"
                      : false
                  }
                  placeholder="Select skills"
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
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <FieldContent>
        <MultiSelect
          id={id}
          label=""
          options={skillOptions}
          value={multiSelectValue}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          error={error || false}
          placeholder="Select skills"
        />
        {error && <FieldError>{error}</FieldError>}
      </FieldContent>
    </Field>
  );
};
