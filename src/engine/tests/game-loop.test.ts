import { GameLoop } from '../game-loop';
import { Time } from '../time';
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
  ): { gameLoop: GameLoop; time: Time } => {
    const sceneManager = {
      getSystems: () => [system],
    } as unknown as SceneManager;

    const time = new Time();

    return {
      gameLoop: new GameLoop(sceneManager, time, performanceSettings),
      time,
    };
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
    const { gameLoop, time } = createGameLoop({ fixedUpdate, update });

    gameLoop.run();
    runNextFrame(10_000);

    expect(fixedUpdate).toHaveBeenCalledTimes(5);
    expect(update).toHaveBeenCalledTimes(1);
    expect(time.fixedDeltaTime).toBeCloseTo(0.02);
    expect(time.deltaTime).toBeCloseTo(0.25);
    expect(time.elapsedTime).toBeCloseTo(0.25);
    expect(time.alpha).toBe(0);
  });

  it('drops leftover fixed-step lag after reaching the per-frame cap', () => {
    const fixedUpdate = jest.fn();
    const { gameLoop } = createGameLoop(
      { fixedUpdate },
      { maxFixedUpdatesPerFrame: 2 },
    );

    gameLoop.run();
    runNextFrame(100);
    runNextFrame(120);

    expect(fixedUpdate).toHaveBeenCalledTimes(3);
  });
});
