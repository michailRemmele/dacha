const GAME_STATS_UPDATE_MSG = 'GAME_STATS_UPDATE';
const MS_IN_SEC = 1000;

export class GameStatsMeter {
  constructor(options) {
    this._frequency = options.frequency || MS_IN_SEC;
    this._entityObserver = options.entityObserver;
    this.messageBus = options.messageBus;

    this._fps = 0;
    this._time = 0;
    this._messages = 0;

    this._skippedStateUpdate = 0;
    this._executedStateUpdate = 0;
  }

  update(options) {
    const {
      deltaTime, skipped, executed,
    } = options;

    this._fps += 1;
    this._time += deltaTime;
    this._messages += this.messageBus.getMessageCount();

    if (skipped) {
      this._skippedStateUpdate += 1;
    } else {
      this._executedStateUpdate += executed;
    }

    if (this._time >= this._frequency) {
      this.messageBus.send({
        type: GAME_STATS_UPDATE_MSG,
        fps: (this._fps * MS_IN_SEC) / this._time,
        entitiesCount: this._entityObserver.size(),
        messagesCount: (this._messages * MS_IN_SEC) / this._time,
        skippedStateUpdate: (this._skippedStateUpdate * MS_IN_SEC) / this._time,
        executedStateUpdate: (this._executedStateUpdate * MS_IN_SEC) / this._time,
      });

      this._fps = 0;
      this._time = 0;
      this._messages = 0;

      this._skippedStateUpdate = 0;
      this._executedStateUpdate = 0;
    }
  }
}
