import KeyboardInputProcessorPlugin
  from './keyboardInputProcessorPlugin/keyboardInputProcessorPlugin';
import CameraProcessorPlugin from './cameraProcessorPlugin/cameraProcessorPlugin';
import KeyboardControlProcessorPlugin
  from './keyboardControlProcessorPlugin/keyboardControlProcessorPlugin';
import MouseControlProcessorPlugin from './mouseControlProcessorPlugin/mouseControlProcessorPlugin';
import MouseInputProcessorPlugin from './mouseInputProcessorPlugin/mouseInputProcessorPlugin';
import MouseInputCoordinatesProjectorPlugin
  from './mouseInputCoordinatesProjector/mouseInputCoordinatesProjector';
import MovementProcessorPlugin from './movementProcessorPlugin/movementProcessorPlugin';
import CollisionBroadcastProcessorPlugin
  from './collisionBroadcastProcessorPlugin/collisionBroadcastProcessorPlugin';
import CollisionDetectionProcessorPlugin
  from './collisionDetectionProcessorPlugin/collisionDetectionProcessorPlugin';
import PhysicsProcessorPlugin from './physicsProcessorPlugin/physicsProcessorPlugin';
import AnimateProcessorPlugin from './animateProcessorPlugin/animateProcessorPlugin';
import RenderProcessorPlugin from './renderProcessorPlugin/renderProcessorPlugin';

export default {
  keyboardInputProcessor: KeyboardInputProcessorPlugin,
  cameraProcessor: CameraProcessorPlugin,
  keyboardControlProcessor: KeyboardControlProcessorPlugin,
  mouseControlProcessor: MouseControlProcessorPlugin,
  mouseInputProcessor: MouseInputProcessorPlugin,
  mouseInputCoordinatesProjector: MouseInputCoordinatesProjectorPlugin,
  movementProcessor: MovementProcessorPlugin,
  collisionBroadcastProcessor: CollisionBroadcastProcessorPlugin,
  collisionDetectionProcessor: CollisionDetectionProcessorPlugin,
  physicsProcessor: PhysicsProcessorPlugin,
  animateProcessor: AnimateProcessorPlugin,
  renderProcessor: RenderProcessorPlugin,
};
