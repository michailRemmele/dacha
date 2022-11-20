import type { DependencyValue } from '../../../../../types/widget-schema'

export const checkDependency = (value: unknown, checker: DependencyValue): boolean => {
  if (typeof value === 'string' && typeof checker === 'string') {
    return new RegExp(checker).test(value)
  }
  return value === checker
}
