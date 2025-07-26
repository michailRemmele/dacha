import { Scene } from '../..';
import { World } from '../../../world';
import {
  WorldSystem,
  SceneSystem,
  WorldSystemOptions,
  SceneSystemOptions,
} from '../../../system';

interface SceneSystemFns {
  loadSceneFn: (scene: Scene) => Promise<void>
  enterSceneFn: (scene: Scene) => void
  exitSceneFn: (scene: Scene) => void
  destroySceneFn: (scene: Scene) => void
}

interface WorldSystemFns extends SceneSystemFns {
  loadWorldFn: (world: World) => Promise<void>
  readyWorldFn: (world: World) => void
  destroyWorldFn: (world: World) => void
}

export class SceneSystemMock extends SceneSystem {
  private fns?: SceneSystemFns;

  constructor(options: SceneSystemOptions) {
    super();
    this.fns = options.resources as SceneSystemFns | undefined;
  }

  async onSceneLoad(scene: Scene): Promise<void> {
    await this.fns?.loadSceneFn(scene);
  }

  onSceneEnter(scene: Scene): void {
    this.fns?.enterSceneFn(scene);
  }

  onSceneExit(scene: Scene): void {
    this.fns?.exitSceneFn(scene);
  }

  onSceneDestroy(scene: Scene): void {
    this.fns?.destroySceneFn(scene);
  }
}

export class WorldSystemMock extends WorldSystem {
  private fns?: WorldSystemFns;

  constructor(options: WorldSystemOptions) {
    super();
    this.fns = options.resources as WorldSystemFns | undefined;
  }

  async onWorldLoad(world: World): Promise<void> {
    await this.fns?.loadWorldFn(world);
  }

  onWorldReady(world: World): void {
    this.fns?.readyWorldFn(world);
  }

  onWorldDestroy(world: World): void {
    this.fns?.destroyWorldFn(world);
  }

  async onSceneLoad(scene: Scene): Promise<void> {
    await this.fns?.loadSceneFn(scene);
  }

  onSceneEnter(scene: Scene): void {
    this.fns?.enterSceneFn(scene);
  }

  onSceneExit(scene: Scene): void {
    this.fns?.exitSceneFn(scene);
  }

  onSceneDestroy(scene: Scene): void {
    this.fns?.destroySceneFn(scene);
  }
}
