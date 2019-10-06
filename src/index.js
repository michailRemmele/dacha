import Engine from './engine/engine';

import contribProcessorsPlugins from 'contrib/processorsPlugins';
import gameProcessorsPlugins from 'game/processorsPlugins';
import contribComponents from 'contrib/components';
import gameComponents from 'game/components';

const options = {
  mainConfig: 'resources/configurations/mainConfig.json',
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
