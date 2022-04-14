import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { GameStatsMeter } from '../../systems/game-stats-meter';

interface GameStatsMeterPluginOptions extends SystemPluginOptions {
  frequency: number;
}

export class GameStatsMeterPlugin implements SystemPlugin {
  load(options: GameStatsMeterPluginOptions) {
    const {
      frequency,
      createGameObjectObserver,
      messageBus,
    } = options;

    return new GameStatsMeter({
      frequency,
      gameObjectObserver: createGameObjectObserver({}),
      messageBus,
    });
  }
}
