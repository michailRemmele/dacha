import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import GameOverProcessor from 'game/processors/gameOverProcessor/gameOverProcessor';

class GameOverProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new GameOverProcessor({
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default GameOverProcessorPlugin;
