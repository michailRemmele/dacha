import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { TemplateConfig } from 'remiz'

export const updateIds = (template: TemplateConfig): void => {
  template.id = uuidv4()
  template.children?.forEach(updateIds)
}

export const duplicateTemplate = (template: TemplateConfig): TemplateConfig => {
  const duplicate = structuredClone(template)
  duplicate.name = `${duplicate.name} ${i18next.t('explorer.duplicate.appendix.title')}`
  updateIds(duplicate)

  return duplicate
}
