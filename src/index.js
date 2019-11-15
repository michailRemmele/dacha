import Engine from './engine/engine';

import mainConfig from 'resources/configurations/mainConfig.json';
import contribProcessorsPlugins from 'contrib/processorsPlugins';
import gameProcessorsPlugins from 'game/processorsPlugins';
import contribComponents from 'contrib/components';
import gameComponents from 'game/components';

const options = {
  mainConfig: mainConfig,
  processorsPlugins: {
    ...contribProcessorsPlugins,
    ...gameProcessorsPlugins,
  },
  components: {
    ...contribComponents,
    ...gameComponents,
  },
};

const engine = new Engine(options);
engine.start();
