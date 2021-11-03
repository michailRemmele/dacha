import { Component } from '../../../engine/component';

import { BoxCollider } from './box-collider';
import { CircleCollider } from './circle-collider';

interface ColliderContainerConfig {
  type: 'boxCollider' | 'circleCollider';
  collider: Record<string, number>;
}

const COLLIDER_MAP = {
  boxCollider: BoxCollider,
  circleCollider: CircleCollider,
};

export class ColliderContainer extends Component {
  private _type: 'boxCollider' | 'circleCollider';
  private _collider: BoxCollider | CircleCollider;

  constructor(
    componentName: string,
    config: ColliderContainerConfig,
  ) {
    super(componentName);

    this._type = config.type;

    if (!COLLIDER_MAP[this.type]) {
      throw new Error(`Not found collider with same type: ${this.type}`);
    }

    const Collider = COLLIDER_MAP[this.type];

    this._collider = new Collider(config.collider);
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
    return new ColliderContainer(this.componentName, {
      type: this.type,
      collider: this.collider as unknown as Record<string, number>,
    });
  }
}
