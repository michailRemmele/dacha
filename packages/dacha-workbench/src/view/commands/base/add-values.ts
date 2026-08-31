import { ADD_VALUES } from '../../../command-types'
import type { Command } from '../../hooks/use-commander'

export const addValues = <T = unknown>(
  path: string[],
  values: T[],
  isEffect?: boolean,
): Command => ({
    command: ADD_VALUES,
    options: {
      path,
      values,
    },
    isEffect,
  })
