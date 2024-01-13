import type { SystemOptions } from '../../../../../engine/system';
import type { Scene } from '../../../../../engine/scene';
import { MouseInput } from '../../../../events';
import { getWindowNode } from '../../../../utils/get-window-node';

import { MouseInputListener } from './mouse-input-listener';

interface InputSubsystemOptions extends SystemOptions {
  windowNodeId?: string
  useWindow: boolean
}

export class InputSubsystem {
  private scene: Scene;
  private inputListener: MouseInputListener;

  constructor(options: SystemOptions) {
    const {
      scene,
      windowNodeId,
      useWindow,
    } = options as InputSubsystemOptions;

    this.scene = scene;

    const windowNode = useWindow ? window : getWindowNode(windowNodeId as string);

    this.inputListener = new MouseInputListener(windowNode);
  }

  mount(): void {
    this.inputListener.startListen();
  }

  unmount(): void {
    this.inputListener.stopListen();
  }

  update(): void {
    this.inputListener.getFiredEvents().forEach((inputEvent) => {
      this.scene.emit(MouseInput, inputEvent);
    });
    this.inputListener.clearFiredEvents();
  }
}
