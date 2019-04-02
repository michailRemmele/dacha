import InputProcessorPlugin from './inputProcessorPlugin/inputProcessorPlugin';
import ControlProcessorPlugin from './controlProcessorPlugin/controlProcessorPlugin';
import MovementProcessorPlugin from './movementProcessorPlugin/movementProcessorPlugin';
import PhysicsProcessorPlugin from './physicsProcessorPlugin/physicsProcessorPlugin';
import AnimateProcessorPlugin from './animateProcessorPlugin/animateProcessorPlugin';
import RenderProcessorPlugin from './renderProcessorPlugin/renderProcessorPlugin';

export default {
  inputProcessor: InputProcessorPlugin,
  controlProcessor: ControlProcessorPlugin,
  movementProcessor: MovementProcessorPlugin,
  physicsProcessor: PhysicsProcessorPlugin,
  animateProcessor: AnimateProcessorPlugin,
  renderProcessor: RenderProcessorPlugin,
};
