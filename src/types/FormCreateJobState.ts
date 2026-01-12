export interface BudgetRange {
  label: string;
  min: number;
  max: number;
  showCustom: boolean;
}

export const budgetRangeOptions: BudgetRange[] = [
  { label: "Under $100", min: 0, max: 100, showCustom: false },
  { label: "$100 - $200", min: 100, max: 200, showCustom: false },
  { label: "$200 - $500", min: 200, max: 500, showCustom: false },
  { label: "$500 - $1 000", min: 500, max: 1000, showCustom: false },
  { label: "$1 000 - $2 000", min: 1000, max: 2000, showCustom: false },
  { label: "$2 000 - $5 000", min: 2000, max: 5000, showCustom: false },
  { label: "$5 000 - $10 000", min: 5000, max: 10000, showCustom: false },
  { label: "$10 000 - $20 000", min: 10000, max: 20000, showCustom: false },
  { label: "$20 000 - $50 000", min: 20000, max: 50000, showCustom: false },
  // { label: 'Over $50 000', min: 50000, max: 0, showCustom: false },
];
