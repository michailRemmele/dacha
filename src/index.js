import Engine from './engine/engine';

import contribProcessorsPlugins from 'contrib/processorsPlugins';
import contribComponents from 'contrib/components';

const options = {
  mainConfig: 'resources/configurations/mainConfig.json',
  processorsPlugins: {
    ...contribProcessorsPlugins,
  },
  components: {
    ...contribComponents,
  },
};

const engine = new Engine(options);
engine.start();
