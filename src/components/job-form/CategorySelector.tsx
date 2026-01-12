import { type FC, useMemo } from "react";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, type Control } from "react-hook-form";
import type { Category, CategoryId } from "@/types/Category";
import { CategorySelector } from "@/components/category-selector/CategorySelector";

interface CategorySelectorProps {
  required?: boolean;
  mainCategory?: number;
  subCategories?: number[];
  onChange?: (
    mainCategory: number | undefined,
    subCategories: number[]
  ) => void;
  control?: Control<any>;
  mainCategoryName?: string;
  subCategoriesName?: string;
  categories?: Category[];
}

export const CategorySelectorForPosting: FC<CategorySelectorProps> = ({
  required,
  mainCategory,
  subCategories = [],
  onChange,
  control,
  mainCategoryName = "category",
  subCategoriesName = "subcategories",
  categories: categoriesProp = [],
}) => {
  // Calculate available subcategories based on selected main category
  const selectedCategory = categoriesProp.find((c) => c.id === mainCategory);
  const optionsLevel2 = useMemo(
    () => selectedCategory?.children || [],
    [selectedCategory]
  );

  // Convert single category to array format expected by CategorySelector
  const valuesLevel1 = useMemo(
    () => (mainCategory ? [mainCategory] : []),
    [mainCategory]
  );

  const valuesLevel2 = useMemo(() => subCategories, [subCategories]);

  // Handle onChange from CategorySelector and update form fields
  const handleCategoryChange = (
    mainCategories: CategoryId[],
    subCategories: CategoryId[]
  ) => {
    const mainCategoryValue =
      mainCategories.length > 0 ? mainCategories[0] : undefined;
    onChange?.(mainCategoryValue, subCategories);
  };

  if (control) {
    return (
      <>
        <Controller
          name={mainCategoryName}
          control={control}
          render={({ field, fieldState: mainFieldState }) => (
            <Controller
              name={subCategoriesName}
              control={control}
              render={({ field: subField, fieldState: subFieldState }) => {
                const currentMainCategory = field.value;
                const currentSubCategories = subField.value || [];

                // Calculate optionsLevel2 based on current main category
                const currentSelectedCategory = categoriesProp.find(
                  (c) => c.id === currentMainCategory
                );
                const currentOptionsLevel2 =
                  currentSelectedCategory?.children || [];

                return (
                  <div className="space-y-4">
                    <Field data-invalid={!!mainFieldState.error}>
                      <FieldLabel>
                        Main Category{" "}
                        {required && (
                          <span className="text-destructive">*</span>
                        )}
                      </FieldLabel>
                      <FieldContent>
                        <CategorySelector
                          optionsLevel1={categoriesProp}
                          valuesLevel1={
                            currentMainCategory ? [currentMainCategory] : []
                          }
                          limitOneLevel1={true}
                          optionsLevel2={currentOptionsLevel2}
                          valuesLevel2={currentSubCategories}
                          limitOneLevel2={false}
                          showSkills={false}
                          required={required}
                          showTitleLvl1={false}
                          showTitleLvl2={true}
                          onChange={(mainCategories, subCategories) => {
                            // Update main category field
                            const mainCategoryValue =
                              mainCategories.length > 0
                                ? mainCategories[0]
                                : undefined;
                            field.onChange(mainCategoryValue);

                            // Clear subcategories when main category changes
                            if (mainCategoryValue !== currentMainCategory) {
                              subField.onChange([]);
                            } else {
                              // Update subcategories field
                              subField.onChange(subCategories);
                            }

                            // Call optional onChange prop
                            onChange?.(mainCategoryValue, subCategories);
                          }}
                        />
                        <FieldError
                          errors={
                            mainFieldState.error
                              ? [{ message: mainFieldState.error.message }]
                              : undefined
                          }
                        />
                        {subFieldState.error && (
                          <FieldError
                            errors={
                              subFieldState.error
                                ? [{ message: subFieldState.error.message }]
                                : undefined
                            }
                          />
                        )}
                      </FieldContent>
                    </Field>
                  </div>
                );
              }}
            />
          )}
        />
      </>
    );
  }

  // Uncontrolled mode
  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel>
          Main Category{" "}
          {required && <span className="text-destructive">*</span>}
        </FieldLabel>
        <FieldContent>
          <CategorySelector
            optionsLevel1={categoriesProp}
            valuesLevel1={valuesLevel1}
            limitOneLevel1={true}
            optionsLevel2={optionsLevel2}
            valuesLevel2={valuesLevel2}
            limitOneLevel2={false}
            showSkills={false}
            required={required}
            showTitleLvl1={false}
            showTitleLvl2={true}
            onChange={handleCategoryChange}
          />
        </FieldContent>
      </Field>
    </div>
  );
};
