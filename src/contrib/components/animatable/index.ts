import { Component } from '../../../engine/component';
import { State } from './state';
import { IndividualState } from './individual-state';
import { GroupState } from './group-state';
import type {
  AnimatableConfig,
  GroupStateConfig,
  IndividualStateConfig,
} from './types';

export type { AnimatableConfig };

/**
 * Animatable component for managing animations.
 *
 * It provides a state machine for an actor to manage its animations.
 * Each state can have a set of transitions to other states,
 * and each transition describes a set of conditions to check before the transition is triggered.
 *
 * State consists of a timeline of frames where each frame represents a snapshot of the actor's state.
 * Frames allow to update any actor's component values.
 * It can be used for example to update the sprite's current frame.
 *
 * In addition to individual states, it supports group states.
 * Group states allow to avoid repeating the states with the same set of transitions,
 * but slightly different frames.
 * For instance, it can be used to describe a character state like "idle",
 * "run" or "jump" from different angles.
 *
 * It is better to use an editor to create the animatable component
 * since it has a quite complex structure.
 * 
 * @category Components
 */
export class Animatable extends Component {
  /** States of the animatable component */
  states: (IndividualState | GroupState)[];
  /** Initial state of the animatable component */
  initialState: string;
  /** Current state of the animatable component */
  currentState?: IndividualState | GroupState;
  /** Duration of the current state relative to the total duration of the timeline */
  duration: number;

  constructor(config: AnimatableConfig) {
    super();

    const { initialState, states = [] } = config;

    this.states = states.reduce(
      (acc: (IndividualState | GroupState)[], state) => {
        const { type } = state as State;
        if (type === 'individual') {
          acc.push(new IndividualState(state as IndividualStateConfig));
        }
        if (type === 'group') {
          acc.push(new GroupState(state as GroupStateConfig));
        }
        return acc;
      },
      [],
    );
    this.initialState = initialState;
    this.currentState = this.states.find(
      (state) => state.id === this.initialState,
    );

    this.duration = 0;
  }

  setCurrentState(currentState: string): void {
    const newState = this.states.find((state) => state.id === currentState);

    if (!newState) {
      throw new Error(`Can't find state with same name: ${currentState}`);
    }

    this.currentState = newState;
  }

  clone(): Animatable {
    return new Animatable({
      states: this.states,
      initialState: this.initialState,
    });
  }
}

Animatable.componentName = 'Animatable';
