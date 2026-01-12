"use client";

import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BadgeCheckbox } from "./BadgeCheckbox";
import { CategoriesService } from "@/lib/categories-service";
import type {
  Category,
  CategoryId,
  UserSkill,
  BadgeValue,
} from "@/types/Category";

/**
 * Placeholder hooks - replace with your actual implementations
 *
 * Example:
 * ```tsx
 * // Replace these with your actual hooks
 * import { useTranslation } from 'react-i18next'
 * import { useCategories } from '@/hooks/use-categories'
 * ```
 */
const useTranslation = () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      "job.select_category": "Select Category",
      "job.select_subcategory": "Select Subcategory",
    };
    return translations[key] || key;
  },
});

const useCategories = () => ({
  categories: undefined as Category[] | undefined,
});

type CategorySelectorFC = React.FC<{
  optionsLevel1: Category[] | undefined;
  valuesLevel1: CategoryId[];
  limitOneLevel1?: boolean;
  limitOneLevel2?: boolean;
  optionsLevel2: Category[] | undefined;
  valuesLevel2: CategoryId[];
  showSkills?: boolean;
  onAddSkill?: (skill: Category) => unknown;
  isAddingSkill?: boolean;
  loadingSkillId?: number;
  onChange?: (
    mainCategories: CategoryId[],
    subCategories: CategoryId[]
  ) => unknown;
  required?: boolean;
  step?: number;
  skillsStep?: number;
  showTitleLvl1?: boolean;
  showTitleLvl2?: boolean;
  showTitleLvl3?: boolean;
  id?: string;
  setSelectedCategoriesTitles?: (titles: string[]) => void;
  defaultCategoryId?: number;
  customTitle?: string;
  customTitleLvl2?: string;
  customTitleLvl3?: string;
  userSkills?: UserSkill[];
}>;

