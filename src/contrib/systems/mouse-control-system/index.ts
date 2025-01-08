import { System } from '../../../engine/system';
import { ActorCollection } from '../../../engine/actor';
import type { SystemOptions } from '../../../engine/system';
import type { Scene } from '../../../engine/scene';
import { MouseControl } from '../../components/mouse-control';
import { MouseInput } from '../../events';
import type { MouseInputEvent } from '../../events';

export class MouseControlSystem extends System {
  private actorCollection: ActorCollection;
  private scene: Scene;

  constructor(options: SystemOptions) {
    super();

    this.actorCollection = new ActorCollection(options.scene, {
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
    this.actorCollection.forEach((actor) => {
      const control = actor.getComponent(MouseControl);
      const eventBinding = control.inputEventBindings[event.eventType]?.[event.button];

      if (eventBinding) {
        if (!eventBinding.eventType) {
          throw new Error(`The event type is not specified for input event: ${event.eventType}`);
        }

        actor.dispatchEvent(eventBinding.eventType, {
          ...eventBinding.attrs,
          x: event.x,
          y: event.y,
          screenX: event.screenX,
          screenY: event.screenY,
          nativeEvent: event.nativeEvent,
        });
      }
    });
  };
}

MouseControlSystem.systemName = 'MouseControlSystem';
