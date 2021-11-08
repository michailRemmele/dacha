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
  type: 'boxCollider' | 'circleCollider';
  collider: BoxCollider | CircleCollider;

  constructor(
    componentName: string,
    config: ColliderContainerConfig,
  ) {
    super(componentName);

    this.type = config.type;

    if (!COLLIDER_MAP[this.type]) {
      throw new Error(`Not found collider with same type: ${this.type}`);
    }

    const Collider = COLLIDER_MAP[this.type];

    this.collider = new Collider(config.collider);
  }

  clone() {
    return new ColliderContainer(this.componentName, {
      type: this.type,
      collider: this.collider as unknown as Record<string, number>,
    });
  }
}
