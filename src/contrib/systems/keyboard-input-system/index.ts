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
 * Keyboard input system that captures and processes keyboard events
 *
 * Listens for keyboard input events and dispatches them as KeyboardInput events
 * to the world
 *
 * @extends WorldSystem
 * 
 * @category Systems
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
