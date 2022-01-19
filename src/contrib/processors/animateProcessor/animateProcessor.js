import conditionControllers from './conditionControllers';
import substatePickers from './substatePickers';

const FRAME_RATE = 100;

const RENDERABLE_COMPONENT_NAME = 'renderable';
const ANIMATABLE_COMPONENT_NAME = 'animatable';

class AnimateProcessor {
  constructor(options) {
    this._gameObjectObserver = options.gameObjectObserver;
    this.messageBus = options.messageBus;
    this._conditionControllers = Object.keys(conditionControllers).reduce((storage, key) => {
      const ConditionController = conditionControllers[key];
      storage[key] = new ConditionController();
      return storage;
    }, {});
    this._substatePickers = Object.keys(substatePickers).reduce((storage, key) => {
      const SubstatePicker = substatePickers[key];
      storage[key] = new SubstatePicker();
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

  _pickSubstate(gameObject, state) {
    const substatePicker = this._substatePickers[state.pickMode];
    return substatePicker.getSubstate(gameObject, state.substates, state.pickProps);
  }

  process(options) {
    const { deltaTime } = options;

    this._gameObjectObserver.forEach((gameObject) => {
      const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME);
      const animatable = gameObject.getComponent(ANIMATABLE_COMPONENT_NAME);

      let { timeline } = animatable.currentState;

      if (animatable.currentState.substates) {
        const substate = this._pickSubstate(gameObject, animatable.currentState);
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
          return conditionController.check(condition.props, gameObject, this.messageBus);
        });
      });

      if (nextTransition) {
        animatable.updateCurrentState(nextTransition.state);
        animatable.duration = 0;
      }
    });
  }
}

export default AnimateProcessor;
