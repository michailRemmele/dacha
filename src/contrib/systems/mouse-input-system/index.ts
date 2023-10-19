import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';

import {
  QueryBuilder,
  CoordinatesProjector,
} from './subsystems';

export class MouseInputSystem extends System {
  private queryBuilder: QueryBuilder;
  private coordinatesProjector: CoordinatesProjector;

  constructor(options: SystemOptions) {
    super();

    this.queryBuilder = new QueryBuilder(options);
    this.coordinatesProjector = new CoordinatesProjector(options);
  }

  mount(): void {
    this.queryBuilder.mount();
  }

  unmount(): void {
    this.queryBuilder.unmount();
  }

  update(): void {
    this.queryBuilder.update();
    this.coordinatesProjector.update();
  }
}

MouseInputSystem.systemName = 'MouseInputSystem';
