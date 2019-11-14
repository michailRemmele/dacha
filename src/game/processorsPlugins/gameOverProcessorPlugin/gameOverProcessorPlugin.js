import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import GameOverProcessor from 'game/processors/gameOverProcessor/gameOverProcessor';

class GameOverProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      gameObjectObserver,
      restartScene,
    } = options;

    return new GameOverProcessor({
      gameObjectObserver: gameObjectObserver,
      restartScene: restartScene,
    });
  }
}

export default GameOverProcessorPlugin;
