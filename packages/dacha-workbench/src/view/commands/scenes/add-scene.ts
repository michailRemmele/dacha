import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { SceneConfig } from 'dacha'

import { getUniqueName } from '../../../utils/get-unique-name'
import { addValue } from '..'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'

export const addScene = (
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const scenes = getState(destinationPath) as SceneConfig[]
  const isLoaderScene = destinationPath.at(-1) === 'loaders'

  dispatch(addValue<SceneConfig>(destinationPath, {
    id: uuidv4(),
    name: getUniqueName(i18next.t(
      isLoaderScene
        ? 'explorer.loaders.actionBar.loader.new.title'
        : 'explorer.scenes.actionBar.scene.new.title',
    ), scenes),
    systems: [],
    levelId: null,
  }))
}
