import InputProcessorPlugin from './inputProcessorPlugin/inputProcessorPlugin';
import ControlProcessorPlugin from './controlProcessorPlugin/controlProcessorPlugin';
import MovementProcessorPlugin from './movementProcessorPlugin/movementProcessorPlugin';
import CollisionProcessorPlugin from './collisionProcessorPlugin/collisionProcessorPlugin';
import PhysicsProcessorPlugin from './physicsProcessorPlugin/physicsProcessorPlugin';
import AnimateProcessorPlugin from './animateProcessorPlugin/animateProcessorPlugin';
import RenderProcessorPlugin from './renderProcessorPlugin/renderProcessorPlugin';

export default {
  inputProcessor: InputProcessorPlugin,
  controlProcessor: ControlProcessorPlugin,
  movementProcessor: MovementProcessorPlugin,
  collisionProcessor: CollisionProcessorPlugin,
  physicsProcessor: PhysicsProcessorPlugin,
  animateProcessor: AnimateProcessorPlugin,
  renderProcessor: RenderProcessorPlugin,
};
