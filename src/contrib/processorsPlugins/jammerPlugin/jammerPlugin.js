import ProcessorPlugin from '../../../engine/processorPlugin/processorPlugin';
import Jammer from '../../processors/jammer/jammer';

class JammerPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      messages,
    } = options;

    return new Jammer({
      messages,
    });
  }
}

export default JammerPlugin;
