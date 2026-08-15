const isObject = (
  item: unknown,
): boolean => item !== null && typeof item === 'object' && !Array.isArray(item)

export const deepMerge = <T, U>(target: T, source: U): T & U => {
  const output = { ...target } as T & U

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = (target as Record<string, unknown>)[key]

      if (isObject(sourceValue) && isObject(targetValue)) {
        (output as Record<string, unknown>)[key] = deepMerge(targetValue, sourceValue)
      } else {
        (output as Record<string, unknown>)[key] = sourceValue
      }
    }
  }

  return output
}
