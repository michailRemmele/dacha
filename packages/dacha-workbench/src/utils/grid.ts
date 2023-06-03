import type {
  SceneContext,
  GameObject,
} from 'remiz'

import type { Settings } from '../engine/components'

export const SETTINGS_COMPONENT_NAME = 'settings'

export const getGridValue = (
  value: number,
  size: number,
  gridStep: number,
): number => Math.floor((value - (size - gridStep) / 2) / gridStep) * gridStep + size / 2

export const getGridStep = (sceneContext: SceneContext): number => {
  const mainObject = sceneContext.data.mainObject as GameObject
  const settings = mainObject.getComponent(SETTINGS_COMPONENT_NAME) as Settings

  return settings.data.gridStep as number
}
