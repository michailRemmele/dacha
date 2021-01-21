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

      let timeline = animatable.currentState.timeline;

      if (animatable.currentState.substates) {
        const substate = animatable.currentState.substates.find((substate) => {
          return substate.conditions.every((condition) => {
            const conditionController = this._conditionControllers[condition.type];
            return conditionController.check(condition.props, gameObject, messageBus);
          });
        });
        timeline = substate.timeline;
      }

      const framesCount = timeline.frames.length;
      const actualFrameRate = FRAME_RATE / animatable.currentState.speed;
      const baseDuration = framesCount * actualFrameRate;

      animatable.duration += deltaTime / baseDuration;

      const currentFrame = animatable.duration < 1 || timeline.looped
        ? Math.trunc((animatable.duration % 1) * framesCount)
        : framesCount - 1;

      this._setFrame(renderable, timeline.frames[currentFrame]);

      const nextTransition = animatable.currentState.transitions.find((transition) => {
        if (transition.time && animatable.duration < transition.time) {
          return false;
        }

        return transition.conditions.every((condition) => {
          const conditionController = this._conditionControllers[condition.type];
          return conditionController.check(condition.props, gameObject, messageBus);
        });
      });

      if (nextTransition) {
        animatable.currentState = nextTransition.state;
        animatable.duration = 0;
      }
    });
  }
}

export default AnimateProcessor;
