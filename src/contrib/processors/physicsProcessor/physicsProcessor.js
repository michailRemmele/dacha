import Vector2 from 'utils/vector/vector2';

import Processor from 'engine/processor/processor';

const COLLISION_STAY_MSG = 'COLLISION_STAY';
const COLLISION_LEAVE_MSG = 'COLLISION_LEAVE';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const TRANSFORM_COMPONENT_NAME = 'transform';

const GRAVITY_FORCE = 'gravityForce';
const REACTION_FORCE = 'reactionForce';

const DIRECTION_VECTOR = {
  UP: new Vector2(0, -1),
  LEFT: new Vector2(-1, 0),
  RIGHT: new Vector2(1, 0),
  DOWN: new Vector2(0, 1),
};

class PhysicsProcessor extends Processor {
  constructor(options) {
    super();

    const { gravitationalAcceleration } = options;

    this._gravitationalAcceleration = gravitationalAcceleration;

    this._gameObjectObserver = options.gameObjectObserver;

    this._gameObjectsVelocity = {};
  }

  processorDidMount() {
    this._gameObjectObserver.forEach((gameObject) => {
      this._addGravityForce(gameObject.getComponent(RIGID_BODY_COMPONENT_NAME));
    });
  }

  _addGravityForce(rigidBody) {
    const { forceVectors, mass, useGravity } = rigidBody;

    if (useGravity && !forceVectors[GRAVITY_FORCE]) {
      forceVectors[GRAVITY_FORCE] = new Vector2(0, 0);
      forceVectors[GRAVITY_FORCE].add(DIRECTION_VECTOR.DOWN);
      forceVectors[GRAVITY_FORCE].multiplyNumber(mass * this._gravitationalAcceleration);
    }
  }

  _addReactionForce(rigidBody) {
    const { forceVectors, useGravity } = rigidBody;

    if (useGravity && !forceVectors[REACTION_FORCE]) {
      forceVectors[REACTION_FORCE] = forceVectors[GRAVITY_FORCE]
        ? forceVectors[GRAVITY_FORCE].clone()
        : new Vector2(0, 0);
      forceVectors[REACTION_FORCE].multiplyNumber(-1);
    }
  }

  process(options) {
    const deltaTimeInSeconds = options.deltaTime / 1000;
    const messageBus = options.messageBus;

    this._gameObjectObserver.getLastAdded().forEach((gameObject) => {
      this._addGravityForce(gameObject.getComponent(RIGID_BODY_COMPONENT_NAME));
    });

    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      this._gameObjectsVelocity[gameObjectId] = null;
    });

    const leaveMessages = messageBus.get(COLLISION_LEAVE_MSG) || [];
    leaveMessages.forEach((message) => {
      const { forceVectors } = message.gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      forceVectors[REACTION_FORCE] = null;
    });

    const stayMessages = messageBus.get(COLLISION_STAY_MSG) || [];
    stayMessages.forEach((message) => {
      this._addReactionForce(message.gameObject.getComponent(RIGID_BODY_COMPONENT_NAME));
    });

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      const { forceVectors, mass } = rigidBody;

      const forceVector = Object.keys(forceVectors).reduce((resultantForceVector, forceName) => {
        if (forceVectors[forceName]) {
          resultantForceVector.add(forceVectors[forceName]);
        }

        return resultantForceVector;
      }, new Vector2(0, 0));

      this._gameObjectsVelocity[gameObjectId] = this._gameObjectsVelocity[gameObjectId]
        || new Vector2(0, 0);

      if (forceVector.x || forceVector.y) {
        const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

        const velocityVector = forceVector.clone();
        velocityVector.multiplyNumber(deltaTimeInSeconds / mass);
        velocityVector.add(this._gameObjectsVelocity[gameObjectId]);

        this._gameObjectsVelocity[gameObjectId] = velocityVector;

        transform.offsetX = transform.offsetX + velocityVector.x;
        transform.offsetY = transform.offsetY + velocityVector.y;
      } else {
        this._gameObjectsVelocity[gameObjectId].multiplyNumber(0);
      }
    });
  }
}

export default PhysicsProcessor;
