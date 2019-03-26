import IOC from './ioc/ioc';
import MessageBus from './messageBus/messageBus';

import { SCENE_PROVIDER_KEY_NAME, SECTIONS } from 'engine/consts/global';
const MS_PER_UPDATE = 1000 / 60;

class GameLoop {
  constructor() {
    this.previous = performance.now();
    this.lag = 0;
    this.gameLoopId = null;

    this.sceneProvider = IOC.resolve(SCENE_PROVIDER_KEY_NAME);
    this.messageBus = new MessageBus();
  }

  _processSection(section, options) {
    options = {
      ...(options ? options : {}),
      messageBus: this.messageBus,
    };

    section.forEach((processor) => {
      processor.process(options);
    });
  }

  run() {
    let that = this;
    this.gameLoopId = requestAnimationFrame(function tick(current) {
      const currentScene = that.sceneProvider.getCurrentScene();
      const eventProcessSection = currentScene.getProcessorSection(
        SECTIONS.EVENT_PROCESS_SECTION_NAME
      );
      const gameStateUpdateSection = currentScene.getProcessorSection(
        SECTIONS.EVENT_PROCESS_SECTION_NAME
      );
      const renderingSection = currentScene.getProcessorSection(
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

      that._processSection(renderingSection, { step: that.lag / MS_PER_UPDATE });

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
