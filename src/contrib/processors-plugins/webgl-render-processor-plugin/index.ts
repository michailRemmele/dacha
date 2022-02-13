import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import IOC from '../../../engine/ioc/ioc';
import { RESOURCES_LOADER_KEY_NAME } from '../../../engine/consts/global';
import { RenderProcessor, TextureDescriptor } from '../../processors/webgl-render-processor';

const RENDERABLE_COMPONENT_NAME = 'renderable';
const TRANSFORM_COMPONENT_NAME = 'transform';

// TODO: Remove once resource loader will be moved to ts
interface ResourceLoader {
  load: (resource: string) => unknown;
}

interface RenderProcessorPluginOptions extends ProcessorPluginOptions {
  windowNodeId: string;
  textureAtlas: string;
  textureAtlasDescriptor: string;
  backgroundColor: string;
  sortingLayers: Array<string>;
  scaleSensitivity: number;
}

export class RenderProcessorPlugin implements ProcessorPlugin {
  async load(options: RenderProcessorPluginOptions) {
    const resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME) as ResourceLoader;

    const {
      windowNodeId,
      textureAtlas,
      textureAtlasDescriptor,
      backgroundColor,
      sortingLayers,
      scaleSensitivity,
      createGameObjectObserver,
      store,
    } = options;

    const window = document.getElementById(windowNodeId);

    if (!window) {
      throw new Error('Unable to load RenderProcessor. Root canvas node not found');
    }

    const resources = [textureAtlas, textureAtlasDescriptor];
    const loadedResources = await Promise.all(
      resources.map((resource) => resourceLoader.load(resource)),
    ) as [HTMLImageElement, Record<string, TextureDescriptor>];

    return new RenderProcessor({
      window,
      textureAtlas: loadedResources[0],
      textureAtlasDescriptor: loadedResources[1],
      backgroundColor,
      sortingLayers,
      scaleSensitivity,
      gameObjectObserver: createGameObjectObserver({
        components: [
          RENDERABLE_COMPONENT_NAME,
          TRANSFORM_COMPONENT_NAME,
        ],
      }),
      store,
    });
  }
}
