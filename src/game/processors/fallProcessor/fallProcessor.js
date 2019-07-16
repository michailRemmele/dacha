import Processor from 'engine/processor/processor';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const RENDERABLE_COMPONENT_NAME = 'renderable';

const GRAVITY_FORCE = 'gravityForce';
const REACTION_FORCE = 'reactionForce';

const SPACE_SORTING_LAYER = 'space';

class FallProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
  }

  process(options) {
    this._gameObjectObserver.forEach((gameObject) => {
      const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME);
      const { forceVectors } = rigidBody;

      if (rigidBody.useGravity && forceVectors[GRAVITY_FORCE] && !forceVectors[REACTION_FORCE]) {
        gameObject.removeComponent(COLLIDER_CONTAINER_COMPONENT_NAME);
        renderable.sortingLayer = SPACE_SORTING_LAYER;
      }
    });
  }
}

export default FallProcessor;
