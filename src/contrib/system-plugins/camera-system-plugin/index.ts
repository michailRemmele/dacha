import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { CameraSystem } from '../../systems/camera-system';

const CAMERA_COMPONENT_NAME = 'camera';
const TRANSFORM_COMPONENT_NAME = 'transform';

interface CameraSystemPluginOptions extends SystemPluginOptions {
  initialCamera: string;
  windowNodeId: string;
}

export class CameraSystemPlugin implements SystemPlugin {
  load(options: CameraSystemPluginOptions) {
    const {
      initialCamera,
      windowNodeId,
      createEntityObserver,
      store,
      messageBus,
    } = options;

    const windowNode = document.getElementById(windowNodeId) || window;

    return new CameraSystem({
      initialCamera,
      window: windowNode,
      entityObserver: createEntityObserver({
        components: [
          CAMERA_COMPONENT_NAME,
          TRANSFORM_COMPONENT_NAME,
        ],
      }),
      store,
      messageBus,
    });
  }
}
