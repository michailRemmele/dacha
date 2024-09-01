import { ADD } from '../../../command-types'
import type { Command } from '../../hooks/use-commander'

export const addValue = <T = unknown>(
  path: Array<string>,
  value: T,
  isEffect?: boolean,
): Command => ({
    command: ADD,
    options: {
      path,
      value,
    },
    isEffect,
  })
