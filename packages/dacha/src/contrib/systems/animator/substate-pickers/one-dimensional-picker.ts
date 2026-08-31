import type { Actor } from '../../../../engine/actor';
import type { Substate } from '../../../components/animatable/substate';
import type { OneDimensionalProps } from '../../../components/animatable/one-dimensional-props';
import { getValue } from '../utils';

import type { Picker } from './picker';

export class OneDimensionalPicker implements Picker {
  private getDistance(x1: number, x2: number): number {
    return Math.abs(x1 - x2);
  }

  getSubstate(
    actor: Actor,
    substates: Substate[],
    props: OneDimensionalProps,
  ): Substate {
    if (!substates.length) {
      throw new Error('Can\'t pick substate, because current state doesn\'t contain any substates');
    }

    if (substates.length === 1) {
      return substates[0];
    }

    const x = getValue(actor, props.x) as number;

    let pickedSubstate = substates[0];
    let minDistance = this.getDistance(x, pickedSubstate.x);

    for (let i = 1; i < substates.length; i += 1) {
      const distance = this.getDistance(x, substates[i].x);

      if (distance < minDistance) {
        pickedSubstate = substates[i];
        minDistance = distance;
      }
    }

    return pickedSubstate;
  }
}
