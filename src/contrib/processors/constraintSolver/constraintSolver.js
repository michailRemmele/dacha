import { Vector2 } from '../../../engine/mathLib';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const COLLISION_STAY_MSG = 'COLLISION_STAY';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const RIGID_BODY_TYPE = {
  STATIC: 'static',
  DYNAMIC: 'dynamic',
};

const TRANSFORM_COMPONENT_NAME = 'transform';

class ConstraintSolver {
  constructor(options) {
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

  _setMtv(id, mtvX, mtvY, type) {
    this._mtvMap[id] = this._mtvMap[id] || {};

    if (!this._mtvMap[id][type]) {
      this._mtvMap[id][type] = new Vector2(mtvX, mtvY);
      return;
    }

    const settingStrategy = {
      static: () => {
        this._mtvMap[id][type].x = Math.abs(mtvX) > Math.abs(this._mtvMap[id][type].x)
          ? mtvX
          : this._mtvMap[id][type].x;
        this._mtvMap[id][type].y = Math.abs(mtvY) > Math.abs(this._mtvMap[id][type].y)
          ? mtvY
          : this._mtvMap[id][type].y;
      },
      dynamic: () => {
        this._mtvMap[id][type].x += mtvX;
        this._mtvMap[id][type].y += mtvY;
      },
    };

    settingStrategy[type]();
  }

  _resolveCollision(gameObject1, gameObject2, mtv1, mtv2) {
    const id1 = gameObject1.getId();
    const id2 = gameObject2.getId();

    const rigidBody1 = gameObject1.getComponent(RIGID_BODY_COMPONENT_NAME);
    const rigidBody2 = gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME);

    if (rigidBody1.type === RIGID_BODY_TYPE.STATIC) {
      this._setMtv(id2, mtv2.x, mtv2.y, rigidBody1.type);
    } else if (rigidBody2.type === RIGID_BODY_TYPE.STATIC) {
      this._setMtv(id1, mtv1.x, mtv1.y, rigidBody2.type);
    } else {
      this._setMtv(id1, mtv1.x / 2, mtv1.y / 2, rigidBody2.type);
      this._setMtv(id2, mtv2.x / 2, mtv2.y / 2, rigidBody1.type);
    }
  }

  process(options) {
    const { messageBus } = options;

    this._processedPairs = {};
    this._mtvMap = {};

    const enterMessages = messageBus.get(COLLISION_ENTER_MSG) || [];
    const stayMessages = messageBus.get(COLLISION_STAY_MSG) || [];
    [enterMessages, stayMessages].forEach((messages) => {
      messages.forEach((message) => {
        const {
          gameObject1, gameObject2, mtv1, mtv2,
        } = message;

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

      const mtvs = Object.keys(this._mtvMap[id]);

      if (mtvs.length === 1) {
        transform.offsetX += this._mtvMap[id][mtvs[0]].x;
        transform.offsetY += this._mtvMap[id][mtvs[0]].y;
        return;
      }

      const { static: staticMtv, dynamic: dynamicMtv } = this._mtvMap[id];

      /*
       * TODO:: Enable this part when it will be possible to run
       * phycics pipeline several times per single game loop iteration
       */
      // transform.offsetX += Math.sign(staticMtv.x) === Math.sign(dynamicMtv.x)
      //   ? staticMtv.x + dynamicMtv.x
      //   : staticMtv.x || dynamicMtv.x;
      // transform.offsetY += Math.sign(staticMtv.y) === Math.sign(dynamicMtv.y)
      //   ? staticMtv.y + dynamicMtv.y
      //   : staticMtv.y || dynamicMtv.y;

      transform.offsetX += staticMtv.x + dynamicMtv.x;
      transform.offsetY += staticMtv.y + dynamicMtv.y;
    });
  }
}

export default ConstraintSolver;
