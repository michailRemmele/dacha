import Collision from './collision';

const COLLISION_MESSAGE = 'COLLISION';

export class CollisionBroadcastSystem {
  constructor(options) {
    this._entityObserver = options.entityObserver;
    this.messageBus = options.messageBus;

    this._collisionMap = {};
    this._activeCollisions = [];
  }

  systemDidMount() {
    this._entityObserver.subscribe('onremove', this._handleEntityRemove);
  }

  systemWillUnmount() {
    this._entityObserver.unsubscribe('onremove', this._handleEntityRemove);
  }

  _handleEntityRemove = (entity) => {
    const id = entity.getId();

    this._activeCollisions = this._activeCollisions.filter((collision) => {
      if (collision.entity1.getId() !== id && collision.entity2.getId() !== id) {
        return true;
      }

      if (collision.entity2.getId() === id) {
        this._collisionMap[collision.entity1.getId()][id] = null;
      }

      this._publishMessage(collision);

      collision.tick();

      return false;
    });

    this._collisionMap[id] = null;
  };

  _publishMessage(collision) {
    const {
      entity1, entity2, mtv1, mtv2,
    } = collision;
    const message = {
      type: `${COLLISION_MESSAGE}_${collision.getState()}`,
      id: entity1.getId(),
      entity1,
      entity2,
      mtv1,
      mtv2,
    };

    this.messageBus.send(message);
    this.messageBus.send(message, true);
  }

  update() {
    this._entityObserver.fireEvents();

    const collisionMessages = this.messageBus.get(COLLISION_MESSAGE) || [];
    collisionMessages.forEach((message) => {
      const {
        entity1, entity2, mtv1, mtv2,
      } = message;
      const entity1Id = entity1.getId();
      const entity2Id = entity2.getId();

      this._collisionMap[entity1Id] = this._collisionMap[entity1Id] || {};

      if (!this._collisionMap[entity1Id][entity2Id]) {
        const collision = new Collision(entity1, entity2, mtv1, mtv2);
        this._collisionMap[entity1Id][entity2Id] = collision;
        this._activeCollisions.push(collision);
      } else {
        this._collisionMap[entity1Id][entity2Id].mtv1 = mtv1;
        this._collisionMap[entity1Id][entity2Id].mtv2 = mtv2;
        this._collisionMap[entity1Id][entity2Id].signal();
      }
    });

    this._activeCollisions = this._activeCollisions.filter((collision) => {
      const { entity1, entity2 } = collision;

      this._publishMessage(collision);

      collision.tick();

      if (collision.isFinished()) {
        this._collisionMap[entity1.getId()][entity2.getId()] = null;
      }

      return !collision.isFinished();
    });
  }
}
