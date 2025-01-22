import type {
  Scene,
  Actor,
} from 'dacha'

import { Settings } from '../engine/components'

export const getGridValue = (
  value: number,
  size: number,
  gridStep: number,
): number => Math.floor((value - (size - gridStep) / 2) / gridStep) * gridStep + size / 2

export const getGridStep = (scene: Scene): number => {
  const mainActor = scene.data.mainActor as Actor
  const settings = mainActor.getComponent(Settings)

  return settings.data.gridStep as number
}
