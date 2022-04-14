import Collision from './collision';

const COLLISION_MESSAGE = 'COLLISION';

export class CollisionBroadcastSystem {
  constructor(options) {
    this._gameObjectObserver = options.gameObjectObserver;
    this.messageBus = options.messageBus;

    this._collisionMap = {};
    this._activeCollisions = [];
  }

  systemDidMount() {
    this._gameObjectObserver.subscribe('onremove', this._handleGameObjectRemove);
  }

  systemWillUnmount() {
    this._gameObjectObserver.unsubscribe('onremove', this._handleGameObjectRemove);
  }

  _handleGameObjectRemove = (gameObject) => {
    const id = gameObject.getId();

    this._activeCollisions = this._activeCollisions.filter((collision) => {
      if (collision.gameObject1.getId() !== id && collision.gameObject2.getId() !== id) {
        return true;
      }

      if (collision.gameObject2.getId() === id) {
        this._collisionMap[collision.gameObject1.getId()][id] = null;
      }

      this._publishMessage(collision);

      collision.tick();

      return false;
    });

    this._collisionMap[id] = null;
  };

  _publishMessage(collision) {
    const {
      gameObject1, gameObject2, mtv1, mtv2,
    } = collision;
    const message = {
      type: `${COLLISION_MESSAGE}_${collision.getState()}`,
      id: gameObject1.getId(),
      gameObject1,
      gameObject2,
      mtv1,
      mtv2,
    };

    this.messageBus.send(message);
    this.messageBus.send(message, true);
  }

  update() {
    this._gameObjectObserver.fireEvents();

    const collisionMessages = this.messageBus.get(COLLISION_MESSAGE) || [];
    collisionMessages.forEach((message) => {
      const {
        gameObject1, gameObject2, mtv1, mtv2,
      } = message;
      const gameObject1Id = gameObject1.getId();
      const gameObject2Id = gameObject2.getId();

      this._collisionMap[gameObject1Id] = this._collisionMap[gameObject1Id] || {};

      if (!this._collisionMap[gameObject1Id][gameObject2Id]) {
        const collision = new Collision(gameObject1, gameObject2, mtv1, mtv2);
        this._collisionMap[gameObject1Id][gameObject2Id] = collision;
        this._activeCollisions.push(collision);
      } else {
        this._collisionMap[gameObject1Id][gameObject2Id].mtv1 = mtv1;
        this._collisionMap[gameObject1Id][gameObject2Id].mtv2 = mtv2;
        this._collisionMap[gameObject1Id][gameObject2Id].signal();
      }
    });

    this._activeCollisions = this._activeCollisions.filter((collision) => {
      const { gameObject1, gameObject2 } = collision;

      this._publishMessage(collision);

      collision.tick();

      if (collision.isFinished()) {
        this._collisionMap[gameObject1.getId()][gameObject2.getId()] = null;
      }

      return !collision.isFinished();
    });
  }
}
