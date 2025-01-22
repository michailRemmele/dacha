import { MOVE_BY_PATHS } from '../../../command-types'
import type { Command } from '../../hooks/use-commander'

export const moveByPaths = (
  sourcePaths: string[][],
  destinationPath: string[],
  isEffect?: boolean,
): Command => ({
  command: MOVE_BY_PATHS,
  options: {
    sourcePaths,
    destinationPath,
  },
  isEffect,
})
