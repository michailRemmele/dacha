import type { GameObject } from '../../../../engine/game-object';
import type { Substate } from '../../../components/animatable/substate';
import type { OneDimensionalProps } from '../../../components/animatable/one-dimensional-props';
import type { TwoDimensionalProps } from '../../../components/animatable/two-dimensional-props';

export interface Picker {
  getSubstate(
    gameObject: GameObject,
    substates: Array<Substate>,
    props: OneDimensionalProps | TwoDimensionalProps,
  ): Substate
}
