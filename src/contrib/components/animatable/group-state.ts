import { State, StateConfig } from './state';
import { Substate } from './substate';
import { pickProps as defaultPickProps } from './pick-props';
import { OneDimensionalProps } from './one-dimensional-props';
import { TwoDimensionalProps } from './two-dimensional-props';

export interface GroupStateConfig extends StateConfig {
  substates: Array<Substate>;
  pickMode: '1D' | '2D';
  pickProps: OneDimensionalProps | TwoDimensionalProps;
}

export class GroupState extends State {
  substates: Array<Substate>;
  pickMode: '1D' | '2D';
  pickProps: OneDimensionalProps | TwoDimensionalProps;

  constructor(config: GroupStateConfig) {
    super(config);

    this.substates = config.substates.map((substate) => new Substate(substate));
    this.pickMode = config.pickMode;
    this.pickProps = new defaultPickProps[config.pickMode](config.pickProps);
  }
}
