import Processor from 'engine/processor/processor';
import { Vector2 } from 'engine/mathLib';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const COLLISION_STAY_MSG = 'COLLISION_STAY';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const RIGID_BODY_TYPE = {
  STATIC: 'static',
  DYNAMIC: 'dynamic',
};

const TRANSFORM_COMPONENT_NAME = 'transform';

class ConstraintSolver extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._processedPairs = {};
    this._mtvMap = {};
  }

  _validateCollision(gameObject1, gameObject2) {
    const rigidBody1 = gameObject1.getComponent(RIGID_BODY_COMPONENT_NAME);
    const rigidBody2 = gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME);

    return rigidBody1 && !rigidBody1.ghost && !rigidBody1.isPermeable
      && rigidBody2 && !rigidBody2.ghost && !rigidBody2.isPermeable
      && (rigidBody1.type !== RIGID_BODY_TYPE.STATIC || rigidBody2.type !== RIGID_BODY_TYPE.STATIC);
  }

  _setMtv(id, mtvX, mtvY) {
    const entry = this._mtvMap[id];

    if (!entry) {
      this._mtvMap[id] = {
        mtv: new Vector2(mtvX, mtvY),
      };
      return;
    }

    if (mtvX && entry.mtv.x && Math.sign(mtvX) !== Math.sign(entry.mtv.x)) {
      entry.mtv.x = 0;
      entry.lockX = true;
    } else if (!entry.lockX && Math.abs(mtvX) > Math.abs(entry.mtv.x)) {
      entry.mtv.x = mtvX;
    }

    if (mtvY && entry.mtv.y && Math.sign(mtvY) !== Math.sign(entry.mtv.y)) {
      entry.mtv.y = 0;
      entry.lockY = true;
    } else if (!entry.lockY && Math.abs(mtvY) > Math.abs(entry.mtv.y)) {
      entry.mtv.y = mtvY;
    }
  }

  _resolveCollision(gameObject1, gameObject2, mtv1, mtv2) {
    const id1 = gameObject1.getId();
    const id2 = gameObject2.getId();

    const rigidBody1 = gameObject1.getComponent(RIGID_BODY_COMPONENT_NAME);
    const rigidBody2 = gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME);

    if (rigidBody1.type === RIGID_BODY_TYPE.STATIC) {
      this._setMtv(id2, mtv2.x, mtv2.y);
    } else if (rigidBody2.type === RIGID_BODY_TYPE.STATIC) {
      this._setMtv(id1, mtv1.x, mtv1.y);
    } else {
      this._setMtv(id1, mtv1.x / 2, mtv1.y / 2);
      this._setMtv(id2, mtv2.x / 2, mtv2.y / 2);
    }
  }

  process(options) {
    const messageBus = options.messageBus;

    this._processedPairs = {};
    this._mtvMap = {};

    const enterMessages = messageBus.get(COLLISION_ENTER_MSG) || [];
    const stayMessages = messageBus.get(COLLISION_STAY_MSG) || [];
    [ enterMessages, stayMessages ].forEach((messages) => {
      messages.forEach((message) => {
        const { gameObject1, gameObject2, mtv1, mtv2 } = message;

        const id1 = gameObject1.getId();
        const id2 = gameObject2.getId();

        if (this._processedPairs[id2] && this._processedPairs[id2][id1]) {
          return;
        }

        this._processedPairs[id1] = this._processedPairs[id1] || {};
        this._processedPairs[id1][id2] = true;

        if (!this._validateCollision(gameObject1, gameObject2)) {
          return;
        }

        this._resolveCollision(gameObject1, gameObject2, mtv1, mtv2);
      });
    });

    Object.keys(this._mtvMap).forEach((id) => {
      const gameObject = this._gameObjectObserver.getById(id);
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

      transform.offsetX += this._mtvMap[id].mtv.x;
      transform.offsetY += this._mtvMap[id].mtv.y;
    });
  }
}

export default ConstraintSolver;
