import type { WorldSystemOptions } from '../../../../../engine/system';
import type { World } from '../../../../../engine/world';
import { MouseInput } from '../../../../events';
import { getWindowNode } from '../../../../utils/get-window-node';

import { MouseInputListener } from './mouse-input-listener';

interface InputSubsystemOptions extends WorldSystemOptions {
  windowNodeId?: string
  useWindow: boolean
}

export class InputSubsystem {
  private world: World;
  private inputListener: MouseInputListener;

  constructor(options: WorldSystemOptions) {
    const {
      world,
      windowNodeId,
      useWindow,
    } = options as InputSubsystemOptions;

    this.world = world;

    const windowNode = useWindow ? window : getWindowNode(windowNodeId as string);

    this.inputListener = new MouseInputListener(windowNode);

    this.inputListener.startListen();
  }

  destroy(): void {
    this.inputListener.stopListen();
  }

  update(): void {
    this.inputListener.getFiredEvents().forEach((inputEvent) => {
      this.world.dispatchEvent(MouseInput, inputEvent);
    });
    this.inputListener.clearFiredEvents();
  }
}
