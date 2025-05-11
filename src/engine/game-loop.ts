import type { SceneManager } from './scene';
import { eventQueue } from './event-target';

const DEFAULT_FIXED_UPDATE_RATE = 50;
const DEFAULT_MAX_FPS = Infinity;

export interface PerformanceSettings {
  maxFPS: number
  fixedUpdateRate: number
}

export class GameLoop {
  private sceneManager: SceneManager;

  private msPerUpdate: number;
  private msPerFixedUpdate: number;

  private gameLoopId: number;
  private previous: number;
  private lag: number;
  private bindedTick: () => void;

  constructor(
    sceneManager: SceneManager,
    performance?: PerformanceSettings,
  ) {
    this.sceneManager = sceneManager;

    this.msPerUpdate = 1000 / (performance?.maxFPS || DEFAULT_MAX_FPS);
    this.msPerFixedUpdate = 1000 / (performance?.fixedUpdateRate || DEFAULT_FIXED_UPDATE_RATE);

    this.gameLoopId = 0;
    this.previous = 0;
    this.lag = 0;

    this.bindedTick = this.tick.bind(this);
  }

  private tick(): void {
    this.gameLoopId = requestAnimationFrame(this.bindedTick);

    const current = performance.now();
    const elapsed = current - this.previous;

    if (elapsed < this.msPerUpdate) {
      return;
    }

    this.lag += elapsed;

    eventQueue.update();

    const systems = this.sceneManager.getSystems();

    const fixedUpdateOptions = { deltaTime: this.msPerFixedUpdate };
    while (this.lag >= this.msPerFixedUpdate) {
      systems.forEach((system) => {
        system.fixedUpdate?.(fixedUpdateOptions);
      });
      this.lag -= this.msPerFixedUpdate;
    }

    const options = { deltaTime: elapsed };
    systems.forEach((system) => {
      system.update?.(options);
    });

    this.previous = current;
  }

  run(): void {
    this.previous = performance.now();
    this.lag = 0;

    this.gameLoopId = requestAnimationFrame(this.bindedTick);
  }

  stop(): void {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
  }
}
