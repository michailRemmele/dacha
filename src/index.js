import Engine from './engine/engine';

import contribProcessorsPlugins from 'contrib/processorsPlugins';
import gameProcessorsPlugins from 'game/processorsPlugins';
import contribComponents from 'contrib/components';

const options = {
  mainConfig: 'resources/configurations/mainConfig.json',
  processorsPlugins: {
    ...contribProcessorsPlugins,
    ...gameProcessorsPlugins,
  },
  components: {
    ...contribComponents,
  },
};

const engine = new Engine(options);
engine.start();
