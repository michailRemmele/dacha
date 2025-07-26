import type { Actor } from '../../../../engine/actor';
import type { Substate } from '../../../components/animatable/substate';
import type { TwoDimensionalProps } from '../../../components/animatable/two-dimensional-props';
import { MathOps } from '../../../../engine/math-lib';
import { getValue } from '../utils';

import { Picker } from './picker';

export class TwoDimensionalPicker implements Picker {
  private getDistance(x1: number, x2: number, y1: number, y2: number): number {
    return MathOps.getDistanceBetweenTwoPoints(x1, x2, y1, y2);
  }

  getSubstate(
    actor: Actor,
    substates: Substate[],
    props: TwoDimensionalProps,
  ): Substate {
    if (!substates.length) {
      throw new Error('Can\'t pick substate, because current state doesn\'t contain any substates');
    }

    if (substates.length === 1) {
      return substates[0];
    }

    const x = getValue(actor, props.x) as number;
    const y = getValue(actor, props.y) as number;

    let pickedSubstate = substates[0];
    let minDistance = this.getDistance(x, pickedSubstate.x, y, pickedSubstate.y);

    for (let i = 1; i < substates.length; i += 1) {
      const distance = this.getDistance(x, substates[i].x, y, substates[i].y);

      if (distance < minDistance) {
        pickedSubstate = substates[i];
        minDistance = distance;
      }
    }

    return pickedSubstate;
  }
}
