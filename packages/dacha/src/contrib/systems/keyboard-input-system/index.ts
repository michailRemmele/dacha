import { WorldSystem } from '../../../engine/system';
import type { WorldSystemOptions } from '../../../engine/system';
import type { World } from '../../../engine/world';
import { KeyboardInput } from '../../events';
import { getWindowNode } from '../../utils/get-window-node';

import { InputListener } from './input-listener';

interface KeyboardInputSystemOptions extends WorldSystemOptions {
  windowNodeId?: string;
  useWindow: boolean;
}

/**
 * Listens to the keyboard and sends the {@link KeyboardInputEvent | KeyboardInput} event on the world.
 *
 * The system sends one event when a key goes down and one when it goes up.
 *
 * Options:
 *
 * - `useWindow`: listens on `window`.
 * - `windowNodeId`: the id of the element to listen on when `useWindow` is off.
 *
 * @see [Input](https://dachajs.org/systems/input/)
 *
 * @category Input
 */
export class KeyboardInputSystem extends WorldSystem {
  private world: World;
  private inputListener: InputListener;

  constructor(options: WorldSystemOptions) {
    super();

    const { world, windowNodeId, useWindow } =
      options as KeyboardInputSystemOptions;

    this.world = world;

    const windowNode = useWindow
      ? window
      : getWindowNode(windowNodeId as string);

    this.inputListener = new InputListener(windowNode);

    this.inputListener.startListen();
  }

  onWorldDestroy(): void {
    this.inputListener.stopListen();
  }

  update(): void {
    this.inputListener.getEvents().forEach((event) => {
      this.world.dispatchEvent(KeyboardInput, event);
    });

    this.inputListener.clear();
  }
}

KeyboardInputSystem.systemName = 'KeyboardInputSystem';
