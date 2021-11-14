import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import MouseControlProcessor from '../../processors/mouseControlProcessor/mouseControlProcessor';

const CONTROL_COMPONENT_NAME = 'mouseControl';

export class MouseControlProcessorPlugin implements ProcessorPlugin {
  load(options: ProcessorPluginOptions) {
    return new MouseControlProcessor({
      gameObjectObserver: options.createGameObjectObserver({
        components: [
          CONTROL_COMPONENT_NAME,
        ],
      }),
    });
  }
}
