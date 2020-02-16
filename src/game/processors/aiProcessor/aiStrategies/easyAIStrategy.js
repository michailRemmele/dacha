import AIStrategy from './aiStrategy';

const SHOT_MSG = 'SHOT';
const MOVEMENT_MSG = 'MOVEMENT';

const PLATFORM_SIZE_NAME = 'platformSize';
const PLAYERS_ENEMIES_NAME = 'playersEnemies';

const TRANSFORM_COMPONENT_NAME = 'transform';
const WEAPON_COMPONENT_NAME = 'weapon';

const COOLDOWN = 1000;
const WAYPOINT_ERROR = 1;

class EasyAIStrategy extends AIStrategy{
  constructor(player, store) {
    super();

    this._player = player;
    this._store = store;

    this._playerId = this._player.getId();
    this._cooldown = this._random(0, COOLDOWN);
    this._waypoint = null;
  }

  _random(min, max) {
    return Math.floor(min + (Math.random() * (max + 1 - min)));
  }

  _attack(messageBus) {
    const playerEnemies = this._store.get(PLAYERS_ENEMIES_NAME)[this._playerId];
    const weapon = this._player.getComponent(WEAPON_COMPONENT_NAME);

    if (!playerEnemies.length || weapon.cooldownRemaining > 0) {
      return;
    }

    const enemy = playerEnemies[this._random(0, playerEnemies.length - 1)];
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

  _updateWaypoint() {
    const { minX, maxX, minY, maxY } = this._store.get(PLATFORM_SIZE_NAME);

    this._waypoint = { x: this._random(minX, maxX), y: this._random(minY, maxY) };
  }

  _move(messageBus) {
    if (!this._waypoint) {
      return;
    }

    const { offsetX, offsetY } = this._player.getComponent(TRANSFORM_COMPONENT_NAME);
    const { x, y } = this._waypoint;

    if (Math.abs(x - offsetX) < WAYPOINT_ERROR && Math.abs(y - offsetY) < WAYPOINT_ERROR) {
      this._waypoint = null;
      return;
    }

    const movementAngle = this._radToDeg(this._getAngleBetweenTwoPoints(
      this._waypoint.x,
      offsetX,
      this._waypoint.y,
      offsetY
    ));

    messageBus.send({
      type: MOVEMENT_MSG,
      gameObject: this._player,
      id: this._player.getId(),
      directionAngle: movementAngle,
    });
  }

  update(messageBus, deltaTime) {
    this._cooldown -= deltaTime;

    if (this._cooldown > 0) {
      this._move(messageBus);
      return;
    }

    this._attack(messageBus);
    this._updateWaypoint();
    this._move(messageBus);

    this._cooldown += COOLDOWN;
  }
}

export default EasyAIStrategy;
