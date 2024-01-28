import { System } from '../../../engine/system';
import { GameObjectObserver } from '../../../engine/game-object';
import type { SystemOptions } from '../../../engine/system';
import type { GameObject } from '../../../engine/game-object';
import type { Scene } from '../../../engine/scene';
import { KeyboardControl } from '../../components/keyboard-control';
import type { KeyboardEventBind } from '../../components/keyboard-control';
import { KeyboardInput } from '../../events';
import type { KeyboardInputEvent } from '../../events';

export class KeyboardControlSystem extends System {
  private gameObjectObserver: GameObjectObserver;
  private scene: Scene;

  private pressedKeys: Set<string>;
  private events: Array<KeyboardInputEvent>;

  constructor(options: SystemOptions) {
    super();

    this.gameObjectObserver = new GameObjectObserver(options.scene, {
      components: [
        KeyboardControl,
      ],
    });
    this.scene = options.scene;

    this.pressedKeys = new Set();
    this.events = [];
  }

  mount(): void {
    this.scene.addEventListener(KeyboardInput, this.handleKeyboardInput);
  }

  unmount(): void {
    this.scene.removeEventListener(KeyboardInput, this.handleKeyboardInput);
  }

  private handleKeyboardInput = (event: KeyboardInputEvent): void => {
    this.events.push(event);
  };

  private sendEvent(gameObject: GameObject, eventBinding: KeyboardEventBind, code: string): void {
    if (!eventBinding.eventType) {
      throw new Error(`The event type is not specified for input key: ${code}`);
    }

    gameObject.emit(eventBinding.eventType, {
      ...eventBinding.attrs,
    });
  }

  update(): void {
    this.events.forEach((event) => {
      if (!event.pressed) {
        this.pressedKeys.delete(event.key);
      }
    });

    this.gameObjectObserver.forEach((gameObject) => {
      const control = gameObject.getComponent(KeyboardControl);

      // Resend control event when key is pressed without actual event if keepEmit is set to true
      this.pressedKeys.forEach((key) => {
        const inputBinding = control.inputEventBindings[key]?.pressed;
        if (inputBinding !== undefined && inputBinding.keepEmit) {
          this.sendEvent(gameObject, inputBinding, key);
        }
      });

      // Send control event on input event excluding repeated browser generated key pressed events
      this.events.forEach((event) => {
        const { key, pressed } = event;
        const inputBinding = control.inputEventBindings[key]?.[pressed ? 'pressed' : 'released'];
        if (inputBinding !== undefined && !this.pressedKeys.has(key)) {
          this.sendEvent(gameObject, inputBinding, key);
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
