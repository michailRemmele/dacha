import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { TemplateConfig, LevelConfig } from 'dacha'

import { addValue, setValue } from '..'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'

import { getUpdatedLevels } from './utils'

export const addTemplate = (
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const destination = getState(destinationPath) as TemplateConfig[]

  const template: TemplateConfig = {
    id: uuidv4(),
    name: i18next.t('explorer.levels.actionBar.template.new.title', { index: destination.length }),
    components: [],
    children: [],
  }

  dispatch(addValue<TemplateConfig>(destinationPath, template))

  if (destinationPath.at(-1) === 'children') {
    const parent = getState(destinationPath.slice(0, -1)) as TemplateConfig
    const levels = getState(['levels']) as Array<LevelConfig>
    dispatch(setValue(['levels'], getUpdatedLevels(levels, parent.id, template), true))
  }
}
