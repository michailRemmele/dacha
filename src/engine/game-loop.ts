import { MessageBus } from './message-bus';
import { SceneProvider } from './scene';

export class GameLoop {
  private gameLoopId: number;
  private previous: number;
  private sceneProvider: SceneProvider;
  private messageBus: MessageBus;
  private bindedTick: () => void;

  constructor(sceneProvider: SceneProvider) {
    this.gameLoopId = 0;
    this.previous = 0;

    this.sceneProvider = sceneProvider;
    this.messageBus = new MessageBus();

    this.bindedTick = this._tick.bind(this);
  }

  private _tick() {
    const current = performance.now();

    const elapsed = current - this.previous;

    this.messageBus.sendDelayed();

    const currentScene = this.sceneProvider.getCurrentScene();
    const options = {
      deltaTime: elapsed,
      messageBus: this.messageBus,
    };

    currentScene.getProcessors().forEach((processor) => {
      processor.process(options);
    });

    this.messageBus.clear();

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
