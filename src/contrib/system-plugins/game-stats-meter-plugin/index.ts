import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { GameStatsMeter } from '../../systems/game-stats-meter';

interface GameStatsMeterPluginOptions extends SystemPluginOptions {
  frequency: number;
}

export class GameStatsMeterPlugin implements SystemPlugin {
  load(options: GameStatsMeterPluginOptions) {
    const {
      frequency,
      createEntityObserver,
      messageBus,
    } = options;

    return new GameStatsMeter({
      frequency,
      entityObserver: createEntityObserver({}),
      messageBus,
    });
  }
}
