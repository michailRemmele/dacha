import InputProcessorPlugin from './inputProcessorPlugin/inputProcessorPlugin';
import ControlProcessorPlugin from './controlProcessorPlugin/controlProcessorPlugin';
import AnimateProcessorPlugin from './animateProcessorPlugin/animateProcessorPlugin';
import RenderProcessorPlugin from './renderProcessorPlugin/renderProcessorPlugin';

export default {
  inputProcessor: InputProcessorPlugin,
  controlProcessor: ControlProcessorPlugin,
  animateProcessor: AnimateProcessorPlugin,
  renderProcessor: RenderProcessorPlugin,
};
