import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';
import IOC from 'engine/ioc/ioc';
import { RESOURCES_LOADER_KEY_NAME } from 'engine/consts/global';

import RenderProcessor from 'contrib/processors/renderProcessor/renderProcessor';

class InputProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME);

    const {
      windowNodeId,
      textureAtlas,
      textureAtlasDescriptor,
      backgroundColor,
      scene,
      sortingLayers,
    } = options;

    const window = document.getElementById(windowNodeId);
    const resources = [ textureAtlas, textureAtlasDescriptor ];
    const loadedResources = await Promise.all(resources.map((resource) => {
      return resourceLoader.load(resource);
    }));

    return new RenderProcessor({
      window: window,
      textureAtlas: loadedResources[0],
      textureAtlasDescriptor: loadedResources[1],
      backgroundColor: backgroundColor,
      scene: scene,
      sortingLayers: sortingLayers,
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default InputProcessorPlugin;
