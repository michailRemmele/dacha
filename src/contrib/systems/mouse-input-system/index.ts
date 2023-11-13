import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';

import {
  InputSubsystem,
  CoordinatesProjector,
} from './subsystems';

export class MouseInputSystem extends System {
  private inputSubsystem: InputSubsystem;
  private coordinatesProjector: CoordinatesProjector;

  constructor(options: SystemOptions) {
    super();

    this.inputSubsystem = new InputSubsystem(options);
    this.coordinatesProjector = new CoordinatesProjector(options);
  }

  mount(): void {
    this.inputSubsystem.mount();
  }

  unmount(): void {
    this.inputSubsystem.unmount();
  }

  update(): void {
    this.inputSubsystem.update();
    this.coordinatesProjector.update();
  }
}

MouseInputSystem.systemName = 'MouseInputSystem';
