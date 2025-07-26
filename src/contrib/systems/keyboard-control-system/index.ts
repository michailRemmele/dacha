import { WorldSystem } from '../../../engine/system';
import { ActorCollection } from '../../../engine/actor';
import type { WorldSystemOptions } from '../../../engine/system';
import type { Actor } from '../../../engine/actor';
import type { Scene } from '../../../engine/scene';
import type { World } from '../../../engine/world';
import { KeyboardControl } from '../../components/keyboard-control';
import type { KeyboardEventBind } from '../../components/keyboard-control';
import { KeyboardInput } from '../../events';
import type { KeyboardInputEvent } from '../../events';

export class KeyboardControlSystem extends WorldSystem {
  private world: World;
  private actorCollection?: ActorCollection;

  private pressedKeys: Set<string>;
  private events: KeyboardInputEvent[];

  constructor(options: WorldSystemOptions) {
    super();

    this.world = options.world;

    this.pressedKeys = new Set();
    this.events = [];

    this.world.addEventListener(KeyboardInput, this.handleKeyboardInput);
  }

  onSceneEnter(scene: Scene): void {
    this.actorCollection = new ActorCollection(scene, {
      components: [KeyboardControl],
    });
  }

  onSceneExit(): void {
    this.actorCollection = undefined;
  }

  onWorldDestroy(): void {
    this.world.removeEventListener(KeyboardInput, this.handleKeyboardInput);
  }

  private handleKeyboardInput = (event: KeyboardInputEvent): void => {
    this.events.push(event);
  };

  private sendEvent(actor: Actor, eventBinding: KeyboardEventBind, code: string): void {
    if (!eventBinding.eventType) {
      throw new Error(`The event type is not specified for input key: ${code}`);
    }

    actor.dispatchEvent(eventBinding.eventType, {
      ...eventBinding.attrs,
    });
  }

  update(): void {
    this.events.forEach((event) => {
      if (!event.pressed) {
        this.pressedKeys.delete(event.key);
      }
    });

    this.actorCollection?.forEach((actor) => {
      const control = actor.getComponent(KeyboardControl);

      // Resend control event when key is pressed without actual event if keepEmit is set to true
      this.pressedKeys.forEach((key) => {
        const inputBinding = control.inputEventBindings[key]?.pressed;
        if (inputBinding !== undefined && inputBinding.keepEmit) {
          this.sendEvent(actor, inputBinding, key);
        }
      });

      // Send control event on input event excluding repeated browser generated key pressed events
      this.events.forEach((event) => {
        const { key, pressed } = event;
        const inputBinding = control.inputEventBindings[key]?.[pressed ? 'pressed' : 'released'];
        if (inputBinding !== undefined && !this.pressedKeys.has(key)) {
          this.sendEvent(actor, inputBinding, key);
        }
      });
    });

    this.events.forEach((event) => {
      if (event.pressed) {
        this.pressedKeys.add(event.key);
      } else {
        this.pressedKeys.delete(event.key);
      }
    });
    this.events = [];
  }
}

KeyboardControlSystem.systemName = 'KeyboardControlSystem';
