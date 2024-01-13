import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';
import type { GameObjectObserver } from '../../../engine/game-object';
import type { Scene } from '../../../engine/scene';
import { MouseControl } from '../../components/mouse-control';
import { MouseInput } from '../../events';
import type { MouseInputEvent } from '../../events';

export class MouseControlSystem extends System {
  private gameObjectObserver: GameObjectObserver;
  private scene: Scene;

  constructor(options: SystemOptions) {
    super();

    this.gameObjectObserver = options.createGameObjectObserver({
      components: [
        MouseControl,
      ],
    });
    this.scene = options.scene;
  }

  mount(): void {
    this.scene.addEventListener(MouseInput, this.handleMouseInput);
  }

  unmount(): void {
    this.scene.removeEventListener(MouseInput, this.handleMouseInput);
  }

  private handleMouseInput = (message: MouseInputEvent): void => {
    this.gameObjectObserver.forEach((gameObject) => {
      const control = gameObject.getComponent(MouseControl);
      const eventBinding = control.inputEventBindings[message.eventType]?.[message.button];

      if (eventBinding) {
        if (!eventBinding.messageType) {
          throw new Error(`The message type is not specified for input event: ${message.eventType}`);
        }

        gameObject.emit(eventBinding.messageType, {
          ...eventBinding.attrs,
          x: message.x,
          y: message.y,
          screenX: message.screenX,
          screenY: message.screenY,
        });
      }
    });
  };
}

MouseControlSystem.systemName = 'MouseControlSystem';
