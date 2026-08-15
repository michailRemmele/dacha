import { State } from './state';
import { Substate } from './substate';
import { pickProps as defaultPickProps } from './pick-props';
import { OneDimensionalProps } from './one-dimensional-props';
import { TwoDimensionalProps } from './two-dimensional-props';
import type { GroupStateConfig } from './types';

export class GroupState extends State {
  substates: Substate[];
  pickMode: '1D' | '2D';
  pickProps: OneDimensionalProps | TwoDimensionalProps;

  constructor(config: GroupStateConfig) {
    super(config);

    const {
      substates = [],
      pickMode = '1D',
      pickProps = {},
    } = config;

    this.substates = substates.map((substate) => new Substate(substate));
    this.pickMode = pickMode;

    const PickProps = defaultPickProps[pickMode];
    this.pickProps = new PickProps(pickProps);
  }
}
