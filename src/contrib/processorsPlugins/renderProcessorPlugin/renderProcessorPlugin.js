import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';
import IOC from 'engine/ioc/ioc';
import { RESOURCES_LOADER_KEY_NAME } from 'engine/consts/global';

import RenderProcessor from 'contrib/processors/renderProcessor/renderProcessor';

class InputProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME);

    const window = document.getElementById(options.windowNodeId);
    const resources = [ options.textureAtlas, options.textureAtlasDescriptor ];
    const loadedResources = await Promise.all(resources.map((resource) => {
      return resourceLoader.load(resource);
    }));

    return new RenderProcessor(window, loadedResources[0], loadedResources[1]);
  }
}

export default InputProcessorPlugin;
