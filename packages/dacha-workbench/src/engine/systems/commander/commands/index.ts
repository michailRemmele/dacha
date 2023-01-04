import { UPDATE_FIELD_VALUE } from '../../../../command-types'
import type { Store } from '../../../../store'

import { Command } from './command'
import { UpdateFieldValueCmd } from './update-field-value'

export const commands: Record<string, { new(store: Store): Command }> = {
  [UPDATE_FIELD_VALUE]: UpdateFieldValueCmd,
}
