import Vector2 from 'utils/vector/vector2';

import Processor from 'engine/processor/processor';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const TRANSFORM_COMPONENT_NAME = 'transform';

class PhysicsProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
  }

  process(options) {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this._gameObjectObserver.forEach((gameObject) => {
      const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      const forceVectors = rigidBody.forceVectors;

      const forceVector = Object.keys(forceVectors).reduce((resultantForceVector, forceName) => {
        resultantForceVector.add(forceVectors[forceName]);
        return resultantForceVector;
      }, new Vector2(0, 0));

      if (forceVector.x || forceVector.y) {
        const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

        const movementVector = forceVector.clone();
        movementVector.multiplyNumber(deltaTimeInSeconds);

        transform.offsetX = transform.offsetX + movementVector.x;
        transform.offsetY = transform.offsetY + movementVector.y;
      }
    });
  }
}

export default PhysicsProcessor;
