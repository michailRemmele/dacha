import type { Processor, ProcessorOptions } from '../../../engine/processor';
import type { GameObject, GameObjectObserver } from '../../../engine/gameObject';
import type { MessageBus } from '../../../engine/message-bus';
import type { Animatable } from '../../components/animatable';
import type { Frame } from '../../components/animatable/frame';
import type { IndividualState } from '../../components/animatable/individual-state';
import type { GroupState } from '../../components/animatable/group-state';
import type { Substate } from '../../components/animatable/substate';

import type { ConditionController } from './condition-controllers/condition-controller';
import type { Picker } from './substate-pickers/picker';
import { conditionControllers } from './condition-controllers';
import { substatePickers } from './substate-pickers';

const FRAME_RATE = 100;

const ANIMATABLE_COMPONENT_NAME = 'animatable';

const UPDATE_FRAME_MSG = 'UPDATE_FRAME';

interface AnimatorOptions {
  gameObjectObserver: GameObjectObserver
  messageBus: MessageBus
}

export class Animator implements Processor {
  private gameObjectObserver: GameObjectObserver;
  private messageBus: MessageBus;
  private conditionControllers: Record<string, ConditionController>;
  private substatePickers: Record<string, Picker>;

  constructor(options: AnimatorOptions) {
    this.gameObjectObserver = options.gameObjectObserver;
    this.messageBus = options.messageBus;
    this.conditionControllers = Object.keys(conditionControllers).reduce(
      (storage: Record<string, ConditionController>, key) => {
        const ConditionController = conditionControllers[key];
        storage[key] = new ConditionController();
        return storage;
      }, {},
    );
    this.substatePickers = Object.keys(substatePickers).reduce(
      (storage: Record<string, Picker>, key) => {
        const SubstatePicker = substatePickers[key];
        storage[key] = new SubstatePicker();
        return storage;
      }, {},
    );
  }

  private updateFrame(gameObject: GameObject, frame: Frame): void {
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

  private pickSubstate(gameObject: GameObject, state: GroupState): Substate {
    const substatePicker = this.substatePickers[state.pickMode];
    return substatePicker.getSubstate(gameObject, state.substates, state.pickProps);
  }

  process(options: ProcessorOptions): void {
    const { deltaTime } = options;

    this.gameObjectObserver.forEach((gameObject) => {
      const animatable = gameObject.getComponent(ANIMATABLE_COMPONENT_NAME) as Animatable;

      let { timeline } = animatable.currentState as IndividualState;

      if ((animatable.currentState as GroupState).substates) {
        const substate = this.pickSubstate(gameObject, animatable.currentState as GroupState);
        timeline = substate.timeline;
      }

      const framesCount = timeline.frames.length;
      const actualFrameRate = FRAME_RATE / animatable.currentState.speed;
      const baseDuration = framesCount * actualFrameRate;

      animatable.duration += deltaTime / baseDuration;

      const currentFrame = animatable.duration < 1 || timeline.looped
        ? Math.trunc((animatable.duration % 1) * framesCount)
        : framesCount - 1;

      this.updateFrame(gameObject, timeline.frames[currentFrame]);

      const nextTransition = animatable.currentState.transitions.find((transition) => {
        if (transition.time && animatable.duration < transition.time) {
          return false;
        }

        return transition.conditions.every((condition) => {
          const conditionController = this.conditionControllers[condition.type];
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
