export const getGridValue = (
  value: number,
  size: number,
  gridStep: number,
): number => Math.floor((value - (size - gridStep) / 2) / gridStep) * gridStep + size / 2
