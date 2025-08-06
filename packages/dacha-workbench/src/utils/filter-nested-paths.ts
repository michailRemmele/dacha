import { includesArray } from './includes-array'

export const filterNestedPaths = (paths: string[][]): string[][] => {
  const sortedPaths = paths.slice(0).sort((a, b) => a.length - b.length)

  const result: string[][] = []

  for (const path of sortedPaths) {
    const isNested = result.some((parentPath) => includesArray(path, parentPath))
    if (!isNested) {
      result.push(path)
    }
  }

  return result
}
