import { ADD_VALUE } from '../../../command-types'
import type { Command } from '../../hooks/use-commander'

export const addValue = <T = unknown>(
  path: string[],
  value: T,
  isEffect?: boolean,
): Command => ({
    command: ADD_VALUE,
    options: {
      path,
      value,
    },
    isEffect,
  })
