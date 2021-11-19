import MessageBus from './messageBus/messageBus';

class GameLoop {
  constructor(sceneProvider) {
    this.gameLoopId = null;

    this.sceneProvider = sceneProvider;
    this.messageBus = new MessageBus();

    this.bindedTick = this._tick.bind(this);
  }

  _tick() {
    const current = performance.now();

    const elapsed = current - this.previous;

    this.messageBus.sendDelayed();

    const currentScene = this.sceneProvider.getCurrentScene();
    const options = {
      deltaTime: elapsed,
      messageBus: this.messageBus,
    };

    currentScene.getProcessors().forEach((processor) => {
      processor.process(options);
    });

    this.messageBus.clear();

    this.previous = current;

    this.gameLoopId = requestAnimationFrame(this.bindedTick);
  }

  run() {
    this.previous = performance.now();

    this.gameLoopId = requestAnimationFrame(this.bindedTick);
  }

  stop() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
  }
}

export default GameLoop;
