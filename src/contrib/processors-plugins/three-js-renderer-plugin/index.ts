import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import { ThreeJSRenderer } from '../../processors/three-js-renderer';

const RENDERABLE_COMPONENT_NAME = 'renderable';
const TRANSFORM_COMPONENT_NAME = 'transform';

interface ThreeJSRendererPluginOptions extends ProcessorPluginOptions {
  windowNodeId: string
  sortingLayers: Array<string>
}

export class ThreeJSRendererPlugin implements ProcessorPlugin {
  load(options: ThreeJSRendererPluginOptions) {
    const {
      createGameObjectObserver,
      store,
      windowNodeId,
      sortingLayers,
    } = options;

    const window = document.getElementById(windowNodeId);

    if (!window) {
      throw new Error('Unable to load RenderProcessor. Root canvas node not found');
    }

    return new ThreeJSRenderer({
      gameObjectObserver: createGameObjectObserver({
        components: [
          RENDERABLE_COMPONENT_NAME,
          TRANSFORM_COMPONENT_NAME,
        ],
      }),
      store,
      window,
      sortingLayers,
    });
  }
}
