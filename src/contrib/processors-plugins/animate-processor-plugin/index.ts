import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import AnimateProcessor from '../../processors/animateProcessor/animateProcessor';

const RENDERABLE_COMPONENT_NAME = 'renderable';
const ANIMATABLE_COMPONENT_NAME = 'animatable';

export class AnimateProcessorPlugin implements ProcessorPlugin {
  load(options: ProcessorPluginOptions) {
    return new AnimateProcessor({
      gameObjectObserver: options.createGameObjectObserver({
        components: [
          ANIMATABLE_COMPONENT_NAME,
          RENDERABLE_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
