import {
  UPDATE_FIELD_VALUE,
  DELETE,
} from '../../../../command-types'
import type { Store } from '../../../../store'

import { Command } from './command'
import { UpdateFieldValueCmd } from './update-field-value'
import { DeleteCmd } from './delete'

export const commands: Record<string, { new(store: Store): Command }> = {
  [UPDATE_FIELD_VALUE]: UpdateFieldValueCmd,
  [DELETE]: DeleteCmd,
}
