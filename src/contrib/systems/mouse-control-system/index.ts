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

  private handleMouseInput = (event: MouseInputEvent): void => {
    this.gameObjectObserver.forEach((gameObject) => {
      const control = gameObject.getComponent(MouseControl);
      const eventBinding = control.inputEventBindings[event.eventType]?.[event.button];

      if (eventBinding) {
        if (!eventBinding.eventType) {
          throw new Error(`The event type is not specified for input event: ${event.eventType}`);
        }

        gameObject.emit(eventBinding.eventType, {
          ...eventBinding.attrs,
          x: event.x,
          y: event.y,
          screenX: event.screenX,
          screenY: event.screenY,
        });
      }
    });
  };
}

MouseControlSystem.systemName = 'MouseControlSystem';
