import uuid from 'uuid-random';

import type { SceneConfig, SystemConfig } from '../types';
import type { ComponentConstructor } from '../component';
import { ActorCreator, ActorSpawner } from '../actor';
import type { TemplateCollection } from '../template';
import type {
  SystemConstructor,
  SceneSystemOptions,
  WorldSystemOptions,
} from '../system';
import type { System } from '../system/system';
import { SceneSystem, WorldSystem } from '../system';
import { World } from '../world';
import {
  LoadScene,
  EnterScene,
  ExitScene,
  DestroyScene,
  SceneLoaded,
  SceneEntered,
  SceneExited,
  SceneDestroyed,
} from '../events';
import type {
  LoadSceneEvent,
  EnterSceneEvent,
  ExitSceneEvent,
  DestroySceneEvent,
} from '../events';

import { Scene } from './scene';

interface SceneManagerOptions {
  sceneConfigs: SceneConfig[]
  systemConfigs: SystemConfig[]
  availableSystems: SystemConstructor[]
  components: ComponentConstructor[]
  templateCollection: TemplateCollection
  globalOptions: Record<string, unknown>
  resources: Record<string, unknown>
}

export class SceneManager {
  private sceneConfigs: Record<string, SceneConfig>;
  private systemConfigs: SystemConfig[];
  private availableSystems: Record<string, SystemConstructor>;
  private templateCollection: TemplateCollection;
  private globalOptions: Record<string, unknown>;
  private resources: Record<string, unknown>;
  private actorCreator: ActorCreator;
  private actorSpawner: ActorSpawner;

  private world: World;
  private loadedScenes: Map<string, Scene>;
  private systems: Map<string, WorldSystem | Map<string, SceneSystem>>;
  private activeSceneId?: string;

  constructor({
    sceneConfigs,
    systemConfigs,
    availableSystems,
    components,
    templateCollection,
    globalOptions,
    resources,
  }: SceneManagerOptions) {
    this.availableSystems = availableSystems.reduce((acc, AvailableSystem) => {
      acc[AvailableSystem.systemName] = AvailableSystem;
      return acc;
    }, {} as Record<string, SystemConstructor>);
    this.sceneConfigs = sceneConfigs.reduce((acc: Record<string, SceneConfig>, scene) => {
      acc[scene.id] = scene;
      return acc;
    }, {});
    this.systemConfigs = systemConfigs.filter((config) => this.availableSystems[config.name]);
    this.templateCollection = templateCollection;
    this.globalOptions = globalOptions;
    this.resources = resources;
    this.actorCreator = new ActorCreator(components, templateCollection);
    this.actorSpawner = new ActorSpawner(this.actorCreator);

    this.world = new World({ id: uuid(), name: 'world' });
    this.loadedScenes = new Map();
    this.systems = new Map();
    this.activeSceneId = undefined;

    this.systemConfigs.forEach((config) => {
      const SystemClass = this.availableSystems[config.name];
      if (Object.getPrototypeOf(SystemClass) === WorldSystem) {
        const options: WorldSystemOptions = {
          ...config.options,
          templateCollection: this.templateCollection,
          actorSpawner: this.actorSpawner,
          resources: this.resources[config.name],
          globalOptions: this.globalOptions,
          world: this.world,
        };
        this.systems.set(config.name, new SystemClass(options) as WorldSystem);
      }
      if (Object.getPrototypeOf(SystemClass) === SceneSystem) {
        this.systems.set(config.name, new Map());
      }
    });

    this.world.addEventListener(LoadScene, this.handleLoadScene);
    this.world.addEventListener(EnterScene, this.handleEnterScene);
    this.world.addEventListener(ExitScene, this.handleExitScene);
    this.world.addEventListener(DestroyScene, this.handleDestroyScene);
  }

  async loadWorld(): Promise<void> {
    const worldSystems = this.getSystems().filter((system) => system instanceof WorldSystem);

    await Promise.all(
      worldSystems.map((system) => (system as WorldSystem).onWorldLoad?.(this.world)),
    );

    worldSystems.forEach((system) => (system as WorldSystem).onWorldReady?.(this.world));
  }

  destroyWorld(): void {
    this.exitActiveScene();

    this.loadedScenes.forEach((scene) => {
      this.destroyScene(scene.id);
    });

    this.getSystems().forEach((system) => {
      if (system instanceof WorldSystem) {
        system.onWorldDestroy?.(this.world);
      }
    });
    this.systems.clear();

    this.world.removeEventListener(LoadScene, this.handleLoadScene);
    this.world.removeEventListener(EnterScene, this.handleEnterScene);
    this.world.removeEventListener(ExitScene, this.handleExitScene);
    this.world.removeEventListener(DestroyScene, this.handleDestroyScene);
  }

