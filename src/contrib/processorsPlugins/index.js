import AnimateProcessorPlugin from './animateProcessorPlugin/animateProcessorPlugin';
import CameraProcessorPlugin from './cameraProcessorPlugin/cameraProcessorPlugin';
import CollisionBroadcastProcessorPlugin
  from './collisionBroadcastProcessorPlugin/collisionBroadcastProcessorPlugin';
import CollisionDetectionProcessorPlugin
  from './collisionDetectionProcessorPlugin/collisionDetectionProcessorPlugin';
import CollisionSolverPlugin from './collisionSolverPlugin/collisionSolverPlugin';
import ConstraintSolverPlugin from './constraintSolverPlugin/constraintSolverPlugin';
import FpsMeterPlugin from './fpsMeterPlugin/fpsMeterPlugin';
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
  fpsMeter: FpsMeterPlugin,
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
