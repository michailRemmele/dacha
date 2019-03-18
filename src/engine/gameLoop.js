const MS_PER_UPDATE = 1000 / 60;

import { SCENE_PROVIDER_KEY_NAME, SECTIONS } from 'engine/consts/global';
import IOC from './ioc/ioc';

class GameLoop {
  constructor() {
    this.previous = performance.now();
    this.lag = 0;
    this.gameLoopId = null;

    this.sceneProvider = IOC.resolve(SCENE_PROVIDER_KEY_NAME);
  }

  _processSection(section, params) {
    section.forEach((processor) => {
      processor.process(params);
    });
  }

  run() {
    let that = this;
    this.gameLoopId = requestAnimationFrame(function tick(current) {
      const currentScene = that.sceneProvider.getCurrentScene();
      const eventProcessSection = currentScene.getProcessorsSection(
        SECTIONS.EVENT_PROCESS_SECTION_NAME
      );
      const gameStateUpdateSection = currentScene.getProcessorsSection(
        SECTIONS.EVENT_PROCESS_SECTION_NAME
      );
      const renderingSection = currentScene.getProcessorsSection(
        SECTIONS.RENDERING_SECTION_NAME
      );

      let elapsed = current - that.previous;
      that.previous = current;
      that.lag += elapsed;

      that._processSection(eventProcessSection);

      while (that.lag >= MS_PER_UPDATE) {
        that._processSection(gameStateUpdateSection);
        that.lag -= MS_PER_UPDATE;
      }

      that._processSection(renderingSection, that.lag / MS_PER_UPDATE);
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
