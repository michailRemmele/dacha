import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';
import type { GameObject, GameObjectObserver } from '../../../engine/game-object';
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

    this.gameObjectObserver = options.createGameObjectObserver({
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

  private sendMessage(gameObject: GameObject, eventBinding: KeyboardEventBind, code: string): void {
    if (!eventBinding.messageType) {
      throw new Error(`The message type is not specified for input key: ${code}`);
    }

    gameObject.emit(eventBinding.messageType, {
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

      // Resend control message when key is pressed without actual event if keepEmit is set to true
      this.pressedKeys.forEach((key) => {
        const inputBinding = control.inputEventBindings[key]?.pressed;
        if (inputBinding !== undefined && inputBinding.keepEmit) {
          this.sendMessage(gameObject, inputBinding, key);
        }
      });

      // Send control message on input event excluding repeated browser generated key pressed events
      this.events.forEach((event) => {
        const { key, pressed } = event;
        const inputBinding = control.inputEventBindings[key]?.[pressed ? 'pressed' : 'released'];
        if (inputBinding !== undefined && !this.pressedKeys.has(key)) {
          this.sendMessage(gameObject, inputBinding, key);
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