  private handleLoadScene = (event: LoadSceneEvent): void => {
    const { id, autoEnter = true, autoDestroy = true } = event;

    void this.loadScene(id, autoEnter, autoDestroy);
  };

  private handleEnterScene = (event: EnterSceneEvent): void => {
    const { id, autoDestroy = true } = event;

    this.enterScene(id, autoDestroy);
  };

  private handleExitScene = (event: ExitSceneEvent): void => {
    const { autoDestroy = true } = event;

    this.exitActiveScene(autoDestroy);
  };

  private handleDestroyScene = (event: DestroySceneEvent): void => {
    this.destroyScene(event.id);
  };

  getActiveScene(): Scene | undefined {
    if (!this.activeSceneId) {
      return undefined;
    }

    return this.world.findChildById(this.activeSceneId, false) as Scene | undefined;
  }

  getSystems(scene?: Scene): System[] {
    scene ??= this.getActiveScene();

    return this.systemConfigs.reduce((acc: System[], config) => {
      const entry = this.systems.get(config.name);
      if (entry instanceof WorldSystem) {
        acc.push(entry);
      }
      if (entry instanceof Map && scene && entry.has(scene.id)) {
        acc.push(entry.get(scene.id)!);
      }
      return acc;
    }, []);
  }

  async loadScene(
    id: string,
    autoEnter?: boolean,
    autoDestroy?: boolean,
  ): Promise<void> {
    if (!this.sceneConfigs[id]) {
      throw new Error(`Error while loading scene. Not found scene with id: ${id}`);
    }

    const scene = new Scene({
      ...this.sceneConfigs[id],
      actorCreator: this.actorCreator,
      templateCollection: this.templateCollection,
    });

    this.systemConfigs.forEach((config) => {
      const SystemClass = this.availableSystems[config.name];
      if (Object.getPrototypeOf(SystemClass) === SceneSystem) {
        const options: SceneSystemOptions = {
          ...config.options,
          templateCollection: this.templateCollection,
          actorSpawner: this.actorSpawner,
          resources: this.resources[config.name],
          globalOptions: this.globalOptions,
          scene,
          world: this.world,
        };
        const sceneSystems = this.systems.get(config.name) as Map<string, SceneSystem>;
        sceneSystems.set(scene.id, new SystemClass(options) as SceneSystem);
      }
    });

    await Promise.all(this.getSystems(scene).map((system) => system.onSceneLoad?.(scene)));

    this.loadedScenes.set(scene.id, scene);

    this.world.dispatchEvent(SceneLoaded, { scene });

    if (autoEnter) {
      this.enterScene(id, autoDestroy);
    }
  }

  enterScene(id: string, autoDestroy?: boolean): void {
    const scene = this.loadedScenes.get(id);
    if (!scene) {
      throw new Error(`Error while entering scene. Not found scene with same id: ${id}`);
    }

    this.exitActiveScene(autoDestroy);

    this.world.appendChild(scene);

    this.getSystems(scene).forEach((system) => system.onSceneEnter?.(scene));

    this.activeSceneId = id;

    this.world.dispatchEvent(SceneEntered, { scene });
  }

  exitActiveScene(autoDestroy?: boolean): void {
    const scene = this.getActiveScene();
    if (!scene) {
      return;
    }

    this.getSystems(scene).forEach((system) => system.onSceneExit?.(scene));

    scene.remove();

    this.activeSceneId = undefined;

    this.world.dispatchEvent(SceneExited, { scene });

    if (autoDestroy) {
      this.destroyScene(scene.id);
    }
  }

  destroyScene(id: string): void {
    const scene = this.loadedScenes.get(id);
    if (!scene) {
      return;
    }
    if (scene.id === this.activeSceneId) {
      throw new Error('Error while destroying scene. Cannot destroy active scene. You should exit first.');
    }

    this.getSystems(scene).forEach((system) => system.onSceneDestroy?.(scene));
    this.systemConfigs.forEach((config) => {
      const entry = this.systems.get(config.name);
      if (entry instanceof Map && entry.has(scene.id)) {
        entry.delete(scene.id);
      }
    });

    this.loadedScenes.delete(id);
    this.world.dispatchEvent(SceneDestroyed, { scene });
  }
}
