import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import Reaper from 'game/processors/reaper/reaper';

class ReaperPlugin extends ProcessorPlugin {
  async load(options) {
    return new Reaper({
      gameObjectObserver: options.gameObjectObserver,
      gameObjectDestroyer: options.gameObjectDestroyer,
    });
  }
}

export default ReaperPlugin;
