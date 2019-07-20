import Component from 'engine/component/component';
import BoxCollider from './boxCollider';
import CircleCollider from './circleCollider';

class ColliderContainer extends Component {
  constructor(config) {
    super();

    this._colliders = {
      boxCollider: BoxCollider,
      circleCollider: CircleCollider,
    };

    this._type = config.type;
    this._isTrigger = config.isTrigger;

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

  set isTrigger(isTrigger) {
    this._isTrigger = isTrigger;
  }

  get isTrigger() {
    return this._isTrigger;
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
      isTrigger: this.isTrigger,
      collider: this.collider.clone(),
    });
  }
}

export default ColliderContainer;
