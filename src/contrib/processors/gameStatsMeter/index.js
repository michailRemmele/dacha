import Processor from 'engine/processor/processor';

const GAME_STATS_UPDATE_MSG = 'GAME_STATS_UPDATE';
const MS_IN_SEC = 1000;

export class GameStatsMeter extends Processor {
  constructor(options) {
    super();

    this._frequency = options.frequency || MS_IN_SEC;
    this._gameObjectObserver = options.gameObjectObserver;

    this._fps = 0;
    this._time = 0;
  }

  process(options) {
    const { messageBus, deltaTime } = options;

    this._fps += 1;
    this._time += deltaTime;

    if (this._time >= this._frequency) {
      messageBus.send({
        type: GAME_STATS_UPDATE_MSG,
        fps: this._fps * MS_IN_SEC / this._time,
        gameObjectsCount: this._gameObjectObserver.size(),
        messagesCount: messageBus.getMessageCount(),
      });

      this._fps = 0;
      this._time = 0;
    }
  }
}
