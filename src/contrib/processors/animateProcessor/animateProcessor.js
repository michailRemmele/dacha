import conditionControllers from './condition-controllers';
import substatePickers from './substate-pickers';

const FRAME_RATE = 100;

const ANIMATABLE_COMPONENT_NAME = 'animatable';

const UPDATE_FRAME_MSG = 'UPDATE_FRAME';

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

  _updateFrame(gameObject, frame) {
    this.messageBus.send({
      type: UPDATE_FRAME_MSG,
      id: gameObject.getId(),
      currentFrame: frame.index,
      rotation: frame.rotation,
      flipX: frame.flipX,
      flipY: frame.flipY,
      disabled: frame.disabled,
    });
  }

  _pickSubstate(gameObject, state) {
    const substatePicker = this._substatePickers[state.pickMode];
    return substatePicker.getSubstate(gameObject, state.substates, state.pickProps);
  }

  process(options) {
    const { deltaTime } = options;

    this._gameObjectObserver.forEach((gameObject) => {
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

      this._updateFrame(gameObject, timeline.frames[currentFrame]);

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
