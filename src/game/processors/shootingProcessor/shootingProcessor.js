import Vector2 from 'utils/vector/vector2';
import Processor from 'engine/processor/processor';

const SHOT_MSG = 'SHOT';
const ADD_FORCE_MSG = 'ADD_FORCE';
const SHOT_POWER = 'shotPower';

const TRANSFORM_COMPONENT_NAME = 'transform';
const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const WEAPON_COMPONENT_NAME = 'weapon';

const ACCELERATION_DURATION = 10;
const ACCELERATION_DURATION_IN_SEC = ACCELERATION_DURATION / 1000;

class ShootingProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectSpawner = options.gameObjectSpawner;
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

  process(options) {
    const messageBus = options.messageBus;

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
    });
  }
}

export default ShootingProcessor;
