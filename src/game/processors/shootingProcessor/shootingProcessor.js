import Vector2 from 'utils/vector/vector2';
import Processor from 'engine/processor/processor';

const DAMAGE_MSG = 'DAMAGE';
const TRIGGER_ENTER_MSG = 'TRIGGER_ENTER';
const SHOT_MSG = 'SHOT';
const ADD_FORCE_MSG = 'ADD_FORCE';
const SHOT_POWER = 'shotPower';
const PUSH_POWER = 'pushPower';

const TRANSFORM_COMPONENT_NAME = 'transform';
const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const WEAPON_COMPONENT_NAME = 'weapon';
const HEALTH_COMPONENT_NAME = 'health';

const ACCELERATION_DURATION = 10;
const ACCELERATION_DURATION_IN_SEC = ACCELERATION_DURATION / 1000;

class ShootingProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectSpawner = options.gameObjectSpawner;

    this._firedBullets = [];
  }

  _radToDeg(rad) {
    const angleInDegrees = rad * 180 / Math.PI;
    return angleInDegrees < 0 ? angleInDegrees + 360 : angleInDegrees;
  }

  _fixCalcError(value) {
    return Math.abs(value) < Number.EPSILON ? 0 : value;
  }

  _getVectorByAngle(angle) {
    const x = this._fixCalcError(Math.cos(angle));
    const y = this._fixCalcError(Math.sin(angle));

    return new Vector2(x, y);
  }

  _getAngleBetweenTwoPoints(x1, x2, y1, y2) {
    return Math.atan2(y1 - y2, x1 - x2);
  }

  _pushTarget(target, directionVector, messageBus) {
    messageBus.send({
      type: ADD_FORCE_MSG,
      name: PUSH_POWER,
      value: directionVector,
      duration: ACCELERATION_DURATION,
      gameObject: target,
      id: target.getId(),
    });
  }

  process(options) {
    const messageBus = options.messageBus;

    this._firedBullets = this._firedBullets.filter((entry) => {
      const { shooter, bullet, directionVector } = entry;
      const bulletId = bullet.getId();

      const collisionMessages = messageBus.getById(TRIGGER_ENTER_MSG, bulletId) || [];
      return collisionMessages.every((message) => {
        const { otherGameObject: targetHitBox } = message;

        const target = targetHitBox.getParent();
        const targetHealth = targetHitBox.getComponent(HEALTH_COMPONENT_NAME);

        if (!target || !targetHealth) {
          return true;
        }

        const targetId = target.getId();

        if (shooter.getId() === targetId) {
          return true;
        }

        const bulletHealth = bullet.getComponent(HEALTH_COMPONENT_NAME);

        messageBus.send({
          type: DAMAGE_MSG,
          id: bulletId,
          gameObject: bullet,
          value: bulletHealth.points,
        });

        this._pushTarget(target, directionVector, messageBus);

        bullet.removeComponent(RIGID_BODY_COMPONENT_NAME);
        bullet.removeComponent(COLLIDER_CONTAINER_COMPONENT_NAME);

        return false;
      });
    });

    const messages = messageBus.get(SHOT_MSG) || [];
    messages.forEach((message) => {
      const { gameObject, x, y } = message;

      const { offsetX, offsetY } = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const weapon = gameObject.getComponent(WEAPON_COMPONENT_NAME);

      const bullet = this._gameObjectSpawner.spawn(weapon.bullet);
      const bulletTransform = bullet.getComponent(TRANSFORM_COMPONENT_NAME);
      const bulletRigidBody = bullet.getComponent(RIGID_BODY_COMPONENT_NAME);

      bulletTransform.offsetX = offsetX;
      bulletTransform.offsetY = offsetY;

      const angle = this._getAngleBetweenTwoPoints(x, offsetX, y, offsetY);

      bulletTransform.rotation = this._radToDeg(angle);

      const directionVector = this._getVectorByAngle(angle);

      const forceValue = weapon.speed * bulletRigidBody.mass / ACCELERATION_DURATION_IN_SEC;
      directionVector.multiplyNumber(forceValue);

      messageBus.send({
        type: ADD_FORCE_MSG,
        name: SHOT_POWER,
        value: directionVector,
        duration: ACCELERATION_DURATION,
        gameObject: bullet,
        id: bullet.getId(),
      });

      this._firedBullets.push({
        shooter: gameObject,
        bullet: bullet,
        directionVector: directionVector.clone(),
      });
    });
  }
}

export default ShootingProcessor;
