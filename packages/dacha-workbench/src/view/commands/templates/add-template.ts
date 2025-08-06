import { v4 as uuidv4 } from 'uuid'
import { t } from 'i18next'
import type { TemplateConfig, SceneConfig } from 'dacha'

import { getUniqueName } from '../../../utils/get-unique-name'
import { addValue, setValue } from '..'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'

import { getUpdatedScenes } from './utils'

export const addTemplate = (
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const destination = getState(destinationPath) as TemplateConfig[]

  const template: TemplateConfig = {
    id: uuidv4(),
    name: getUniqueName(t('explorer.templates.actionBar.template.new.title'), destination),
    components: [],
    children: [],
  }

  dispatch(addValue<TemplateConfig>(destinationPath, template))

  if (destinationPath.at(-1) === 'children') {
    const parent = getState(destinationPath.slice(0, -1)) as TemplateConfig
    const scenes = getState(['scenes']) as SceneConfig[]
    dispatch(setValue(['scenes'], getUpdatedScenes(scenes, parent.id, [template]), true))
  }
}
