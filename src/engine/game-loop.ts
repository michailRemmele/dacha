import { SceneProvider } from './scene';

export class GameLoop {
  private gameLoopId: number;
  private previous: number;
  private sceneProvider: SceneProvider;
  private bindedTick: () => void;

  constructor(sceneProvider: SceneProvider) {
    this.gameLoopId = 0;
    this.previous = 0;

    this.sceneProvider = sceneProvider;

    this.bindedTick = this._tick.bind(this);
  }

  private _tick() {
    const current = performance.now();

    const elapsed = current - this.previous;

    const currentScene = this.sceneProvider.getCurrentScene();
    const messageBus = currentScene.getMessageBus();

    messageBus.sendDelayed();

    const options = {
      deltaTime: elapsed,
    };

    currentScene.getSystems().forEach((system) => {
      system.update(options);
    });

    messageBus.clear();

    this.previous = current;

    this.gameLoopId = requestAnimationFrame(this.bindedTick);
  }

  run() {
    this.previous = performance.now();

    this.gameLoopId = requestAnimationFrame(this.bindedTick);
  }

  stop() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
  }
}
