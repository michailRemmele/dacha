import type { System, SystemOptions, UpdateOptions } from '../../../engine/system';
import type { GameObject, GameObjectObserver } from '../../../engine/game-object';
import type { MessageBus } from '../../../engine/message-bus';
import type { Animatable } from '../../components/animatable';
import type { Frame } from '../../components/animatable/timeline';
import type { IndividualState } from '../../components/animatable/individual-state';
import type { GroupState } from '../../components/animatable/group-state';
import type { Substate } from '../../components/animatable/substate';

import type { ConditionController } from './condition-controllers/condition-controller';
import type { Picker } from './substate-pickers/picker';
import { conditionControllers } from './condition-controllers';
import { substatePickers } from './substate-pickers';
import { setValue } from './utils';

const FRAME_RATE = 100;

const ANIMATABLE_COMPONENT_NAME = 'animatable';

export class Animator implements System {
  private gameObjectObserver: GameObjectObserver;
  private messageBus: MessageBus;
  private conditionControllers: Record<string, ConditionController>;
  private substatePickers: Record<string, Picker>;

  constructor(options: SystemOptions) {
    this.gameObjectObserver = options.createGameObjectObserver({
      components: [ANIMATABLE_COMPONENT_NAME],
    });
    this.messageBus = options.messageBus;
    this.conditionControllers = Object.keys(conditionControllers)
      .reduce((storage: Record<string, ConditionController>, key) => {
        const ConditionController = conditionControllers[key];
        storage[key] = new ConditionController();
        return storage;
      }, {});
    this.substatePickers = Object.keys(substatePickers)
      .reduce((storage: Record<string, Picker>, key) => {
        const SubstatePicker = substatePickers[key];
        storage[key] = new SubstatePicker();
        return storage;
      }, {});
  }

  private updateFrame(gameObject: GameObject, frame: Frame): void {
    Object.keys(frame).forEach((fieldName) => setValue(
      gameObject,
      frame[fieldName].path,
      frame[fieldName].value,
    ));
  }

  private pickSubstate(gameObject: GameObject, state: GroupState): Substate {
    const substatePicker = this.substatePickers[state.pickMode];
    return substatePicker.getSubstate(gameObject, state.substates, state.pickProps);
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.gameObjectObserver.forEach((gameObject) => {
      const animatable = gameObject.getComponent(ANIMATABLE_COMPONENT_NAME) as Animatable;

      if (animatable.currentState === void 0) {
        return;
      }

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
        animatable.setCurrentState(nextTransition.state);
        animatable.duration = 0;
      }
    });
  }
}
