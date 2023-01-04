import { UPDATE_FIELD_VALUE } from '../../command-types'
import type { Command } from '../hooks/use-commander'

export const updateFieldValue = (
  path: Array<string>,
  value: unknown,
): Command => ({
  command: UPDATE_FIELD_VALUE,
  options: {
    path,
    value,
  },
})
