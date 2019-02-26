import processors from 'game/processors';

import { RESOURCES_LOADER_KEY_NAME } from 'consts/global';
import IOC from 'core/ioc/ioc';

class ProcessorLoader {
  constructor() {
    this.resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME);
  }


  load(name, resources) {
    const Processor = processors[name];

    if (!resources) {
      return Promise.resolve(new Processor());
    }

    const loadableResources = Object.keys(resources).reduce((loadable, name) => {
      loadable.push(this.resourceLoader.load(resources[name])
        .then((resource) => {
          return {
            name: name,
            resource: resource,
          };
        })
      );

      return loadable;
    }, []);

    return Promise.all(loadableResources)
      .then((loadedResourcesInfo) => {
        const resources = loadedResourcesInfo.reduce((resources, resourceInfo) => {
          resources[resourceInfo.name] = resourceInfo.resource;
          return resources;
        }, {});

        return new Processor(resources);
      });
  }
}

export default ProcessorLoader;
