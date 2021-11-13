import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import KeyboardControlProcessor
  from '../../processors/keyboardControlProcessor/keyboardControlProcessor';

const CONTROL_COMPONENT_NAME = 'keyboardControl';

export class KeyboardControlProcessorPlugin implements ProcessorPlugin {
  load(options: ProcessorPluginOptions) {
    return new KeyboardControlProcessor({
      gameObjectObserver: options.createGameObjectObserver({
        components: [
          CONTROL_COMPONENT_NAME,
        ],
      }),
    });
  }
}
