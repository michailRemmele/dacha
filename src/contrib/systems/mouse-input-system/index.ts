import { WorldSystem } from '../../../engine/system';
import type { WorldSystemOptions } from '../../../engine/system';

import { InputSubsystem, CoordinatesProjector } from './subsystems';

/**
 * Mouse input system that captures and processes mouse events
 *
 * Handles mouse input events with coordinate projection from screen space
 * to world space. Dispatches mouse input events to the world with proper
 * coordinate transformation for game world interaction.
 *
 * @extends WorldSystem
 * 
 * @category Systems
 */
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
