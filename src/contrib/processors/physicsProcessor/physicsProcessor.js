import Processor from 'engine/processor/processor';
import { Vector2 } from 'engine/mathLib';

const ADD_FORCE_MSG = 'ADD_FORCE';
const STOP_MOVEMENT_MSG = 'STOP_MOVEMENT';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const TRANSFORM_COMPONENT_NAME = 'transform';

const GRAVITY_FORCE = 'gravityForce';

const GRAVITATIONAL_ACCELERATION_STORE_KEY = 'gravitationalAcceleration';

const DIRECTION_VECTOR = {
  UP: new Vector2(0, -1),
  LEFT: new Vector2(-1, 0),
  RIGHT: new Vector2(1, 0),
  DOWN: new Vector2(0, 1),
};

class PhysicsProcessor extends Processor {
  constructor(options) {
    super();

    const { gravitationalAcceleration, gameObjectObserver, store } = options;

    this._gravitationalAcceleration = gravitationalAcceleration;
    this._gameObjectObserver = gameObjectObserver;
    this._store = store;

    this._gameObjectsVelocity = {};
    this._temproraryForcesMap = {};
  }

  processorDidMount() {
    this._store.set(GRAVITATIONAL_ACCELERATION_STORE_KEY, this._gravitationalAcceleration);
  }

  _filterTemporaryForces(gameObjectId, forceVectors, deltaTime) {
    const temporaryForces = this._temproraryForcesMap[gameObjectId] || {};

    Object.keys(forceVectors).forEach((forceName) => {
      const forceDuration = temporaryForces[forceName];

      if (forceDuration === null || forceDuration === undefined) {
        return;
      }

      if (forceDuration <= 0) {
        forceVectors[forceName] = null;
        temporaryForces[forceName] = null;
        return;
      }

      if (forceDuration < deltaTime) {
        forceVectors[forceName].multiplyNumber(forceDuration / deltaTime);
      }

      temporaryForces[forceName] -= deltaTime;
    });
  }

  _addGravityForce(rigidBody, forceVectors) {
    const { mass, useGravity } = rigidBody;

    if (useGravity && !forceVectors[GRAVITY_FORCE]) {
      forceVectors[GRAVITY_FORCE] = new Vector2(0, 0);
      forceVectors[GRAVITY_FORCE].add(DIRECTION_VECTOR.DOWN);
      forceVectors[GRAVITY_FORCE].multiplyNumber(mass * this._gravitationalAcceleration);
    }
  }

  _applyDragForce(gameObject, deltaTime) {
    const { mass, drag } = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
    const gameObjectId = gameObject.getId();
    const velocity = this._gameObjectsVelocity[gameObjectId];

    if (!drag || !velocity || (!velocity.x && !velocity.y)) {
      return;
    }

    const velocitySignX = Math.sign(velocity.x);
    const velocitySignY = Math.sign(velocity.y);

    const reactionForceValue = mass * this._gravitationalAcceleration;
    const dragForceValue = -1 * drag * reactionForceValue;
    const forceToVelocityMultiplier = deltaTime / mass;
    const slowdownValue = dragForceValue * forceToVelocityMultiplier;
    const normalizationMultiplier = 1 / velocity.magnitude;

    const slowdown = velocity.clone();
    slowdown.multiplyNumber(slowdownValue * normalizationMultiplier);

    velocity.add(slowdown);

    if (Math.sign(velocity.x) !== velocitySignX && Math.sign(velocity.y) !== velocitySignY) {
      velocity.multiplyNumber(0);
    }
  }

  _processIncomingForces(gameObjectId, forceVectors, messageBus) {
    const addForceMessages = messageBus.getById(ADD_FORCE_MSG, gameObjectId) || [];

    addForceMessages.forEach((message) => {
      const { name, value, duration } = message;
      this._temproraryForcesMap[gameObjectId] = this._temproraryForcesMap[gameObjectId] || {};

      if (duration) {
        this._temproraryForcesMap[gameObjectId][name] = duration;
      } else if (this._temproraryForcesMap[gameObjectId][name]) {
        this._temproraryForcesMap[gameObjectId][name] = null;
      }

      forceVectors[name] = value;
    });
  }

  _processConstraints(messageBus) {
    const stopMovementMessages = messageBus.get(STOP_MOVEMENT_MSG) || [];

    stopMovementMessages.forEach((message) => {
      const { gameObject } = message;
      const gameObjectId = gameObject.getId();

      if (this._gameObjectsVelocity[gameObjectId]) {
        this._gameObjectsVelocity[gameObjectId].multiplyNumber(0);
      }
    });
  }

  _processRemovedGameObjects() {
    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      this._gameObjectsVelocity[gameObjectId] = null;
    });
  }

  process(options) {
    const deltaTimeInMsec = options.deltaTime;
    const deltaTimeInSeconds = deltaTimeInMsec / 1000;
    const messageBus = options.messageBus;

    this._processRemovedGameObjects();
    this._processConstraints(messageBus);

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const { mass } = rigidBody;

      const forceVectors = {};

      this._addGravityForce(rigidBody, forceVectors);
      this._processIncomingForces(gameObjectId, forceVectors, messageBus);
      this._filterTemporaryForces(gameObjectId, forceVectors, deltaTimeInMsec);

      const forceVector = Object.keys(forceVectors).reduce((resultantForceVector, forceName) => {
        if (!forceVectors[forceName]) {
          return resultantForceVector;
        }

        resultantForceVector.add(forceVectors[forceName]);

        return resultantForceVector;
      }, new Vector2(0, 0));

      this._gameObjectsVelocity[gameObjectId] = this._gameObjectsVelocity[gameObjectId]
        || new Vector2(0, 0);

      const velocityVector = this._gameObjectsVelocity[gameObjectId];

      if (forceVector.x || forceVector.y) {
        const velocityIncrease = forceVector.clone();
        velocityIncrease.multiplyNumber(deltaTimeInSeconds / mass);
        velocityVector.add(velocityIncrease);
      }

      this._applyDragForce(gameObject, deltaTimeInSeconds);

      transform.offsetX = transform.offsetX + (velocityVector.x * deltaTimeInSeconds);
      transform.offsetY = transform.offsetY + (velocityVector.y * deltaTimeInSeconds);
    });
  }
}

export default PhysicsProcessor;
