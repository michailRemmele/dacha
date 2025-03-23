import { System } from '../../../engine/system';
import type {
  SystemOptions,
  UpdateOptions,
} from '../../../engine/system';
import { Actor, ActorCollection } from '../../../engine/actor';
import type { ActorSpawner } from '../../../engine/actor';
import type { Scene } from '../../../engine/scene';
import { ScriptBundle } from '../../components';
import { RemoveActor } from '../../../engine/events';
import type { RemoveActorEvent } from '../../../engine/events';

import { Script } from './types';
import type { ScriptOptions, ScriptConstructor } from './types';

export { Script, ScriptOptions, ScriptConstructor };

export class ScriptSystem extends System {
  private scriptsCollection: ActorCollection;
  private actorSpawner: ActorSpawner;
  private globalOptions: Record<string, unknown>;
  private scripts: Record<string, ScriptConstructor>;
  private scene: Scene;
  private activeScripts: Record<string, Array<Script>>;

  constructor(options: SystemOptions) {
    super();

    const {
      actorSpawner,
      scene,
      globalOptions,
      resources = {},
    } = options;

    this.scene = scene;
    this.scriptsCollection = new ActorCollection(scene, {
      components: [
        ScriptBundle,
      ],
    });
    this.actorSpawner = actorSpawner;
    this.globalOptions = globalOptions;
    this.scripts = (resources as Array<ScriptConstructor>).reduce((acc, script) => {
      if (script.scriptName === undefined) {
        throw new Error(`Missing scriptName field for ${script.name} script.`);
      }

      acc[script.scriptName] = script;
      return acc;
    }, {} as Record<string, ScriptConstructor>);

    this.activeScripts = {};
  }

  mount(): void {
    this.scriptsCollection.addEventListener(RemoveActor, this.handleActorRemove);
  }

  unmount(): void {
    this.scriptsCollection.removeEventListener(RemoveActor, this.handleActorRemove);

    this.scriptsCollection.forEach((actor) => {
      this.activeScripts[actor.id].forEach((script) => script.destroy?.());
      delete this.activeScripts[actor.id];
    });
  }

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;
    this.activeScripts[actor.id].forEach((script) => script.destroy?.());
    delete this.activeScripts[actor.id];
  };

  private setUpScript(actor: Actor): void {
    const { scripts } = actor.getComponent(ScriptBundle);
    this.activeScripts[actor.id] = scripts.map((script) => {
      const ScriptClass = this.scripts[script.name];
      return new ScriptClass({
        ...script.options,
        actor,
        actorSpawner: this.actorSpawner,
        scene: this.scene,
        globalOptions: this.globalOptions,
      });
    });
  }

  update(options: UpdateOptions): void {
    this.scriptsCollection.forEach((actor) => {
      if (!this.activeScripts[actor.id]) {
        this.setUpScript(actor);
      }

      this.activeScripts[actor.id].forEach((script) => script.update?.(options));
    });
  }
}

ScriptSystem.systemName = 'ScriptSystem';
