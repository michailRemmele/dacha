import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import UiBridge from 'contrib/processors/uiBridge/uiBridge';

class UiBridgePlugin extends ProcessorPlugin {
  async load(options) {
    const { helpers } = options;
    await helpers.loadUiApp();

    return new UiBridge({});
  }
}

export default UiBridgePlugin;
