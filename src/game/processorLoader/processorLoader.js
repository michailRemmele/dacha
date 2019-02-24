import processors from 'game/processors';

import ResourceLoader from './resourceLoader/resourceLoader';

class ProcessorLoader {
  constructor() {
    this.resourceLoader = new ResourceLoader();
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