export const CategorySelector: CategorySelectorFC = (props) => {
  const {
    onChange,
    optionsLevel1,
    optionsLevel2,
    valuesLevel1,
    valuesLevel2,
    limitOneLevel1,
    limitOneLevel2,
    showSkills = false,
    onAddSkill,
    isAddingSkill = false,
    loadingSkillId,
    required = false,
    showTitleLvl1 = true,
    showTitleLvl2 = true,
    showTitleLvl3 = true,
    step,
    skillsStep = 10,
    id = "category-select",
    setSelectedCategoriesTitles,
    defaultCategoryId,
    customTitle,
    customTitleLvl2,
    customTitleLvl3,
    userSkills,
  } = props;

  const { t } = useTranslation();
  const { categories: allCategories } = useCategories();

  // State for skills expansion
  const [skillsExpansionIndex, setSkillsExpansionIndex] = useState(1);

  // Calculate available skills based on selected categories
  const availableSkills = useMemo(() => {
    if (!showSkills || !allCategories) {
      return [];
    }

    let _options: Category[] = [];

    // Use subcategories if available, otherwise use main categories
    const categoryIds = valuesLevel2.length > 0 ? valuesLevel2 : valuesLevel1;

    for (const categoryId of categoryIds) {
      const category = CategoriesService.findById(allCategories, categoryId);
      const depth = CategoriesService.getDepth(allCategories, categoryId);

      if (category) {
        // for level 2 category (subcategory) we get all the children (skills)
        if (depth === 2) {
          _options = [..._options, ...category.children];
        } else if (depth === 1) {
          // for level 1 category (main category) we need to go one level deeper
          for (const subcategory of category.children) {
            _options = [..._options, ...subcategory.children];
          }
        }
      }
    }

    // Filter out skills that are already in the user's skills list
    if (userSkills && userSkills.length > 0) {
      const userSkillIds = userSkills.map((skill) => skill.id);
      _options = _options.filter((skill) => !userSkillIds.includes(skill.id));
    }

    return _options;
  }, [showSkills, allCategories, valuesLevel1, valuesLevel2, userSkills]);

  const handleChangeMainCategory = useCallback(
    (x: BadgeValue[]) => {
      if (x && onChange) {
        // Ensure default category is always included
        const selectedIds = x.map((y) => Number(y));
        const finalIds = defaultCategoryId
          ? [...new Set([defaultCategoryId, ...selectedIds])]
          : selectedIds;

        onChange(finalIds, []);
      }
    },
    [onChange, defaultCategoryId]
  );

  const handleChangeSubCategories = useCallback(
    (x: BadgeValue[]) => {
      if (x && onChange) {
        onChange(
          valuesLevel1,
          x.map((y) => Number(y))
        );
      }
    },
    [onChange, valuesLevel1]
  );

  const handleSkillClick = useCallback(
    (skill: Category) => {
      if (onAddSkill && !isAddingSkill) {
        onAddSkill(skill);
      }
    },
    [onAddSkill, isAddingSkill]
  );

  if (!optionsLevel1) {
    return null;
  }

  return (
    <div data-testid="category-selector" className="space-y-3">
      {/* Level 1 - Main Categories */}
      <div className="space-y-2">
        {showTitleLvl1 && (
          <div
            className="text-sm text-muted-foreground"
            data-testid="level1-title"
          >
            {customTitle || t("job.select_category")}
            {required ? "*" : ""}
          </div>
        )}

        {/* Custom rendering for categories with default category support */}
        {defaultCategoryId ? (
          <div
            className="flex flex-wrap gap-2"
            data-cy="category-select-top-level"
            data-testid="level1-with-default"
          >
            {optionsLevel1?.map((x) => {
              const isDefaultCategory = defaultCategoryId === x.id;
              const isChecked = valuesLevel1.includes(x.id);

              return (
                <BadgeCheckbox
                  key={x.id}
                  checked={isChecked}
                  id={`${id}-level1-${x.id}`}
                  onCheckedChange={(checked) => {
                    if (isDefaultCategory) {
                      // Don't allow unchecking the default category
                      return;
                    }

                    const currentValues = valuesLevel1.filter(
                      (val: number) => val !== defaultCategoryId
                    );
                    const newIds = checked
                      ? [...currentValues, x.id]
                      : currentValues.filter((id) => id !== x.id);

                    handleChangeMainCategory([defaultCategoryId, ...newIds]);
                  }}
                  showLockIcon={isDefaultCategory}
                  showRemoveIcon={!isDefaultCategory && isChecked}
                  className={cn(
                    isDefaultCategory && "opacity-75 cursor-not-allowed"
                  )}
                >
                  {x.title}
                </BadgeCheckbox>
              );
            })}
          </div>
        ) : limitOneLevel1 ? (
          <BadgeCheckbox.RadioList
            data-cy="category-select-top-level"
            data-testid="level1-radio-list"
            id={`${id}-level1`}
            items={optionsLevel1.map((x) => ({
              value: x.id,
              label: x.title,
            }))}
            setSelectedCategoriesTitles={setSelectedCategoriesTitles}
            value={valuesLevel1[0]}
            onChange={(x) => handleChangeMainCategory(x ? [x] : [])}
          />
        ) : (
          <BadgeCheckbox.CheckboxList
            data-cy="category-select-top-level"
            data-testid="level1-checkbox-list"
            id={`${id}-level1`}
            items={optionsLevel1.map((x) => ({
              value: x.id,
              label: x.title,
            }))}
            setSelectedCategoriesTitles={setSelectedCategoriesTitles}
            value={valuesLevel1}
            onChange={handleChangeMainCategory}
          />
        )}
      </div>

      {/* Level 2 - Subcategories */}
      {optionsLevel2 !== undefined && optionsLevel2.length !== 0 && (
        <div className="space-y-2">
          {showTitleLvl2 && (
            <div
              className="text-sm text-muted-foreground"
              data-testid="level2-title"
            >
              {customTitleLvl2 || t("job.select_subcategory")}
            </div>
          )}

          {limitOneLevel2 ? (
            <BadgeCheckbox.RadioList
              data-cy="category-select-top-level"
              data-testid="level2-radio-list"
              id={`${id}-level2`}
              items={optionsLevel2.map((x) => ({
                value: x.id,
                label: x.title,
              }))}
              setSelectedCategoriesTitles={setSelectedCategoriesTitles}
              value={valuesLevel2[0]}
              onChange={(x) => handleChangeSubCategories(x ? [x] : [])}
            />
          ) : (
            <BadgeCheckbox.CheckboxList
              data-testid="level2-checkbox-list"
              id={`${id}-level2`}
              items={optionsLevel2.map((x) => ({
                value: x.id,
                label: x.title,
              }))}
              setSelectedCategoriesTitles={setSelectedCategoriesTitles}
              step={step}
              value={valuesLevel2}
              onChange={handleChangeSubCategories}
            />
          )}
        </div>
      )}

      {/* Level 3 - Skills */}
      {showSkills &&
        availableSkills.length > 0 &&
        (valuesLevel1.length > 0 || valuesLevel2.length > 0) && (
          <div className="space-y-2">
            {showTitleLvl3 && (
              <div
                className="text-sm text-muted-foreground"
                data-testid="level3-title"
              >
                {customTitleLvl3 || "Select Skills"}
              </div>
            )}

            <div
              className="flex flex-wrap gap-2"
              data-cy="skills-select"
              data-testid="level3-skills"
            >
              {availableSkills
                ?.slice(0, skillsStep * skillsExpansionIndex)
                ?.map((skill) => {
                  const isLoadingThis = loadingSkillId === skill?.id;
                  const isDisabled = isAddingSkill && !isLoadingThis;

                  return (
                    <BadgeCheckbox
                      key={skill?.id}
                      checked={isLoadingThis}
                      disabled={isDisabled}
                      id={`skill-${skill?.id}`}
                      onCheckedChange={() => handleSkillClick(skill)}
                      className={cn(
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                      data-testid={`skill-${skill?.id}`}
                    >
                      <span className="flex items-center gap-1.5">
                        {skill.title}
                        {isLoadingThis && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                        )}
                      </span>
                    </BadgeCheckbox>
                  );
                })}
              {availableSkills.length > skillsStep * skillsExpansionIndex && (
                <BadgeCheckbox
                  className="badge-checkbox-expand"
                  checked={false}
                  id={`${id}-skills-more`}
                  onCheckedChange={() => setSkillsExpansionIndex((x) => x + 1)}
                  showRemoveIcon={false}
                  showPlusIcon={true}
                >
                  <span className="sr-only">Show more skills</span>
                </BadgeCheckbox>
              )}
            </div>
          </div>
        )}
    </div>
  );
};
