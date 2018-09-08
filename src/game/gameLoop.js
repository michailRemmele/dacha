const MS_PER_UPDATE = 1000 / 60;

import InputProcessor from './inputSystem/inputProcessor';

class GameLoop {
  constructor() {
    this.previous = performance.now();
    this.lag = 0;
    this.gameLoopId = null;

    this.inputProcessor = new InputProcessor();
  }

  _update() {
    // Update game state
  }

  _render() {
    // Render game screen
  }

  run() {
    this.inputProcessor.run();

    let that = this;
    this.gameLoopId = requestAnimationFrame(function tick(current) {
      let elapsed = current - that.previous;
      that.previous = current;
      that.lag += elapsed;

      that.inputProcessor.process();

      while (that.lag >= MS_PER_UPDATE) {
        that._update();
        that.lag -= MS_PER_UPDATE;
      }

      that._render(that.lag / MS_PER_UPDATE);
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
