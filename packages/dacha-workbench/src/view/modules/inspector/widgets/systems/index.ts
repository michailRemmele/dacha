import type { WidgetSchema } from '../../../../../types/widget-schema'

import { animator } from './animator'
import { cameraSystem } from './camera-system'
import { collisionBroadcastSystem } from './collision-broadcast-system'
import { collisionDetectionSystem } from './collision-detection-system'
import { collisionSolver } from './collision-solver'
import { constraintSolver } from './constraint-solver'
import { gameStatsMeter } from './game-stats-meter'
import { jammer } from './jammer'
import { keyboardControlSystem } from './keyboard-control-system'
import { keyboardInputSystem } from './keyboard-input-system'
import { mouseControlSystem } from './mouse-control-system'
import { mouseInputCoordinatesProjector } from './mouse-input-coordinates-projector'
import { mouseInputSystem } from './mouse-input-system'
import { physicsSystem } from './physics-system'
import { scriptSystem } from './script-system'
import { threeJSRenderer } from './three-js-renderer'
import { uiBridge } from './ui-bridge'

export const systemsSchema: Record<string, WidgetSchema> = {
  animator,
  cameraSystem,
  collisionBroadcastSystem,
  collisionDetectionSystem,
  collisionSolver,
  constraintSolver,
  gameStatsMeter,
  jammer,
  keyboardControlSystem,
  keyboardInputSystem,
  mouseControlSystem,
  mouseInputCoordinatesProjector,
  mouseInputSystem,
  physicsSystem,
  scriptSystem,
  threeJSRenderer,
  uiBridge,
}
