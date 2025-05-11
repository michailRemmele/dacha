import { SceneSystem } from '../../../engine/system';
import type { UpdateOptions, SceneSystemOptions } from '../../../engine/system';
import { Actor, ActorCollection } from '../../../engine/actor';
import { Animatable } from '../../components/animatable';
import type { Frame } from '../../components/animatable/timeline';
import type { IndividualState } from '../../components/animatable/individual-state';
import type { GroupState } from '../../components/animatable/group-state';
import type { Substate } from '../../components/animatable/substate';
import { RemoveActor } from '../../../engine/events';
import type { RemoveActorEvent } from '../../../engine/events';

import type { ConditionController } from './condition-controllers/condition-controller';
import type { Picker } from './substate-pickers/picker';
import { conditionControllers } from './condition-controllers';
import { substatePickers } from './substate-pickers';
import { setValue } from './utils';

const FRAME_RATE = 100;

export class Animator extends SceneSystem {
  private actorCollection: ActorCollection;
  private substatePickers: Record<string, Picker>;

  private actorConditions: Record<string, Record<string, Record<string, ConditionController>>>;

  constructor(options: SceneSystemOptions) {
    super();

    this.actorCollection = new ActorCollection(options.scene, {
      components: [Animatable],
    });
    this.substatePickers = Object.keys(substatePickers)
      .reduce((storage: Record<string, Picker>, key) => {
        const SubstatePicker = substatePickers[key];
        storage[key] = new SubstatePicker();
        return storage;
      }, {});

    this.actorConditions = {};

    this.actorCollection.addEventListener(RemoveActor, this.handleActorRemove);
  }

  onSceneDestroy(): void {
    this.actorCollection.removeEventListener(RemoveActor, this.handleActorRemove);

    Object.values(this.actorConditions).forEach((transitions) => {
      Object.values(transitions).forEach((conditions) => {
        Object.values(conditions).forEach((controller) => {
          controller.destroy?.();
        });
      });
    });
  }

  private handleActorRemove = (event: RemoveActorEvent): void => {
    delete this.actorConditions[event.actor.id];
  };

  private setUpConditionControllers(actor: Actor): void {
    this.actorConditions[actor.id] = {};

    const animatable = actor.getComponent(Animatable);
    animatable.currentState?.transitions.forEach((transition) => {
      this.actorConditions[actor.id][transition.id] ??= {};
      const transitionMap = this.actorConditions[actor.id][transition.id];

      transition.conditions.forEach((condition) => {
        const ConditionController = conditionControllers[condition.type];
        transitionMap[condition.id] = new ConditionController(
          condition.props,
          actor,
        );
      });
    });
  }

  private updateFrame(actor: Actor, frame: Frame): void {
    Object.keys(frame).forEach((fieldName) => setValue(
      actor,
      frame[fieldName].path,
      frame[fieldName].value,
    ));
  }

  private pickSubstate(actor: Actor, state: GroupState): Substate {
    const substatePicker = this.substatePickers[state.pickMode];
    return substatePicker.getSubstate(actor, state.substates, state.pickProps);
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.actorCollection.forEach((actor) => {
      const animatable = actor.getComponent(Animatable);

      if (animatable.currentState === void 0) {
        return;
      }

      if (!this.actorConditions[actor.id]) {
        this.setUpConditionControllers(actor);
      }

      let { timeline } = animatable.currentState as IndividualState;

      if ((animatable.currentState as GroupState).substates) {
        const substate = this.pickSubstate(actor, animatable.currentState as GroupState);
        timeline = substate.timeline;
      }

      const framesCount = timeline.frames.length;
      const actualFrameRate = FRAME_RATE / animatable.currentState.speed;
      const baseDuration = framesCount * actualFrameRate;

      animatable.duration += deltaTime / baseDuration;

      const currentFrame = animatable.duration < 1 || timeline.looped
        ? Math.trunc((animatable.duration % 1) * framesCount)
        : framesCount - 1;

      this.updateFrame(actor, timeline.frames[currentFrame]);

      const nextTransition = animatable.currentState.transitions.find((transition) => {
        if (transition.time && animatable.duration < transition.time) {
          return false;
        }

        return transition.conditions.every((condition) => {
          return this.actorConditions[actor.id][transition.id][condition.id].check();
        });
      });

      if (nextTransition) {
        animatable.setCurrentState(nextTransition.state);
        animatable.duration = 0;

        this.setUpConditionControllers(actor);
      }
    });
  }
}

Animator.systemName = 'Animator';
