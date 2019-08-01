import Processor from 'engine/processor/processor';

const TRIGGER_ENTER_MSG = 'TRIGGER_ENTER';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const RENDERABLE_COMPONENT_NAME = 'renderable';

const REACTION_FORCE = 'reactionForce';

const SPACE_SORTING_LAYER = 'space';

class FallProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._fallingGameObjects = [];
  }

  process(options) {
    const messageBus = options.messageBus;

    this._fallingGameObjects = this._fallingGameObjects.filter((gameObject) => {
      const collisionMessages = messageBus.getById(TRIGGER_ENTER_MSG, gameObject.getId()) || [];
      return collisionMessages.every((message) => {
        const { otherGameObject } = message;
        const colliderContainer = otherGameObject.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME);

        if (!colliderContainer.isTrigger) {
          const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME);
          renderable.sortingLayer = SPACE_SORTING_LAYER;
          return false;
        }
        return true;
      });
    });

    this._gameObjectObserver.forEach((gameObject) => {
      const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);

      const { forceVectors } = rigidBody;

      if (rigidBody.useGravity && !forceVectors[REACTION_FORCE]) {
        this._fallingGameObjects.push(gameObject);

        const colliderContainer = gameObject.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME);
        colliderContainer.isTrigger = true;
      }
    });
  }
}

export default FallProcessor;
