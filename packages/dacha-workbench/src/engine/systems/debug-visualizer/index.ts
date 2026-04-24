import { SceneSystem, ActorQuery, Actor, type SceneSystemOptions } from 'dacha';
import {
  AddActor,
  type AddActorEvent,
  RemoveActor,
  type RemoveActorEvent,
} from 'dacha/events';

import { Technical } from '../../components';
import { persistentStorage } from '../../../persistent-storage';

import { modules } from './modules';
import type { DebugViewModule } from './types';

export class DebugVisualizer extends SceneSystem {
  private options: SceneSystemOptions;

  private actorQuery: ActorQuery;

  private debugActorMap: Map<DebugViewModule, Map<Actor, Actor | null>>;

  constructor(options: SceneSystemOptions) {
    super();

    this.options = options;

    this.actorQuery = new ActorQuery({
      scene: options.scene,
      filter: (actor): boolean =>
        !actor.getComponent(Technical) &&
        modules.some((module) => module.validate(actor)),
    });

    this.debugActorMap = new Map();

    modules.forEach((module) => {
      const isModuleEnabled = persistentStorage.get(
        `canvas.debugVisualizer.layers.${module.id}`,
        false,
      );

      if (isModuleEnabled) {
        this.debugActorMap.set(module, new Map<Actor, Actor | null>());
      }
    });

    window.electron.setDebugLayers(
      modules.map((module) => ({
        id: module.id,
        title: module.title,
        enabled: persistentStorage.get(
          `canvas.debugVisualizer.layers.${module.id}`,
          false,
        ),
      })),
    );

    window.electron.onToggleDebugLayer((id, enabled) => {
      persistentStorage.set(`canvas.debugVisualizer.layers.${id}`, enabled);

      const module = modules.find((entry) => entry.id === id);
      if (!module) {
        return;
      }

      if (enabled) {
        const moduleActorMap = new Map<Actor, Actor | null>();
        this.actorQuery.getActors().forEach((actor) => {
          if (module.validate(actor)) {
            moduleActorMap.set(actor, null);
          }
        });
        this.debugActorMap.set(module, moduleActorMap);
      } else {
        const moduleActorMap = this.debugActorMap.get(module);
        moduleActorMap?.forEach((debugActor) => {
          debugActor?.remove();
        });
        this.debugActorMap.delete(module);
      }
    });
  }

  onSceneEnter(): void {
    this.debugActorMap.forEach((moduleActorMap, module) => {
      this.actorQuery.getActors().forEach((actor) => {
        if (module.validate(actor)) {
          moduleActorMap.set(actor, null);
        }
      });
    });

    this.actorQuery.addEventListener(AddActor, this.handleActorAdd);
    this.actorQuery.addEventListener(RemoveActor, this.handleActorRemove);
  }

  onSceneDestroy(): void {
    this.actorQuery.removeEventListener(AddActor, this.handleActorAdd);
    this.actorQuery.removeEventListener(RemoveActor, this.handleActorRemove);

    this.actorQuery.destroy();
  }

  private handleActorAdd = ({ actor }: AddActorEvent): void => {
    this.debugActorMap.forEach((moduleActorMap, module) => {
      if (module.validate(actor)) {
        moduleActorMap.set(actor, null);
      }
    });
  };

  private handleActorRemove = ({ actor }: RemoveActorEvent): void => {
    this.debugActorMap.forEach((moduleActorMap) => {
      moduleActorMap.delete(actor);
    });
  };

  update(): void {
    this.debugActorMap.forEach((moduleActorMap, module) => {
      moduleActorMap.forEach((debugActor, actor) => {
        if (debugActor === null) {
          debugActor = module.build(actor, this.options);
          actor.appendChild(debugActor);
          moduleActorMap.set(actor, debugActor);
        }

        module.update(actor, debugActor, this.options);
      });
    });
  }
}

DebugVisualizer.systemName = 'DebugVisualizer';
