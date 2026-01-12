export type CategoryId = number;

export type BadgeValue = string | number;

export interface Category {
  id: number;
  title: string;
  children: Category[];
  icon: string;
  popularity: number;
  talent_count: number;
  job_count: number;
}

export type SkillID = number;

export interface UserSkill {
  id: SkillID;
  name: string;
  order: number;
  percent: number;
  isVisible: boolean;
  categoryId: number;
  categoryName: string;
}
