import AnimateProcessorPlugin from './animateProcessorPlugin/animateProcessorPlugin';
import CameraProcessorPlugin from './cameraProcessorPlugin/cameraProcessorPlugin';
import CollisionBroadcastProcessorPlugin
  from './collisionBroadcastProcessorPlugin/collisionBroadcastProcessorPlugin';
import CollisionDetectionProcessorPlugin
  from './collisionDetectionProcessorPlugin/collisionDetectionProcessorPlugin';
import JammerPlugin from './jammerPlugin/jammerPlugin';
import KeyboardInputProcessorPlugin
  from './keyboardInputProcessorPlugin/keyboardInputProcessorPlugin';
import KeyboardControlProcessorPlugin
  from './keyboardControlProcessorPlugin/keyboardControlProcessorPlugin';
import MouseControlProcessorPlugin from './mouseControlProcessorPlugin/mouseControlProcessorPlugin';
import MouseInputProcessorPlugin from './mouseInputProcessorPlugin/mouseInputProcessorPlugin';
import MouseInputCoordinatesProjectorPlugin
  from './mouseInputCoordinatesProjector/mouseInputCoordinatesProjector';
import MovementProcessorPlugin from './movementProcessorPlugin/movementProcessorPlugin';
import PhysicsProcessorPlugin from './physicsProcessorPlugin/physicsProcessorPlugin';
import RenderProcessorPlugin from './renderProcessorPlugin/renderProcessorPlugin';
import SceneLoadProcessorPlugin from './sceneLoadProcessorPlugin/sceneLoadProcessorPlugin';

export default {
  animateProcessor: AnimateProcessorPlugin,
  cameraProcessor: CameraProcessorPlugin,
  collisionBroadcastProcessor: CollisionBroadcastProcessorPlugin,
  collisionDetectionProcessor: CollisionDetectionProcessorPlugin,
  jammer: JammerPlugin,
  keyboardInputProcessor: KeyboardInputProcessorPlugin,
  keyboardControlProcessor: KeyboardControlProcessorPlugin,
  mouseControlProcessor: MouseControlProcessorPlugin,
  mouseInputProcessor: MouseInputProcessorPlugin,
  mouseInputCoordinatesProjector: MouseInputCoordinatesProjectorPlugin,
  movementProcessor: MovementProcessorPlugin,
  physicsProcessor: PhysicsProcessorPlugin,
  renderProcessor: RenderProcessorPlugin,
  sceneLoadProcessor: SceneLoadProcessorPlugin,
};
