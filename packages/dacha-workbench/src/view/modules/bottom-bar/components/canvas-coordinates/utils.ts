import { getGridValue } from '../../../../../utils/grid'

export const getGridSection = (
  value: number,
  step: number,
): number => {
  const section = getGridValue(value, step, step) / step
  return section < 0 ? Math.floor(section) : Math.round(section)
}
