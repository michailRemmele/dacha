import { ProcessorPlugin, ProcessorPluginOptions, Processor } from '../../../engine/processor';
import CameraProcessor from '../../processors/cameraProcessor/cameraProcessor';

const CAMERA_COMPONENT_NAME = 'camera';
const TRANSFORM_COMPONENT_NAME = 'transform';

interface CameraProcessorPluginOptions extends ProcessorPluginOptions {
  initialCamera: string;
  windowNodeId: string;
}

export class CameraProcessorPlugin implements ProcessorPlugin {
  load(options: CameraProcessorPluginOptions) {
    const {
      initialCamera,
      windowNodeId,
      createGameObjectObserver,
      store,
    } = options;

    const window = document.getElementById(windowNodeId);

    return new CameraProcessor({
      initialCamera,
      window,
      gameObjectObserver: createGameObjectObserver({
        components: [
          CAMERA_COMPONENT_NAME,
          TRANSFORM_COMPONENT_NAME,
        ],
      }),
      store,
    });
  }
}
