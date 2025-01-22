import { DELETE_BY_PATHS } from '../../../command-types'
import type { Command } from '../../hooks/use-commander'

export const deleteByPaths = (
  paths: string[][],
  isEffect?: boolean,
): Command => ({
  command: DELETE_BY_PATHS,
  options: {
    paths,
  },
  isEffect,
})
