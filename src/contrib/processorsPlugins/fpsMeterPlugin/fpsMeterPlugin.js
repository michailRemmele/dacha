import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import FpsMeter from 'contrib/processors/fpsMeter/fpsMeter';

class FpsMeterPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      frequency,
    } = options;

    return new FpsMeter({
      frequency,
    });
  }
}

export default FpsMeterPlugin;
