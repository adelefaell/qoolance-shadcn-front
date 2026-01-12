import type { Category, CategoryId } from "@/types/Category";

/**
 * Service for working with category hierarchies
 */
export class CategoriesService {
  /**
   * Find a category by ID in a flat or nested array
   */
  static findById(
    categories: Category[] | undefined,
    id: CategoryId
  ): Category | undefined {
    if (!categories) return undefined;

    for (const category of categories) {
      if (category.id === id) {
        return category;
      }
      if (category.children && category.children.length > 0) {
        const found = this.findById(category.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }

  /**
   * Get the depth level of a category (1 = top level, 2 = subcategory, etc.)
   */
  static getDepth(
    categories: Category[] | undefined,
    id: CategoryId,
    currentDepth = 1
  ): number {
    if (!categories) return 0;

    for (const category of categories) {
      if (category.id === id) {
        return currentDepth;
      }
      if (category.children && category.children.length > 0) {
        const depth = this.getDepth(category.children, id, currentDepth + 1);
        if (depth > 0) return depth;
      }
    }
    return 0;
  }
}
