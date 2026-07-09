import type { SceneManager } from './scene';
import type { Time } from './time';
import { eventQueue } from './event-target';
import {
  DEFAULT_FIXED_UPDATE_RATE,
  DEFAULT_MAX_FPS,
  DEFAULT_MAX_FRAME_DELTA,
  DEFAULT_MAX_FIXED_UPDATES_PER_FRAME,
} from './consts';

export interface PerformanceSettings {
  maxFPS?: number;
  fixedUpdateRate?: number;
  maxFrameDelta?: number;
  maxFixedUpdatesPerFrame?: number;
}

export class GameLoop {
  private sceneManager: SceneManager;
  private time: Time;

  private msPerUpdate: number;
  private msPerFixedUpdate: number;
  private maxFrameDelta: number;
  private maxFixedUpdatesPerFrame: number;

  private gameLoopId: number;
  private previous: number;
  private lag: number;
  private bindedTick: () => void;

  constructor(
    sceneManager: SceneManager,
    time: Time,
    performance?: PerformanceSettings,
  ) {
    this.sceneManager = sceneManager;
    this.time = time;

    this.msPerUpdate = 1000 / (performance?.maxFPS || DEFAULT_MAX_FPS);
    this.msPerFixedUpdate =
      1000 / (performance?.fixedUpdateRate || DEFAULT_FIXED_UPDATE_RATE);
    this.maxFrameDelta = performance?.maxFrameDelta || DEFAULT_MAX_FRAME_DELTA;
    this.maxFixedUpdatesPerFrame =
      performance?.maxFixedUpdatesPerFrame ||
      DEFAULT_MAX_FIXED_UPDATES_PER_FRAME;

    this.time.fixedDeltaTime = this.msPerFixedUpdate / 1000;

    this.gameLoopId = 0;
    this.previous = 0;
    this.lag = 0;

    this.bindedTick = this.tick.bind(this);
  }

  private tick(): void {
    this.gameLoopId = requestAnimationFrame(this.bindedTick);

    const current = performance.now();
    const elapsed = Math.min(current - this.previous, this.maxFrameDelta);

    if (elapsed < this.msPerUpdate) {
      return;
    }

    this.lag += elapsed;

    eventQueue.update();

    const systems = this.sceneManager.getSystems();

    let fixedUpdates = 0;

    while (
      this.lag >= this.msPerFixedUpdate &&
      fixedUpdates < this.maxFixedUpdatesPerFrame
    ) {
      systems.forEach((system) => {
        system.fixedUpdate?.();
      });

      this.lag -= this.msPerFixedUpdate;
      fixedUpdates += 1;
    }

    if (fixedUpdates === this.maxFixedUpdatesPerFrame) {
      this.lag = 0;
    }

    this.time._tick(elapsed / 1000, this.lag / this.msPerFixedUpdate);

    systems.forEach((system) => {
      system.update?.();
    });

    if (this.msPerUpdate > 0) {
      this.previous = current - (elapsed % this.msPerUpdate);
    } else {
      this.previous = current;
    }
  }

  run(): void {
    if (this.gameLoopId) {
      return;
    }

    this.previous = performance.now();
    this.lag = 0;
    this.time._reset();

    this.gameLoopId = requestAnimationFrame(this.bindedTick);
  }

  stop(): void {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = 0;
    }
  }
}
