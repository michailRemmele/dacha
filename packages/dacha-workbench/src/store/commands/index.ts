import {
  SET,
  DELETE,
  ADD,
} from '../../command-types'
import type { Store } from '../store'

import { Command } from './command'
import { SetCmd } from './set'
import { DeleteCmd } from './delete'
import { AddCmd } from './add'

export const commands: Record<string, { new(store: Store): Command }> = {
  [SET]: SetCmd,
  [DELETE]: DeleteCmd,
  [ADD]: AddCmd,
}
