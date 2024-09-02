import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { TemplateConfig } from 'remiz'

import { addValue } from '..'
import type { DispatchFn } from '../../hooks/use-commander'

const updateIds = (template: TemplateConfig): void => {
  template.id = uuidv4()
  template.children?.forEach(updateIds)
}

const getDuplicate = (template: TemplateConfig): TemplateConfig => {
  const duplicate = structuredClone(template)
  duplicate.name = `${duplicate.name} ${i18next.t('explorer.duplicate.appendix.title')}`
  updateIds(duplicate)

  return duplicate
}

export const duplicateTemplate = (
  path: Array<string>,
  template: TemplateConfig,
) => (
  dispatch: DispatchFn,
): void => {
  dispatch(addValue(
    path,
    getDuplicate(template),
  ))
}
