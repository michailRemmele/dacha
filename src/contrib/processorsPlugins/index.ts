import { AnimateProcessorPlugin } from './animate-processor-plugin';
import { CameraProcessorPlugin } from './camera-processor-plugin';
import { CollisionBroadcastProcessorPlugin } from './collision-broadcast-processor-plugin';
import { CollisionDetectionProcessorPlugin } from './collision-detection-processor-plugin';
import { CollisionSolverPlugin } from './collision-solver-plugin';
import { ConstraintSolverPlugin } from './constraint-solver-plugin';
import { GameStatsMeterPlugin } from './gameStatsMeterPlugin';
import JammerPlugin from './jammerPlugin/jammerPlugin';
import KeyboardInputProcessorPlugin
  from './keyboardInputProcessorPlugin/keyboardInputProcessorPlugin';
import KeyboardControlProcessorPlugin
  from './keyboardControlProcessorPlugin/keyboardControlProcessorPlugin';
import MouseControlProcessorPlugin from './mouseControlProcessorPlugin/mouseControlProcessorPlugin';
import MouseInputProcessorPlugin from './mouseInputProcessorPlugin/mouseInputProcessorPlugin';
import MouseInputCoordinatesProjectorPlugin
  from './mouseInputCoordinatesProjector/mouseInputCoordinatesProjector';
import PhysicsProcessorPlugin from './physicsProcessorPlugin/physicsProcessorPlugin';
import RenderProcessorPlugin from './renderProcessorPlugin/renderProcessorPlugin';
import SceneLoadProcessorPlugin from './sceneLoadProcessorPlugin/sceneLoadProcessorPlugin';
import ScriptProcessorPlugin from './scriptProcessorPlugin/scriptProcessorPlugin';
import UiBridgePlugin from './uiBridgePlugin/uiBridgePlugin';

export default {
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
  uiBridge: UiBridgePlugin,
};
