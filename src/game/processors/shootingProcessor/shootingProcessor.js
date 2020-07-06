import Processor from 'engine/processor/processor';
import { VectorOps, MathOps } from 'engine/mathLib';

const DAMAGE_MSG = 'DAMAGE';
const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const SHOT_MSG = 'SHOT';
const ADD_FORCE_MSG = 'ADD_FORCE';
const ADD_EFFECT_MSG = 'ADD_EFFECT';

const SHOT_POWER = 'shotPower';
const PUSH_POWER = 'pushPower';

const TRANSFORM_COMPONENT_NAME = 'transform';
const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const WEAPON_COMPONENT_NAME = 'weapon';
const HEALTH_COMPONENT_NAME = 'health';
const HITBOX_COMPONENT_NAME = 'hitBox';

const ACCELERATION_DURATION = 10;
const ACCELERATION_DURATION_IN_SEC = ACCELERATION_DURATION / 1000;

const LIFETIME_EFFECT = {
  name: 'lifetime',
  effect: 'damage',
  effectType: 'delayed',
  applicatorOptions: {
    timer: 800,
  },
};

const FETTER_EFFECT = {
  name: 'weaponFetter',
  effect: 'fetter',
  effectType: 'timeLimited',
};

class ShootingProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._gameObjectSpawner = options.gameObjectSpawner;

    this._firedBullets = [];
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

  _processFiredBullets(messageBus) {
    this._firedBullets = this._firedBullets.filter((entry) => {
      const { shooter, bullet, directionVector, damage, fetterDuration } = entry;
      const bulletId = bullet.getId();

      const collisionMessages = messageBus.getById(COLLISION_ENTER_MSG, bulletId) || [];
      return collisionMessages.every((message) => {
        const { gameObject2 } = message;

        const hitBox = gameObject2.getComponent(HITBOX_COMPONENT_NAME);
        const target = gameObject2.getParent();

        if (!hitBox || !target) {
          return true;
        }

        const targetId = target.getId();

        if (shooter.getId() === targetId || bulletId === targetId) {
          return true;
        }

        const bulletHealth = bullet.getComponent(HEALTH_COMPONENT_NAME);

        messageBus.send({
          type: DAMAGE_MSG,
          id: bulletId,
          gameObject: bullet,
          value: bulletHealth.points,
        });
        messageBus.send({
          type: DAMAGE_MSG,
          id: targetId,
          gameObject: target,
          value: damage,
        });
        messageBus.send({
          type: ADD_EFFECT_MSG,
          id: targetId,
          gameObject: target,
          ...FETTER_EFFECT,
          applicatorOptions: {
            duration: fetterDuration,
          },
        });

        this._pushTarget(target, directionVector, messageBus);

        return false;
      });
    });
  }

  _processWeaponsCooldown(deltaTime) {
    this._gameObjectObserver.forEach((gameObject) => {
      const weapon = gameObject.getComponent(WEAPON_COMPONENT_NAME);

      if (weapon.cooldownRemaining > 0) {
        weapon.cooldownRemaining -= deltaTime;
      }
    });
  }

  _fire(shooter, targetX, targetY, messageBus) {
    const { offsetX, offsetY } = shooter.getComponent(TRANSFORM_COMPONENT_NAME);
    const weapon = shooter.getComponent(WEAPON_COMPONENT_NAME);

    if (weapon.cooldownRemaining > 0) {
      messageBus.deleteById(SHOT_MSG, shooter.getId());
      return;
    }

    const bullet = this._gameObjectSpawner.spawn(weapon.bullet);
    const bulletTransform = bullet.getComponent(TRANSFORM_COMPONENT_NAME);
    const bulletRigidBody = bullet.getComponent(RIGID_BODY_COMPONENT_NAME);
    const bulletHealth = bullet.getComponent(HEALTH_COMPONENT_NAME);

    bulletTransform.offsetX = offsetX;
    bulletTransform.offsetY = offsetY;

    const angle = MathOps.getAngleBetweenTwoPoints(targetX, offsetX, targetY, offsetY);

    bulletTransform.rotation = MathOps.radToDeg(angle);

    const directionVector = VectorOps.getVectorByAngle(angle);

    const forceValue = weapon.speed * bulletRigidBody.mass / ACCELERATION_DURATION_IN_SEC;
    directionVector.multiplyNumber(forceValue);

    const flightTime = (1000 * weapon.range / weapon.speed) + (ACCELERATION_DURATION / 2);

    messageBus.send({
      type: ADD_FORCE_MSG,
      name: SHOT_POWER,
      value: directionVector,
      duration: ACCELERATION_DURATION,
      gameObject: bullet,
      id: bullet.getId(),
    });

    messageBus.send({
      type: ADD_EFFECT_MSG,
      id: bullet.getId(),
      gameObject: bullet,
      ...LIFETIME_EFFECT,
      applicatorOptions: {
        timer: flightTime,
      },
      effectOptions: {
        value: bulletHealth.points,
      },
    });

    this._firedBullets.push({
      shooter: shooter,
      bullet: bullet,
      directionVector: directionVector.clone(),
      damage: weapon.damage,
      fetterDuration: weapon.fetterDuration,
    });

    weapon.cooldownRemaining = weapon.cooldown;
  }

  process(options) {
    const { messageBus, deltaTime } = options;

    this._processFiredBullets(messageBus);
    this._processWeaponsCooldown(deltaTime);

    const messages = messageBus.get(SHOT_MSG) || [];
    messages.forEach((message) => {
      const { gameObject, x, y } = message;
      this._fire(gameObject, x, y, messageBus);
    });
  }
}

export default ShootingProcessor;
