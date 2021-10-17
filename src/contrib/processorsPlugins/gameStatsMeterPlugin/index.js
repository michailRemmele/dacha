import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import { GameStatsMeter } from 'contrib/processors/gameStatsMeter';

export class GameStatsMeterPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      frequency,
      gameObjectObserver,
    } = options;

    return new GameStatsMeter({
      frequency,
      gameObjectObserver,
    });
  }
}
