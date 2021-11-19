import MessageBus from './messageBus/messageBus';

class GameLoop {
  constructor(sceneProvider) {
    this.gameLoopId = null;

    this.sceneProvider = sceneProvider;
    this.messageBus = new MessageBus();
  }

  run() {
    this.previous = undefined;

    const that = this;
    this.gameLoopId = requestAnimationFrame(function tick(current) {
      that.previous = that.previous || current;

      const elapsed = current - that.previous;
      that.previous = current;

      that.messageBus.sendDelayed();

      const currentScene = that.sceneProvider.getCurrentScene();
      const options = {
        deltaTime: elapsed,
        messageBus: that.messageBus,
      };

      currentScene.getProcessors().forEach((processor) => {
        processor.process(options);
      });

      that.messageBus.clear();
      that.gameLoopId = requestAnimationFrame(tick);
    });
  }

  stop() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
  }
}

export default GameLoop;
