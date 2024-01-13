import { System } from '../../../engine/system';
import type { SystemOptions, UpdateOptions } from '../../../engine/system';
import { GameObject, GameObjectObserver } from '../../../engine/game-object';
import { Animatable } from '../../components/animatable';
import type { Frame } from '../../components/animatable/timeline';
import type { IndividualState } from '../../components/animatable/individual-state';
import type { GroupState } from '../../components/animatable/group-state';
import type { Substate } from '../../components/animatable/substate';
import { AddGameObject, RemoveGameObject } from '../../../engine/events';
import type { UpdateGameObjectEvent } from '../../../engine/events';

import type { ConditionController } from './condition-controllers/condition-controller';
import type { Picker } from './substate-pickers/picker';
import { conditionControllers } from './condition-controllers';
import { substatePickers } from './substate-pickers';
import { setValue } from './utils';

const FRAME_RATE = 100;

export class Animator extends System {
  private gameObjectObserver: GameObjectObserver;
  private substatePickers: Record<string, Picker>;

  private gameObjectConditions: Record<string, Record<string, Record<string, ConditionController>>>;

  constructor(options: SystemOptions) {
    super();

    this.gameObjectObserver = options.createGameObjectObserver({
      components: [Animatable],
    });
    this.substatePickers = Object.keys(substatePickers)
      .reduce((storage: Record<string, Picker>, key) => {
        const SubstatePicker = substatePickers[key];
        storage[key] = new SubstatePicker();
        return storage;
      }, {});

    this.gameObjectConditions = {};

    this.gameObjectObserver.forEach((gameObject) => this.setUpConditionControllers(gameObject));
  }

  mount(): void {
    this.gameObjectObserver.addEventListener(AddGameObject, this.handleGameObjectAdd);
    this.gameObjectObserver.addEventListener(RemoveGameObject, this.handleGameObjectRemove);
  }

  unmount(): void {
    this.gameObjectObserver.removeEventListener(AddGameObject, this.handleGameObjectAdd);
    this.gameObjectObserver.removeEventListener(RemoveGameObject, this.handleGameObjectRemove);
  }

  private handleGameObjectAdd = (event: UpdateGameObjectEvent): void => {
    this.setUpConditionControllers(event.gameObject);
  };

  private handleGameObjectRemove = (event: UpdateGameObjectEvent): void => {
    delete this.gameObjectConditions[event.gameObject.id];
  };

  private setUpConditionControllers(gameObject: GameObject): void {
    this.gameObjectConditions[gameObject.id] = {};

    const animatable = gameObject.getComponent(Animatable);
    animatable.currentState?.transitions.forEach((transition) => {
      this.gameObjectConditions[gameObject.id][transition.id] ??= {};
      const transitionMap = this.gameObjectConditions[gameObject.id][transition.id];

      transition.conditions.forEach((condition) => {
        const ConditionController = conditionControllers[condition.type];
        transitionMap[condition.id] = new ConditionController(
          condition.props,
          gameObject,
        );
      });
    });
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
      const animatable = gameObject.getComponent(Animatable);

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
          return this.gameObjectConditions[gameObject.id][transition.id][condition.id].check();
        });
      });

      if (nextTransition) {
        animatable.setCurrentState(nextTransition.state);
        animatable.duration = 0;

        this.setUpConditionControllers(gameObject);
      }
    });
  }
}

Animator.systemName = 'Animator';
