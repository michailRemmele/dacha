import Engine from './engine/engine';

import mainConfig from 'resources/configurations/mainConfig.json';
import contribProcessorsPlugins from 'contrib/processorsPlugins';
import gameProcessorsPlugins from 'game/processorsPlugins';
import contribComponents from 'contrib/components';
import gameComponents from 'game/components';
import pluginHelpers from 'pluginHelpers';

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
  pluginHelpers: {
    ...pluginHelpers,
  },
};

const engine = new Engine(options);
engine.start();

console.log('Hello! You can contact the author via email: mikhail.remmele@gmail.com');
