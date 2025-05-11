import { WorldSystem } from '../../../engine/system';
import type { WorldSystemOptions } from '../../../engine/system';

import {
  InputSubsystem,
  CoordinatesProjector,
} from './subsystems';

export class MouseInputSystem extends WorldSystem {
  private inputSubsystem: InputSubsystem;
  private coordinatesProjector: CoordinatesProjector;

  constructor(options: WorldSystemOptions) {
    super();

    this.inputSubsystem = new InputSubsystem(options);
    this.coordinatesProjector = new CoordinatesProjector(options);
  }

  onWorldDestroy(): void {
    this.inputSubsystem.destroy();
    this.coordinatesProjector.destroy();
  }

  update(): void {
    this.inputSubsystem.update();
  }
}

MouseInputSystem.systemName = 'MouseInputSystem';
