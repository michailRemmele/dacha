import Vector2 from 'utils/vector/vector2';

import Processor from 'engine/processor/processor';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const TRANSFORM_COMPONENT_NAME = 'transform';

const GRAVITY_FORCE = 'gravityForce';
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

  process(options) {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      const { forceVectors, mass, useGravity } = rigidBody;

      if (useGravity && !forceVectors[GRAVITY_FORCE]) {
        forceVectors[GRAVITY_FORCE] = new Vector2(0, 0);
        forceVectors[GRAVITY_FORCE].add(DIRECTION_VECTOR.DOWN);
        forceVectors[GRAVITY_FORCE].multiplyNumber(mass * this._gravitationalAcceleration);
      }

      const forceVector = Object.keys(forceVectors).reduce((resultantForceVector, forceName) => {
        resultantForceVector.add(forceVectors[forceName]);
        return resultantForceVector;
      }, new Vector2(0, 0));

      if (forceVector.x || forceVector.y) {
        const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

        const velocityVector = forceVector.clone();
        velocityVector.multiplyNumber(deltaTimeInSeconds / mass);
        velocityVector.add(this._gameObjectsVelocity[gameObjectId] || new Vector2(0, 0));

        this._gameObjectsVelocity[gameObjectId] = velocityVector;

        transform.offsetX = transform.offsetX + velocityVector.x;
        transform.offsetY = transform.offsetY + velocityVector.y;
      }
    });
  }
}

export default PhysicsProcessor;
