import Processor from 'engine/processor/processor';

import conditionControllers from './conditionControllers';

const FRAME_RATE = 100;

const RENDERABLE_COMPONENT_NAME = 'renderable';
const ANIMATABLE_COMPONENT_NAME = 'animatable';

class AnimateProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._conditionControllers = Object.keys(conditionControllers).reduce((storage, key) => {
      const ConditionController = conditionControllers[key];
      storage[key] = new ConditionController();
      return storage;
    }, {});
  }

  _setFrame(renderable, frame) {
    renderable.currentFrame = frame.index;
    renderable.rotation = frame.rotation !== undefined ? frame.rotation : renderable.rotation;
    renderable.flipX = frame.flipX !== undefined ? frame.flipX : renderable.flipX;
    renderable.flipY = frame.flipY !== undefined ? frame.flipY : renderable.flipY;
    renderable.disabled = frame.disabled;
  }

  process(options) {
    const deltaTime = options.deltaTime;
    const messageBus = options.messageBus;

    this._gameObjectObserver.forEach((gameObject) => {
      const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME);
      const animatable = gameObject.getComponent(ANIMATABLE_COMPONENT_NAME);

      const nextTransition = animatable.currentState.transitions.find((transition) => {
        return transition.conditions.every((condition) => {
          const conditionController = this._conditionControllers[condition.type];
          return conditionController.check(condition.props, gameObject, messageBus);
        });
      });

      if (nextTransition) {
        const previousState = animatable.currentState.name;
        animatable.currentState = nextTransition.state;
        animatable.currentState.previousState = previousState;
        animatable.duration = 0;
      }

      const frames = animatable.currentState.frames;
      const framesCount = frames.length;
      const speed = animatable.currentState.speed;
      const actualFrameRate = FRAME_RATE / speed;
      const baseDuration = framesCount * actualFrameRate;

      animatable.duration += deltaTime;

      if (animatable.duration >= baseDuration) {
        if (!animatable.currentState.looped) {
          animatable.currentState = animatable.currentState.fallbackState
            ? animatable.currentState.fallbackState
            : animatable.currentState.previousState || animatable.defaultState;
          animatable.duration = 0;
          this._setFrame(renderable, animatable.currentState.frames[0]);
          return;
        } else {
          animatable.duration %= baseDuration;
        }
      }

      this._setFrame(renderable, frames[Math.trunc(animatable.duration / actualFrameRate)]);
    });
  }
}

export default AnimateProcessor;
