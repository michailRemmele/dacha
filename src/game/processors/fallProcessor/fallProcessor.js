import Processor from 'engine/processor/processor';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
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
      const collisionMessages = messageBus.getById(COLLISION_ENTER_MSG, gameObject.getId()) || [];
      return collisionMessages.every((message) => {
        const { otherGameObject } = message;
        const rigidBody = otherGameObject.getComponent(RIGID_BODY_COMPONENT_NAME);

        if (rigidBody) {
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
        rigidBody.ghost = true;
        this._fallingGameObjects.push(gameObject);
      }
    });
  }
}

export default FallProcessor;
