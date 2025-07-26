import type { Actor } from '../../../../engine/actor';
import type { Substate } from '../../../components/animatable/substate';
import type { OneDimensionalProps } from '../../../components/animatable/one-dimensional-props';
import type { TwoDimensionalProps } from '../../../components/animatable/two-dimensional-props';

export interface Picker {
  getSubstate(
    actor: Actor,
    substates: Substate[],
    props: OneDimensionalProps | TwoDimensionalProps,
  ): Substate
}
