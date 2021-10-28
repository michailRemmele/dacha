import { MathOps } from '../../../../engine/mathLib';

import Picker from './picker';
import { getComponentValue } from '../utils';

class TwoDimensionalPicker extends Picker {
  _getDistance(x1, x2, y1, y2) {
    return MathOps.getDistanceBetweenTwoPoints(x1, x2, y1, y2);
  }

  getSubstate(gameObject, substates, props) {
    if (!substates.length) {
      return void 0;
    }

    if (substates.length === 1) {
      return substates[0];
    }

    const x = getComponentValue(props.x, gameObject);
    const y = getComponentValue(props.y, gameObject);

    let pickedSubstate = substates[0];
    let minDistance = this._getDistance(x, pickedSubstate.x, y, pickedSubstate.y);

    for (let i = 1; i < substates.length; i += 1) {
      const distance = this._getDistance(x, substates[i].x, y, substates[i].y);

      if (distance < minDistance) {
        pickedSubstate = substates[i];
        minDistance = distance;
      }
    }

    return pickedSubstate;
  }
}

export default TwoDimensionalPicker;
