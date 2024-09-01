import { v4 as uuidv4 } from 'uuid'
import type { TemplateConfig } from 'remiz'

import { addValue } from '..'
import type { DispatchFn } from '../../hooks/use-commander'

export const addTemplate = (
  path: Array<string>,
  name: string,
) => (
  dispatch: DispatchFn,
): void => {
  dispatch(addValue<TemplateConfig>(path, {
    id: uuidv4(),
    name,
    components: [],
    children: [],
  }))
}
