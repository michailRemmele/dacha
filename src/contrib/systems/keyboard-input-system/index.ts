import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';
import type { Scene } from '../../../engine/scene';
import { KeyboardInput } from '../../events';
import { getWindowNode } from '../../utils/get-window-node';

import { InputListener } from './input-listener';

interface KeyboardInputSystemOptions extends SystemOptions {
  windowNodeId?: string
  useWindow: boolean
}

export class KeyboardInputSystem extends System {
  private scene: Scene;
  private inputListener: InputListener;

  constructor(options: SystemOptions) {
    super();

    const {
      scene,
      windowNodeId,
      useWindow,
    } = options as KeyboardInputSystemOptions;

    this.scene = scene;

    const windowNode = useWindow ? window : getWindowNode(windowNodeId as string);

    this.inputListener = new InputListener(windowNode);
  }

  mount(): void {
    this.inputListener.startListen();
  }

  unmount(): void {
    this.inputListener.stopListen();
  }

  update(): void {
    this.inputListener.getEvents().forEach((event) => {
      this.scene.dispatchEvent(KeyboardInput, event);
    });

    this.inputListener.clear();
  }
}

KeyboardInputSystem.systemName = 'KeyboardInputSystem';
