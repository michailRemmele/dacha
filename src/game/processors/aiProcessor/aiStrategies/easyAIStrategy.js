import AIStrategy from './aiStrategy';

const SHOT_MSG = 'SHOT';
const MOVEMENT_MSG = 'MOVEMENT';

const PLATFORM_SIZE_NAME = 'platformSize';
const PLAYERS_ENEMIES_NAME = 'playersEnemies';

const TRANSFORM_COMPONENT_NAME = 'transform';
const WEAPON_COMPONENT_NAME = 'weapon';

class EasyAIStrategy extends AIStrategy{
  constructor(player, store) {
    super();

    this._player = player;
    this._store = store;

    this._playerId = this._player.getId();
  }

  _attack(messageBus) {
    const playerEnemies = this._store.get(PLAYERS_ENEMIES_NAME)[this._playerId];
    const weapon = this._player.getComponent(WEAPON_COMPONENT_NAME);

    if (!playerEnemies.length || weapon.cooldownRemaining > 0) {
      return;
    }

    const enemy = playerEnemies[Math.floor(Math.random() * playerEnemies.length)];
    const { offsetX: enemyX, offsetY: enemyY } = enemy.getComponent(TRANSFORM_COMPONENT_NAME);

    messageBus.send({
      gameObject: this._player,
      id: this._player.getId(),
      type: SHOT_MSG,
      x: enemyX,
      y: enemyY,
    });
  }

  _getAngleBetweenTwoPoints(x1, x2, y1, y2) {
    return Math.atan2(y1 - y2, x1 - x2);
  }

  _radToDeg(rad) {
    const angleInDegrees = rad * 180 / Math.PI;
    return angleInDegrees < 0 ? angleInDegrees + 360 : angleInDegrees;
  }

  _move(messageBus) {
    const playerEnemies = this._store.get(PLAYERS_ENEMIES_NAME)[this._playerId];
    const mainEnemy = playerEnemies.find((enemy) => {
      return enemy.getId() === '1';
    });

    if (!mainEnemy) {
      return;
    }

    const mainEnemyPosition = mainEnemy.getComponent(TRANSFORM_COMPONENT_NAME);
    const playerPosition = this._player.getComponent(TRANSFORM_COMPONENT_NAME);
    const movementAngle = this._radToDeg(this._getAngleBetweenTwoPoints(
      mainEnemyPosition.offsetX,
      playerPosition.offsetX,
      mainEnemyPosition.offsetY,
      playerPosition.offsetY
    ));

    messageBus.send({
      type: MOVEMENT_MSG,
      gameObject: this._player,
      id: this._player.getId(),
      directionAngle: movementAngle,
    });
  }

  update(messageBus, deltaTime) {
    const platformSize = this._store.get(PLATFORM_SIZE_NAME);

    this._attack(messageBus);
    this._move(messageBus);
  }
}

export default EasyAIStrategy;
