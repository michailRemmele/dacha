import { System } from '../../../engine/system';
import type {
  SystemOptions,
  UpdateOptions,
} from '../../../engine/system';
import { Actor, ActorCollection } from '../../../engine/actor';
import type { ActorSpawner } from '../../../engine/actor';
import type { Scene } from '../../../engine/scene';
import { ScriptBundle } from '../../components';
import { AddActor, RemoveActor } from '../../../engine/events';
import type { AddActorEvent, RemoveActorEvent } from '../../../engine/events';

import { Script } from './types';
import type { ScriptOptions, ScriptConstructor } from './types';

export { Script, ScriptOptions, ScriptConstructor };

export class ScriptSystem extends System {
  private scriptsObserver: ActorCollection;
  private actorSpawner: ActorSpawner;
  private scripts: Record<string, ScriptConstructor>;
  private scene: Scene;
  private activeScripts: Record<string, Array<Script>>;

  constructor(options: SystemOptions) {
    super();

    const {
      actorSpawner,
      scene,
      resources = {},
    } = options;

    this.scene = scene;
    this.scriptsObserver = new ActorCollection(scene, {
      components: [
        ScriptBundle,
      ],
    });
    this.actorSpawner = actorSpawner;
    this.scripts = (resources as Array<ScriptConstructor>).reduce((acc, script) => {
      if (script.scriptName === undefined) {
        throw new Error(`Missing scriptName field for ${script.name} script.`);
      }

      acc[script.scriptName] = script;
      return acc;
    }, {} as Record<string, ScriptConstructor>);

    this.activeScripts = {};

    this.scriptsObserver.forEach(this.handleActorAdd);
  }

  mount(): void {
    this.scriptsObserver.addEventListener(AddActor, this.handleActorAdd);
    this.scriptsObserver.addEventListener(RemoveActor, this.handleActorRemove);
  }

  unmount(): void {
    this.scriptsObserver.removeEventListener(AddActor, this.handleActorAdd);
    this.scriptsObserver.removeEventListener(RemoveActor, this.handleActorRemove);
  }

  private handleActorAdd = (value: AddActorEvent | Actor): void => {
    const actor = value instanceof Actor ? value : value.actor;

    const { scripts } = actor.getComponent(ScriptBundle);
    this.activeScripts[actor.id] = scripts.map((script) => {
      const ScriptClass = this.scripts[script.name];
      return new ScriptClass({
        ...script.options,
        actor,
        actorSpawner: this.actorSpawner,
        scene: this.scene,
      });
    });
  };

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;
    this.activeScripts[actor.id].forEach((script) => script.destroy?.());
    delete this.activeScripts[actor.id];
  };

  update(options: UpdateOptions): void {
    this.scriptsObserver.forEach((actor) => {
      this.activeScripts[actor.id].forEach((script) => script.update?.(options));
    });
  }
}

ScriptSystem.systemName = 'ScriptSystem';
