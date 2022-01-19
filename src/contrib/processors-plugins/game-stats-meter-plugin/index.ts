import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import { GameStatsMeter } from '../../processors/gameStatsMeter';

interface GameStatsMeterPluginOptions extends ProcessorPluginOptions {
  frequency: number;
}

export class GameStatsMeterPlugin implements ProcessorPlugin {
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
