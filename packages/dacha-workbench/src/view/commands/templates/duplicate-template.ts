import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { TemplateConfig, LevelConfig } from 'dacha'

import { addValue, setValue } from '..'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'

import { getUpdatedLevels } from './utils'

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
  sourcePath: string[],
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const template = getState(sourcePath) as TemplateConfig
  const duplicate = getDuplicate(template)

  dispatch(addValue(destinationPath, duplicate))

  if (destinationPath.at(-1) === 'children') {
    const parent = getState(destinationPath.slice(0, -1)) as TemplateConfig
    const levels = getState(['levels']) as Array<LevelConfig>
    dispatch(setValue(['levels'], getUpdatedLevels(levels, parent.id, duplicate), true))
  }
}
