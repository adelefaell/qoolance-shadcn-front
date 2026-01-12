export const isNumber = (val: string | number | undefined | null) => {
  if (val === "") return false;
  const num = Number(val);

  return !Number.isNaN(num) && num > 0;
};

export const isMin = (min: number, max: number): boolean => min >= max;
