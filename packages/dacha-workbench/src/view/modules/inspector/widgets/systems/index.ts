import type { WidgetSchema } from '../../../../../types/widget-schema'

import { animator } from './animator'
import { cameraSystem } from './camera-system'
import { gameStatsMeter } from './game-stats-meter'
import { keyboardControlSystem } from './keyboard-control-system'
import { keyboardInputSystem } from './keyboard-input-system'
import { mouseControlSystem } from './mouse-control-system'
import { mouseInputCoordinatesProjector } from './mouse-input-coordinates-projector'
import { mouseInputSystem } from './mouse-input-system'
import { physicsSystem } from './physics-system'
import { scriptSystem } from './script-system'
import { renderer } from './renderer'
import { uiBridge } from './ui-bridge'

export const systemsSchema: Record<string, WidgetSchema> = {
  animator,
  cameraSystem,
  gameStatsMeter,
  keyboardControlSystem,
  keyboardInputSystem,
  mouseControlSystem,
  mouseInputCoordinatesProjector,
  mouseInputSystem,
  physicsSystem,
  scriptSystem,
  renderer,
  uiBridge,
}
