import InputProcessorPlugin from './inputProcessorPlugin/inputProcessorPlugin';
import CameraProcessorPlugin from './cameraProcessorPlugin/cameraProcessorPlugin';
import ControlProcessorPlugin from './controlProcessorPlugin/controlProcessorPlugin';
import MovementProcessorPlugin from './movementProcessorPlugin/movementProcessorPlugin';
import CollisionBroadcastProcessorPlugin
  from './collisionBroadcastProcessorPlugin/collisionBroadcastProcessorPlugin';
import CollisionDetectionProcessorPlugin
  from './collisionDetectionProcessorPlugin/collisionDetectionProcessorPlugin';
import PhysicsProcessorPlugin from './physicsProcessorPlugin/physicsProcessorPlugin';
import AnimateProcessorPlugin from './animateProcessorPlugin/animateProcessorPlugin';
import RenderProcessorPlugin from './renderProcessorPlugin/renderProcessorPlugin';

export default {
  inputProcessor: InputProcessorPlugin,
  cameraProcessor: CameraProcessorPlugin,
  controlProcessor: ControlProcessorPlugin,
  movementProcessor: MovementProcessorPlugin,
  collisionBroadcastProcessor: CollisionBroadcastProcessorPlugin,
  collisionDetectionProcessor: CollisionDetectionProcessorPlugin,
  physicsProcessor: PhysicsProcessorPlugin,
  animateProcessor: AnimateProcessorPlugin,
  renderProcessor: RenderProcessorPlugin,
};
