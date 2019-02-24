const MS_PER_UPDATE = 1000 / 60;

import { SECTIONS } from 'consts/global';
import IOC from 'core/ioc/ioc';

class GameLoop {
  constructor() {
    this.previous = performance.now();
    this.lag = 0;
    this.gameLoopId = null;

    this.eventProcessSection = IOC.resolve(SECTIONS.EVENT_PROCESS_SECTION_NAME);
    this.gameStateUpdateSection = IOC.resolve(SECTIONS.GAME_STATE_UPDATE_SECTION_NAME);
    this.renderingSection = IOC.resolve(SECTIONS.RENDERING_SECTION_NAME);
  }

  _processSection(section, params) {
    section.forEach((processor) => {
      processor.process(params);
    });
  }

  run() {
    let that = this;
    this.gameLoopId = requestAnimationFrame(function tick(current) {
      let elapsed = current - that.previous;
      that.previous = current;
      that.lag += elapsed;

      that._processSection(that.eventProcessSection);

      while (that.lag >= MS_PER_UPDATE) {
        that._processSection(that.gameStateUpdateSection);
        that.lag -= MS_PER_UPDATE;
      }

      that._processSection(that.renderingSection, that.lag / MS_PER_UPDATE);
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
