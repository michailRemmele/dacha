import { GameLoop } from '../game-loop';
import type { SceneManager } from '../scene';
import type { System } from '../system';

describe('Engine -> GameLoop', () => {
  let now: number;
  let frameCallback: FrameRequestCallback | undefined;
  let originalPerformance: Performance;
  let originalRequestAnimationFrame: typeof requestAnimationFrame;
  let originalCancelAnimationFrame: typeof cancelAnimationFrame;

  const createGameLoop = (
    system: Partial<System>,
    performanceSettings = {},
  ): GameLoop => {
    const sceneManager = {
      getSystems: () => [system],
    } as unknown as SceneManager;

    return new GameLoop(sceneManager, performanceSettings);
  };

  const runNextFrame = (time: number): void => {
    now = time;
    frameCallback?.(time);
  };

  beforeEach(() => {
    now = 0;
    frameCallback = undefined;

    originalPerformance = global.performance;
    originalRequestAnimationFrame = global.requestAnimationFrame;
    originalCancelAnimationFrame = global.cancelAnimationFrame;

    Object.defineProperty(global, 'performance', {
      configurable: true,
      value: {
        now: jest.fn(() => now),
      },
    });

    global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
      frameCallback = callback;
      return 1;
    });
    global.cancelAnimationFrame = jest.fn();
  });

  afterEach(() => {
    Object.defineProperty(global, 'performance', {
      configurable: true,
      value: originalPerformance,
    });

    global.requestAnimationFrame = originalRequestAnimationFrame;
    global.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it('caps a long frame after the game was suspended', () => {
    const fixedUpdate = jest.fn();
    const update = jest.fn();
    const gameLoop = createGameLoop({ fixedUpdate, update });

    gameLoop.run();
    runNextFrame(10_000);

    expect(fixedUpdate).toHaveBeenCalledTimes(5);
    expect(fixedUpdate).toHaveBeenCalledWith({ deltaTime: 20 });
    expect(update).toHaveBeenCalledWith({ deltaTime: 250 });
  });

  it('drops leftover fixed-step lag after reaching the per-frame cap', () => {
    const fixedUpdate = jest.fn();
    const gameLoop = createGameLoop(
      { fixedUpdate },
      { maxFixedUpdatesPerFrame: 2 },
    );

    gameLoop.run();
    runNextFrame(100);
    runNextFrame(120);

    expect(fixedUpdate).toHaveBeenCalledTimes(3);
  });
});
