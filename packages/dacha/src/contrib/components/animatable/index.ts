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
 * Holds the animation state machine of an actor: its states, frames and
 * transitions. Build it in the animation editor. {@link Animator} plays it.
 *
 * @see [Animation](https://dachajs.org/systems/animation/)
 *
 * @category Animation
 */
export class Animatable extends Component {
  /** @internal States of the animatable component */
  states: (IndividualState | GroupState)[];
  /** Initial state of the animatable component */
  initialState: string;
  /** @internal Current state of the animatable component */
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

  /**
   * Switches the animation to another state at once, without a transition.
   *
   * @param currentState - The id of the state.
   * @throws Error If there is no state with this id.
   */
  setCurrentState(currentState: string): void {
    const newState = this.states.find((state) => state.id === currentState);

    if (!newState) {
      throw new Error(`Can't find state with same name: ${currentState}`);
    }

    this.currentState = newState;
  }
}

Animatable.componentName = 'Animatable';
