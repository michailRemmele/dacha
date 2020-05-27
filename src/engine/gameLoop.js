import IOC from './ioc/ioc';
import MessageBus from './messageBus/messageBus';

import { SCENE_PROVIDER_KEY_NAME, SECTIONS } from 'engine/consts/global';
const MS_PER_UPDATE = 1000 / 60;

class GameLoop {
  constructor() {
    this.gameLoopId = null;

    this.sceneProvider = IOC.resolve(SCENE_PROVIDER_KEY_NAME);
    this.messageBus = new MessageBus();
  }

  _processSection(sectionName, options) {
    const currentScene = this.sceneProvider.getCurrentScene();
    const section = currentScene.getProcessorSection(sectionName);

    options = {
      ...(options ? options : {}),
      messageBus: this.messageBus,
    };

    section.forEach((processor) => {
      processor.process(options);
    });
  }

  _gameStateUpdate() {
    if (this.lag < MS_PER_UPDATE) {
      this.messageBus.stash();
      return;
    }

    while (this.lag >= MS_PER_UPDATE) {
      this._processSection(SECTIONS.GAME_STATE_UPDATE_SECTION_NAME, { deltaTime: MS_PER_UPDATE });
      this.lag -= MS_PER_UPDATE;

      if (this.lag >= MS_PER_UPDATE) {
        this.messageBus.stash();
        this.messageBus.sendDelayed();
      }
    }

    this.messageBus.restore();
  }

  run() {
    this.previous = undefined;
    this.lag = MS_PER_UPDATE;

    const that = this;
    this.gameLoopId = requestAnimationFrame(function tick(current) {
      that.previous = that.previous || current;

      const elapsed = current - that.previous;
      that.previous = current;
      that.lag += elapsed;

      that.messageBus.restore();
      that.messageBus.sendDelayed();

      that._processSection(SECTIONS.EVENT_PROCESS_SECTION_NAME);
      that._gameStateUpdate();
      that._processSection(SECTIONS.RENDERING_SECTION_NAME, { deltaTime: elapsed });

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
