import { DELETE } from '../../command-types'
import type { Command } from '../hooks/use-commander'

export const deleteValue = (
  path: Array<string>,
): Command => ({
  command: DELETE,
  options: {
    path,
  },
})
