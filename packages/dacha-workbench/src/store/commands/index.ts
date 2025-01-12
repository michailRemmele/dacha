import {
  SET,
  DELETE,
  ADD,
  DELETE_BY_PATH,
} from '../../command-types'
import type { Store } from '../store'

import { Command } from './command'
import { SetCmd } from './set'
import { DeleteCmd } from './delete'
import { AddCmd } from './add'
import { DeleteByPathsCmd } from './delete-by-paths'

export const commands: Record<string, { new(store: Store): Command }> = {
  [SET]: SetCmd,
  [DELETE]: DeleteCmd,
  [ADD]: AddCmd,
  [DELETE_BY_PATH]: DeleteByPathsCmd,
}
