import KeyboardInputProcessorPlugin
  from './keyboardInputProcessorPlugin/keyboardInputProcessorPlugin';
import CameraProcessorPlugin from './cameraProcessorPlugin/cameraProcessorPlugin';
import ControlProcessorPlugin from './controlProcessorPlugin/controlProcessorPlugin';
import MouseControlProcessorPlugin from './mouseControlProcessorPlugin/mouseControlProcessorPlugin';
import MouseInputProcessorPlugin from './mouseInputProcessorPlugin/mouseInputProcessorPlugin';
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
  controlProcessor: ControlProcessorPlugin,
  mouseControlProcessor: MouseControlProcessorPlugin,
  mouseInputProcessor: MouseInputProcessorPlugin,
  movementProcessor: MovementProcessorPlugin,
  collisionBroadcastProcessor: CollisionBroadcastProcessorPlugin,
  collisionDetectionProcessor: CollisionDetectionProcessorPlugin,
  physicsProcessor: PhysicsProcessorPlugin,
  animateProcessor: AnimateProcessorPlugin,
  renderProcessor: RenderProcessorPlugin,
};
