import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { Animator } from '../../systems/animator';

const RENDERABLE_COMPONENT_NAME = 'renderable';
const ANIMATABLE_COMPONENT_NAME = 'animatable';

export class AnimatorPlugin implements SystemPlugin {
  load(options: SystemPluginOptions): Animator {
    return new Animator({
      entityObserver: options.createEntityObserver({
        components: [
          ANIMATABLE_COMPONENT_NAME,
          RENDERABLE_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
