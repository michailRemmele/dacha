import { AnimateProcessorPlugin } from './animate-processor-plugin';
import { CameraProcessorPlugin } from './camera-processor-plugin';
import { CollisionBroadcastProcessorPlugin } from './collision-broadcast-processor-plugin';
import { CollisionDetectionProcessorPlugin } from './collision-detection-processor-plugin';
import { CollisionSolverPlugin } from './collision-solver-plugin';
import { ConstraintSolverPlugin } from './constraint-solver-plugin';
import { GameStatsMeterPlugin } from './game-stats-meter-plugin';
import { JammerPlugin } from './jammer-plugin';
import { KeyboardInputProcessorPlugin } from './keyboard-input-processor-plugin';
import { KeyboardControlProcessorPlugin } from './keyboard-control-processor-plugin';
import { MouseControlProcessorPlugin } from './mouse-control-processor-plugin';
import { MouseInputProcessorPlugin } from './mouse-input-processor-plugin';
import { MouseInputCoordinatesProjectorPlugin } from './mouse-input-coordinates-projector';
import { PhysicsProcessorPlugin } from './physics-processor-plugin';
import { RenderProcessorPlugin } from './render-processor-plugin';
import { SceneLoadProcessorPlugin } from './scene-load-processor-plugin';
import { ScriptProcessorPlugin } from './script-processor-plugin';
import { ThreeJSRendererPlugin } from './three-js-renderer-plugin';
import { UiBridgePlugin } from './ui-bridge-plugin';

export const processorsPlugins = {
  animateProcessor: AnimateProcessorPlugin,
  cameraProcessor: CameraProcessorPlugin,
  collisionBroadcastProcessor: CollisionBroadcastProcessorPlugin,
  collisionDetectionProcessor: CollisionDetectionProcessorPlugin,
  collisionSolver: CollisionSolverPlugin,
  constraintSolver: ConstraintSolverPlugin,
  gameStatsMeter: GameStatsMeterPlugin,
  jammer: JammerPlugin,
  keyboardInputProcessor: KeyboardInputProcessorPlugin,
  keyboardControlProcessor: KeyboardControlProcessorPlugin,
  mouseControlProcessor: MouseControlProcessorPlugin,
  mouseInputProcessor: MouseInputProcessorPlugin,
  mouseInputCoordinatesProjector: MouseInputCoordinatesProjectorPlugin,
  physicsProcessor: PhysicsProcessorPlugin,
  renderProcessor: RenderProcessorPlugin,
  sceneLoadProcessor: SceneLoadProcessorPlugin,
  scriptProcessor: ScriptProcessorPlugin,
  threeJSRenderer: ThreeJSRendererPlugin,
  uiBridge: UiBridgePlugin,
};
