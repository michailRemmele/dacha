import { WorldSystem } from '../../../engine/system';
import type { WorldSystemOptions, UpdateOptions } from '../../../engine/system';
import type { World } from '../../../engine/world';
import type { Scene } from '../../../engine/scene';
import { GameStatsUpdate } from '../../events';
import { ActorCollection } from '../../../engine/actor';

const MS_IN_SEC = 1000;

interface GameStatsMeterOptions extends WorldSystemOptions {
  frequency: number;
}

export class GameStatsMeter extends WorldSystem {
  private world: World;
  private actorCollection?: ActorCollection;
  private frequency: number;
  private fps: number;
  private time: number;

  constructor(options: WorldSystemOptions) {
    super();

    const {
      world,
      frequency,
    } = options as GameStatsMeterOptions;

    this.world = world;
    this.frequency = frequency || MS_IN_SEC;

    this.fps = 0;
    this.time = 0;
  }

  onSceneEnter(scene: Scene): void {
    this.actorCollection = new ActorCollection(scene);
  }

  onSceneExit(): void {
    this.actorCollection = undefined;
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.fps += 1;
    this.time += deltaTime;

    if (this.time >= this.frequency) {
      this.world.dispatchEvent(GameStatsUpdate, {
        fps: (this.fps * MS_IN_SEC) / this.time,
        actorsCount: this.actorCollection?.size ?? 0,
      });

      this.fps = 0;
      this.time = 0;
    }
  }
}

GameStatsMeter.systemName = 'GameStatsMeter';
