import { ADD } from '../../command-types'
import type { Command } from '../hooks/use-commander'

export const addValue = <T = unknown>(
  path: Array<string>,
  value: T,
): Command => ({
    command: ADD,
    options: {
      path,
      value,
    },
  })
