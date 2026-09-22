import { WorldSystem } from '../../../engine/system';
import type { WorldSystemOptions } from '../../../engine/system';

import { InputSubsystem, CoordinatesProjector } from './subsystems';

/**
 * Listens to the mouse and sends the {@link MouseInputEvent | MouseInput} event on the world.
 *
 * The event has the pointer position in world coordinates and in screen pixels.
 *
 * Options:
 *
 * - `useWindow`: listens on `window`.
 * - `windowNodeId`: the id of the element to listen on when `useWindow` is off.
 *
 * Put `MouseInputSystem` before {@link MouseControlSystem} and before your own systems
 * that read `MouseInput`.
 *
 * @see [Input](https://dachajs.org/systems/input/)
 *
 * @category Input
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
