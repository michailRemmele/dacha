import { System } from '../../../engine/system';
import type { SystemOptions, UpdateOptions } from '../../../engine/system';
import type { GameObjectObserver } from '../../../engine/game-object';
import type { Scene } from '../../../engine/scene';
import { GameStatsUpdate } from '../../events';

const MS_IN_SEC = 1000;

interface GameStatsMeterOptions extends SystemOptions {
  frequency: number;
}

export class GameStatsMeter extends System {
  private gameObjectObserver: GameObjectObserver;
  private scene: Scene;
  private frequency: number;
  private fps: number;
  private time: number;

  constructor(options: SystemOptions) {
    super();

    const {
      createGameObjectObserver,
      scene,
      frequency,
    } = options as GameStatsMeterOptions;

    this.gameObjectObserver = createGameObjectObserver({});
    this.scene = scene;
    this.frequency = frequency || MS_IN_SEC;

    this.fps = 0;
    this.time = 0;
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.fps += 1;
    this.time += deltaTime;

    if (this.time >= this.frequency) {
      this.scene.emit(GameStatsUpdate, {
        fps: (this.fps * MS_IN_SEC) / this.time,
        gameObjectsCount: this.gameObjectObserver.size(),
      });

      this.fps = 0;
      this.time = 0;
    }
  }
}

GameStatsMeter.systemName = 'GameStatsMeter';
