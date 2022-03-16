import { Component } from '../../../engine/component';
import { State } from './state';
import { IndividualState, IndividualStateConfig } from './individual-state';
import { GroupState, GroupStateConfig } from './group-state';

interface AnimatableConfig {
  states: Array<unknown>;
  initialState: string;
}

export class Animatable extends Component {
  states: Array<IndividualState | GroupState>;
  initialState: string;
  currentState: IndividualState | GroupState;
  duration: number;

  constructor(componentName: string, config: AnimatableConfig) {
    super(componentName);

    this.states = config.states.reduce((acc: Array<IndividualState | GroupState>, state) => {
      const { type } = state as State;
      if (type === 'individual') {
        acc.push(new IndividualState(state as IndividualStateConfig));
      }
      if (type === 'group') {
        acc.push(new GroupState(state as GroupStateConfig));
      }
      return acc;
    }, []);
    this.initialState = config.initialState;
    this.currentState = this.states[0];

    this.updateCurrentState(this.initialState);
    this.duration = 0;
  }

  updateCurrentState(currentState: string): void {
    const newState = this.states.find((state) => state.name === currentState);

    if (!newState) {
      throw new Error(`Can't find state with same name: ${currentState}`);
    }

    this.currentState = newState;
  }

  clone(): Animatable {
    return new Animatable(this.componentName, {
      states: this.states,
      initialState: this.initialState,
    });
  }
}
