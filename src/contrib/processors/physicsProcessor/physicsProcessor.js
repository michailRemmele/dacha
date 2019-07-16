import Vector2 from 'utils/vector/vector2';

import Processor from 'engine/processor/processor';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
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

    this._gameObjectsLastTransform = {};
    this._gameObjectsVelocity = {};
  }

  processorDidMount() {
    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

      this._addGravityForce(rigidBody);
      this._gameObjectsLastTransform[gameObjectId] = transform.clone();
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

  _addReactionForce(gameObject) {
    const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);

    if (!rigidBody) {
      return;
    }

    const { forceVectors, useGravity } = rigidBody;

    if (useGravity && !forceVectors[REACTION_FORCE]) {
      forceVectors[REACTION_FORCE] = forceVectors[GRAVITY_FORCE]
        ? forceVectors[GRAVITY_FORCE].clone()
        : new Vector2(0, 0);
      forceVectors[REACTION_FORCE].multiplyNumber(-1);
    }
  }

  _resolveCollision(gameObject1, gameObject2) {
    const rigidBody1 = gameObject1.getComponent(RIGID_BODY_COMPONENT_NAME);
    const rigidBody2 = gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME);

    if (rigidBody1 && rigidBody2) {
      const previousTransform = this._gameObjectsLastTransform[gameObject1.getId()];
      const transform = gameObject1.getComponent(TRANSFORM_COMPONENT_NAME);

      transform.offsetX = previousTransform.offsetX;
      transform.offsetY = previousTransform.offsetY;
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

    const enterMessages = messageBus.get(COLLISION_ENTER_MSG) || [];
    enterMessages.forEach((message) => {
      const { gameObject, otherGameObject } = message;
      this._resolveCollision(gameObject, otherGameObject);
    });

    const leaveMessages = messageBus.get(COLLISION_LEAVE_MSG) || [];
    leaveMessages.forEach((message) => {
      const rigidBody = message.gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      if (rigidBody) {
        rigidBody.forceVectors[REACTION_FORCE] = null;
      }
    });

    const stayMessages = messageBus.get(COLLISION_STAY_MSG) || [];
    stayMessages.forEach((message) => {
      const { gameObject, otherGameObject } = message;

      this._addReactionForce(gameObject);
      this._resolveCollision(gameObject, otherGameObject);
    });

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
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
        const velocityVector = forceVector.clone();
        velocityVector.multiplyNumber(deltaTimeInSeconds / mass);
        velocityVector.add(this._gameObjectsVelocity[gameObjectId]);

        transform.offsetX = transform.offsetX + velocityVector.x;
        transform.offsetY = transform.offsetY + velocityVector.y;

        this._gameObjectsVelocity[gameObjectId] = velocityVector;
      } else {
        this._gameObjectsVelocity[gameObjectId].multiplyNumber(0);
      }

      this._gameObjectsLastTransform[gameObjectId] = transform.clone();
    });
  }
}

export default PhysicsProcessor;
