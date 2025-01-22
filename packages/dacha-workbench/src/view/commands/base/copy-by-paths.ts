import { COPY_BY_PATHS } from '../../../command-types'
import type { Command } from '../../hooks/use-commander'

export const copyByPaths = (
  sourcePaths: string[][],
  destinationPath: string[],
  transformCallback?: (value: unknown, path: string[]) => unknown,
  isEffect?: boolean,
): Command => ({
  command: COPY_BY_PATHS,
  options: {
    sourcePaths,
    destinationPath,
    transformCallback,
  },
  isEffect,
})
