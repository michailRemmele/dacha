import { WorldSystem } from '../../../engine/system';
import { ActorCollection } from '../../../engine/actor';
import type { WorldSystemOptions } from '../../../engine/system';
import type { Scene } from '../../../engine/scene';
import type { World } from '../../../engine/world';
import { MouseControl } from '../../components/mouse-control';
import { MouseInput } from '../../events';
import type { MouseInputEvent } from '../../events';

export class MouseControlSystem extends WorldSystem {
  private actorCollection?: ActorCollection;
  private world: World;

  constructor(options: WorldSystemOptions) {
    super();

    this.world = options.world;

    this.world.addEventListener(MouseInput, this.handleMouseInput);
  }

  onSceneEnter(scene: Scene): void {
    this.actorCollection = new ActorCollection(scene, {
      components: [MouseControl],
    });
  }

  onSceneExit(): void {
    this.actorCollection = undefined;
  }

  onWorldDestroy(): void {
    this.world.removeEventListener(MouseInput, this.handleMouseInput);
  }

  private handleMouseInput = (event: MouseInputEvent): void => {
    this.actorCollection?.forEach((actor) => {
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
