import Processor from 'engine/processor/processor';

const PLAYERS_ENEMIES_NAME = 'playersEnemies';

class EnemiesDetector extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._store = options.store;

    this._playersCount = 0;
  }

  _scan() {
    this._playersCount = this._gameObjectObserver.size();

    const playersEnemies = {};

    for (let i = 0; i < this._playersCount; i++) {
      const playerId = this._gameObjectObserver.getByIndex(i).getId();
      playersEnemies[playerId] = [];

      for (let j = 0; j < this._playersCount; j++) {
        if (i !== j) {
          playersEnemies[playerId].push(this._gameObjectObserver.getByIndex(j));
        }
      }
    }

    this._store.set(PLAYERS_ENEMIES_NAME, playersEnemies);
  }

  processorDidMount() {
    this._scan();
  }

  process(options) {
    if (this._playersCount !== this._gameObjectObserver.size()) {
      this._scan();
    }
  }
}

export default EnemiesDetector;
