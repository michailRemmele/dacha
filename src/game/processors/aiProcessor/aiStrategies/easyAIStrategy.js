import AIStrategy from './aiStrategy';

const SHOT_MSG = 'SHOT';
const MOVEMENT_MSG = 'MOVEMENT';

const PLATFORM_SIZE_NAME = 'platformSize';
const PLAYERS_ENEMIES_NAME = 'playersEnemies';

const TRANSFORM_COMPONENT_NAME = 'transform';
const WEAPON_COMPONENT_NAME = 'weapon';
const COLLIDER_COMPONENT_NAME = 'colliderContainer';

const COOLDOWN = 1000;
const WAYPOINT_ERROR = 1;
const MELEE_RADIUS = 50;
const RETREAT_DISTANCE = 100;

class EasyAIStrategy extends AIStrategy{
  constructor(player, store) {
    super();

    this._player = player;
    this._store = store;

    this._playerId = this._player.getId();
    this._cooldown = this._random(0, COOLDOWN);
    this._distances = [];
    this._waypoint = null;
    this._enemy = null;
  }

  _random(min, max) {
    return Math.floor(min + (Math.random() * (max + 1 - min)));
  }

  _radToDeg(rad) {
    const angleInDegrees = rad * 180 / Math.PI;
    return angleInDegrees < 0 ? angleInDegrees + 360 : angleInDegrees;
  }

  _degToRad(deg) {
    return deg * Math.PI / 180;
  }

  _getAngleBetweenTwoPoints(x1, x2, y1, y2) {
    return Math.atan2(y1 - y2, x1 - x2);
  }

  _getDistanceBetweenTwoPoints(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  _getLinePoint(angle, x, y, length) {
    const angleInRad = this._degToRad(angle);

    return {
      x: x - (length * Math.cos(angleInRad)),
      y: y - (length * Math.sin(angleInRad)),
    };
  }

  _getMovementBoundaries() {
    const { collider } = this._player.getComponent(COLLIDER_COMPONENT_NAME);
    const { centerX, centerY } = collider;
    const { minX, maxX, minY, maxY } = this._store.get(PLATFORM_SIZE_NAME);

    return {
      minX: minX - centerX,
      maxX: maxX - centerX,
      minY: minY - centerY,
      maxY: maxY - centerY,
    };
  }

  _updateDistances() {
    const playerEnemies = this._store.get(PLAYERS_ENEMIES_NAME)[this._playerId];

    this._distances = playerEnemies.map((enemy) => {
      const { offsetX, offsetY } = this._player.getComponent(TRANSFORM_COMPONENT_NAME);
      const { offsetX: enemyX, offsetY: enemyY } = enemy.getComponent(TRANSFORM_COMPONENT_NAME);

      return {
        distance: this._getDistanceBetweenTwoPoints(enemyX, offsetX, enemyY, offsetY),
        enemy,
      };
    });
  }

  _updateEnemy() {
    const playerEnemies = this._store.get(PLAYERS_ENEMIES_NAME)[this._playerId];

    if (!playerEnemies.length) {
      this._enemy = null;
      return;
    }

    this._enemy = playerEnemies[this._random(0, playerEnemies.length - 1)];
  }

  _findWayToRetreat() {
    let moveDirection;

    const { minX, maxX, minY, maxY } = this._getMovementBoundaries();
    const { offsetX, offsetY } = this._player.getComponent(TRANSFORM_COMPONENT_NAME);
    const meleeEnemies = this._distances.filter((item) => item.distance <= MELEE_RADIUS);

    if (!meleeEnemies.length) {
      return;
    }

    const directedEnemies = meleeEnemies.map((item) => {
      const { enemy, distance } = item;
      const { offsetX: enemyX, offsetY: enemyY } = enemy.getComponent(TRANSFORM_COMPONENT_NAME);

      return {
        enemy,
        distance,
        direction: this._radToDeg(
          this._getAngleBetweenTwoPoints(offsetX, enemyX, offsetY, enemyY)
        ),
      };
    });

    if (directedEnemies.length === 1) {
      moveDirection = (directedEnemies[0].direction + 180) % 360;
    } else {
      directedEnemies.sort((a, b) => {
        const { direction: aDirection } = a;
        const { direction: bDirection } = b;

        if (aDirection < bDirection) {
          return -1;
        }
        if (aDirection > bDirection) {
          return 1;
        }
        return 0;
      });

      let gates;
      for (let i = 0; i < directedEnemies.length; i++) {
        const left = directedEnemies[i].direction;
        const right = (i + 1 !== directedEnemies.length)
          ? directedEnemies[i + 1].direction
          : directedEnemies[0].direction + 360;
        const width = right - left;

        if (!gates || (width > gates.width)) {
          gates = {
            left,
            right,
            width,
          };
        }
      }
      const { left, width } = gates;
      moveDirection = (left + (width / 2)) % 360;
    }

    const waypoint = this._getLinePoint(moveDirection, offsetX, offsetY, RETREAT_DISTANCE);

    if (waypoint.x > minX && waypoint.x < maxX && waypoint.y > minY && waypoint.y < maxY) {
      return waypoint;
    }
  }

  _updateWaypoint() {
    const { minX, maxX, minY, maxY } = this._getMovementBoundaries();

    const waypoint = this._findWayToRetreat();

    this._waypoint = waypoint || { x: this._random(minX, maxX), y: this._random(minY, maxY) };
  }

  _attack(messageBus) {
    const weapon = this._player.getComponent(WEAPON_COMPONENT_NAME);

    if (weapon.cooldownRemaining > 0 || !this._enemy) {
      return;
    }

    const { offsetX: enemyX, offsetY: enemyY } = this._enemy.getComponent(TRANSFORM_COMPONENT_NAME);

    messageBus.send({
      gameObject: this._player,
      id: this._player.getId(),
      type: SHOT_MSG,
      x: enemyX,
      y: enemyY,
    });
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

    if (this._cooldown <= 0) {
      this._updateDistances();
      this._updateEnemy();
      this._updateWaypoint();

      this._cooldown += COOLDOWN;
    }

    this._attack(messageBus);
    this._move(messageBus);
  }
}

export default EasyAIStrategy;
