import { AnimatorPlugin } from './animator-plugin';
import { CameraSystemPlugin } from './camera-system-plugin';
import { CollisionBroadcastSystemPlugin } from './collision-broadcast-system-plugin';
import { CollisionDetectionSystemPlugin } from './collision-detection-system-plugin';
import { CollisionSolverPlugin } from './collision-solver-plugin';
import { ConstraintSolverPlugin } from './constraint-solver-plugin';
import { GameStatsMeterPlugin } from './game-stats-meter-plugin';
import { JammerPlugin } from './jammer-plugin';
import { KeyboardInputSystemPlugin } from './keyboard-input-system-plugin';
import { KeyboardControlSystemPlugin } from './keyboard-control-system-plugin';
import { MouseControlSystemPlugin } from './mouse-control-system-plugin';
import { MouseInputSystemPlugin } from './mouse-input-system-plugin';
import { MouseInputCoordinatesProjectorPlugin } from './mouse-input-coordinates-projector';
import { PhysicsSystemPlugin } from './physics-system-plugin';
import { SceneLoadSystemPlugin } from './scene-load-system-plugin';
import { ScriptSystemPlugin } from './script-system-plugin';
import { ThreeJSRendererPlugin } from './three-js-renderer-plugin';
import { UiBridgePlugin } from './ui-bridge-plugin';

export const systemsPlugins = {
  animator: AnimatorPlugin,
  cameraSystem: CameraSystemPlugin,
  collisionBroadcastSystem: CollisionBroadcastSystemPlugin,
  collisionDetectionSystem: CollisionDetectionSystemPlugin,
  collisionSolver: CollisionSolverPlugin,
  constraintSolver: ConstraintSolverPlugin,
  gameStatsMeter: GameStatsMeterPlugin,
  jammer: JammerPlugin,
  keyboardInputSystem: KeyboardInputSystemPlugin,
  keyboardControlSystem: KeyboardControlSystemPlugin,
  mouseControlSystem: MouseControlSystemPlugin,
  mouseInputSystem: MouseInputSystemPlugin,
  mouseInputCoordinatesProjector: MouseInputCoordinatesProjectorPlugin,
  physicsSystem: PhysicsSystemPlugin,
  sceneLoadSystem: SceneLoadSystemPlugin,
  scriptSystem: ScriptSystemPlugin,
  threeJSRenderer: ThreeJSRendererPlugin,
  uiBridge: UiBridgePlugin,
};
