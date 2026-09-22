import { WorldSystem } from '../../../engine/system';
import type { WorldSystemOptions } from '../../../engine/system';
import type { Time } from '../../../engine/time';
import type { World } from '../../../engine/world';
import type { Scene } from '../../../engine/scene';
import { GameStatsUpdate } from '../../events';
import { ActorQuery } from '../../../engine/actor';

const DEFAULT_FREQUENCY = 1;

interface GameStatsMeterOptions extends WorldSystemOptions {
  /** How often stats are reported, in seconds. Defaults to 1. */
  frequency: number;
}

/**
 * Measures the frame rate and the number of actors.
 *
 * The system sends the results in the {@link GameStatsUpdateEvent | GameStatsUpdate} event on the world.
 *
 * Options:
 *
 * - `frequency`: how often to send the event, in seconds. The default is `1`.
 *
 * @see [Performance](https://dachajs.org/production/performance/)
 *
 * @category Game Stats
 */
export class GameStatsMeter extends WorldSystem {
  private world: World;
  private time: Time;
  private actorQuery?: ActorQuery;
  private frequency: number;
  private fps: number;
  private elapsed: number;

  constructor(options: WorldSystemOptions) {
    super();

    const { world, frequency } = options as GameStatsMeterOptions;

    this.world = world;
    this.time = options.time;
    this.frequency = frequency || DEFAULT_FREQUENCY;

    this.fps = 0;
    this.elapsed = 0;
  }

  onSceneEnter(scene: Scene): void {
    this.actorQuery = new ActorQuery({ scene, filter: [] });
  }

  onSceneExit(): void {
    this.actorQuery = undefined;
  }

  update(): void {
    this.fps += 1;
    this.elapsed += this.time.deltaTime;

    if (this.elapsed >= this.frequency) {
      this.world.dispatchEvent(GameStatsUpdate, {
        fps: this.fps / this.elapsed,
        actorsCount: this.actorQuery?.getActors().size ?? 0,
      });

      this.fps = 0;
      this.elapsed = 0;
    }
  }
}

GameStatsMeter.systemName = 'GameStatsMeter';
