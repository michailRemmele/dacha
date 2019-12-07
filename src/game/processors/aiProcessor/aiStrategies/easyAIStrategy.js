import AIStrategy from './aiStrategy';

const PLATFORM_SIZE_NAME = 'platformSize';
const PLAYERS_ENEMIES_NAME = 'playersEnemies';

class EasyAIStrategy extends AIStrategy{
  constructor(player, store) {
    super();

    this._player = player;
    this._store = store;

    this._playerId = this._player.getId();
  }

  update(messageBus, deltaTime) {
    const platformSize = this._store.get(PLATFORM_SIZE_NAME);
    const playerEnemies = this._store.get(PLAYERS_ENEMIES_NAME)[this._playerId];
  }
}

export default EasyAIStrategy;
