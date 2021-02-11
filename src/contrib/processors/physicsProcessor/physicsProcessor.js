import Processor from 'engine/processor/processor';
import { Vector2 } from 'engine/mathLib';

const ADD_FORCE_MSG = 'ADD_FORCE';
const ADD_IMPULSE_MSG = 'ADD_IMPULSE';
const STOP_MOVEMENT_MSG = 'STOP_MOVEMENT';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const TRANSFORM_COMPONENT_NAME = 'transform';

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
  }

  processorDidMount() {
    this._store.set(GRAVITATIONAL_ACCELERATION_STORE_KEY, this._gravitationalAcceleration);
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

  _getGravityForce(rigidBody) {
    const { mass, useGravity } = rigidBody;

    const gravityVector = new Vector2(0, 0);

    if (useGravity) {
      gravityVector.add(DIRECTION_VECTOR.DOWN);
      gravityVector.multiplyNumber(mass * this._gravitationalAcceleration);
    }

    return gravityVector;
  }

  _getForceVector(gameObject, messageBus) {
    const gameObjectId = gameObject.getId();
    const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);

    const forceVector = new Vector2(0, 0);

    forceVector.add(this._getGravityForce(rigidBody));

    const addForceMessages = messageBus.getById(ADD_FORCE_MSG, gameObjectId) || [];
    addForceMessages.forEach((message) => forceVector.add(message.value));

    return forceVector;
  }

  _getImpulseVector(gameObject, messageBus) {
    const gameObjectId = gameObject.getId();
    const addImpulseMessages = messageBus.getById(ADD_IMPULSE_MSG, gameObjectId) || [];

    return addImpulseMessages.reduce((vector, message) => {
      vector.add(message.value);

      return vector;
    }, new Vector2(0, 0));
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

      const forceVector = this._getForceVector(gameObject, messageBus);
      const impulseVector = this._getImpulseVector(gameObject, messageBus);

      this._gameObjectsVelocity[gameObjectId] = this._gameObjectsVelocity[gameObjectId]
        || new Vector2(0, 0);

      const velocityVector = this._gameObjectsVelocity[gameObjectId];

      if (forceVector.x || forceVector.y) {
        forceVector.multiplyNumber(deltaTimeInSeconds / mass);
        velocityVector.add(forceVector);
      }

      if (impulseVector.x || impulseVector.y) {
        impulseVector.multiplyNumber(1 / mass);
        velocityVector.add(impulseVector);
      }

      this._applyDragForce(gameObject, deltaTimeInSeconds);

      transform.offsetX = transform.offsetX + (velocityVector.x * deltaTimeInSeconds);
      transform.offsetY = transform.offsetY + (velocityVector.y * deltaTimeInSeconds);
    });
  }
}

export default PhysicsProcessor;
