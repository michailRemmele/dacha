import { ADD } from '../../command-types'
import type { Command } from '../hooks/use-commander'

export const addValue = (
  path: Array<string>,
  value: unknown,
): Command => ({
  command: ADD,
  options: {
    path,
    value,
  },
})
