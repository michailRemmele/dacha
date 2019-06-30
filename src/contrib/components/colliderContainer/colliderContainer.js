import BoxCollider from './boxCollider';
import CircleCollider from './circleCollider';

class ColliderContainer {
  constructor(config) {
    this._colliders = {
      boxCollider: BoxCollider,
      circleCollider: CircleCollider,
    };

    this._type = config.type;

    if (!this._colliders[this.type]) {
      throw new Error(`Not found collider with same type: ${this.type}`);
    }

    this._collider = new this._colliders[this.type](config.collider);
  }

  set type(type) {
    this._type = type;
  }

  get type() {
    return this._type;
  }

  set collider(collider) {
    this._collider = collider;
  }

  get collider() {
    return this._collider;
  }

  clone() {
    return new ColliderContainer({
      type: this.type,
      collider: this.collider.clone(),
    });
  }
}

export default ColliderContainer;
