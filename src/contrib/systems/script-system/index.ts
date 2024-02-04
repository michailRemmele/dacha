import { System } from '../../../engine/system';
import type {
  SystemOptions,
  UpdateOptions,
} from '../../../engine/system';
import { GameObject, GameObjectObserver } from '../../../engine/game-object';
import type { GameObjectSpawner } from '../../../engine/game-object';
import type { Scene } from '../../../engine/scene';
import { ScriptBundle } from '../../components';
import { AddGameObject, RemoveGameObject } from '../../../engine/events';
import type { AddGameObjectEvent, RemoveGameObjectEvent } from '../../../engine/events';

import { Script } from './types';
import type { ScriptOptions, ScriptConstructor } from './types';

export { Script, ScriptOptions, ScriptConstructor };

export class ScriptSystem extends System {
  private scriptsObserver: GameObjectObserver;
  private gameObjectSpawner: GameObjectSpawner;
  private scripts: Record<string, ScriptConstructor>;
  private scene: Scene;
  private activeScripts: Record<string, Array<Script>>;

  constructor(options: SystemOptions) {
    super();

    const {
      gameObjectSpawner,
      scene,
      resources = {},
    } = options;

    this.scene = scene;
    this.scriptsObserver = new GameObjectObserver(scene, {
      components: [
        ScriptBundle,
      ],
    });
    this.gameObjectSpawner = gameObjectSpawner;
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

  private handleGameObjectAdd = (value: AddGameObjectEvent | GameObject): void => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;

    const { scripts } = gameObject.getComponent(ScriptBundle);
    this.activeScripts[gameObject.id] = scripts.map((script) => {
      const ScriptClass = this.scripts[script.name];
      return new ScriptClass({
        ...script.options,
        gameObject,
        gameObjectSpawner: this.gameObjectSpawner,
        scene: this.scene,
      });
    });
  };

  private handleGameObjectRemove = (event: RemoveGameObjectEvent): void => {
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
