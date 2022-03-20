import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import { Animator } from '../../processors/animator';

const RENDERABLE_COMPONENT_NAME = 'renderable';
const ANIMATABLE_COMPONENT_NAME = 'animatable';

export class AnimatorPlugin implements ProcessorPlugin {
  load(options: ProcessorPluginOptions): Animator {
    return new Animator({
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
