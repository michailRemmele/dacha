import { System } from '../../../engine/system';
import type {
  SystemOptions,
  UpdateOptions,
} from '../../../engine/system';
import { GameObject } from '../../../engine/game-object';
import type {
  GameObjectObserver,
  GameObjectSpawner,
  GameObjectDestroyer,
} from '../../../engine/game-object';
import type { Scene } from '../../../engine/scene';
import { ScriptBundle } from '../../components';
import { AddGameObject, RemoveGameObject } from '../../../engine/events';
import type { UpdateGameObjectEvent } from '../../../engine/events';

import { Script } from './types';
import type { ScriptOptions, ScriptConstructor } from './types';

export { Script, ScriptOptions, ScriptConstructor };

export class ScriptSystem extends System {
  private gameObjectObserver: GameObjectObserver;
  private scriptsObserver: GameObjectObserver;
  private gameObjectSpawner: GameObjectSpawner;
  private gameObjectDestroyer: GameObjectDestroyer;
  private scripts: Record<string, ScriptConstructor>;
  private scene: Scene;
  private activeScripts: Record<string, Array<Script>>;

  constructor(options: SystemOptions) {
    super();

    const {
      createGameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      scene,
      resources = {},
    } = options;

    this.scene = scene;
    this.gameObjectObserver = createGameObjectObserver({});
    this.scriptsObserver = createGameObjectObserver({
      components: [
        ScriptBundle,
      ],
    });
    this.gameObjectSpawner = gameObjectSpawner;
    this.gameObjectDestroyer = gameObjectDestroyer;
    this.scripts = (resources as Array<ScriptConstructor>).reduce((acc, script) => {
      if (script.scriptName === undefined) {
        throw new Error(`Missing scriptName field for ${script.name} script.`);
      }

      acc[script.scriptName] = script;
      return acc;
    }, {} as Record<string, ScriptConstructor>);

    this.activeScripts = {};

    this.scriptsObserver.forEach(this.handleGameObjectAdd);
  }

  mount(): void {
    this.scriptsObserver.addEventListener(AddGameObject, this.handleGameObjectAdd);
    this.scriptsObserver.addEventListener(RemoveGameObject, this.handleGameObjectRemove);
  }

  unmount(): void {
    this.scriptsObserver.removeEventListener(AddGameObject, this.handleGameObjectAdd);
    this.scriptsObserver.removeEventListener(RemoveGameObject, this.handleGameObjectRemove);
  }

  private handleGameObjectAdd = (value: UpdateGameObjectEvent | GameObject): void => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;

    const { scripts } = gameObject.getComponent(ScriptBundle);
    this.activeScripts[gameObject.id] = scripts.map((script) => {
      const ScriptClass = this.scripts[script.name];
      return new ScriptClass({
        ...script.options,
        gameObject,
        gameObjectObserver: this.gameObjectObserver,
        gameObjectSpawner: this.gameObjectSpawner,
        gameObjectDestroyer: this.gameObjectDestroyer,
        scene: this.scene,
      });
    });
  };

  private handleGameObjectRemove = (event: UpdateGameObjectEvent): void => {
    const { gameObject } = event;
    this.activeScripts[gameObject.id].forEach((script) => script.destroy?.());
    delete this.activeScripts[gameObject.id];
  };

  update(options: UpdateOptions): void {
    this.scriptsObserver.forEach((gameObject) => {
      this.activeScripts[gameObject.id].forEach((script) => script.update?.(options));
    });
  }
}

ScriptSystem.systemName = 'ScriptSystem';
