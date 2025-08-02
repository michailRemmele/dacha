import { WorldSystem } from '../../../engine/system';
import { ActorQuery } from '../../../engine/actor';
import type { WorldSystemOptions } from '../../../engine/system';
import type { Scene } from '../../../engine/scene';
import type { World } from '../../../engine/world';
import { MouseControl } from '../../components/mouse-control';
import { MouseInput } from '../../events';
import type { MouseInputEvent } from '../../events';

export class MouseControlSystem extends WorldSystem {
  private actorQuery?: ActorQuery;
  private world: World;

  constructor(options: WorldSystemOptions) {
    super();

    this.world = options.world;

    this.world.addEventListener(MouseInput, this.handleMouseInput);
  }

  onSceneEnter(scene: Scene): void {
    this.actorQuery = new ActorQuery({ scene, filter: [MouseControl] });
  }

  onSceneExit(): void {
    this.actorQuery = undefined;
  }

  onWorldDestroy(): void {
    this.world.removeEventListener(MouseInput, this.handleMouseInput);
  }

  private handleMouseInput = (event: MouseInputEvent): void => {
    this.actorQuery?.getActors().forEach((actor) => {
      const control = actor.getComponent(MouseControl);
      const eventBinding =
        control.inputEventBindings[event.eventType]?.[event.button];

      if (eventBinding) {
        if (!eventBinding.eventType) {
          throw new Error(
            `The event type is not specified for input event: ${event.eventType}`,
          );
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
