import Picker from './picker';
import { getComponentValue } from '../utils';

class OneDimensionalPicker extends Picker {
  _getDistance(x1, x2) {
    return Math.abs(x1 - x2);
  }

  getSubstate(gameObject, substates, props) {
    if (!substates.length) {
      return void 0;
    }

    if (substates.length === 1) {
      return substates[0];
    }

    const x = getComponentValue(props.x, gameObject);

    let pickedSubstate = substates[0];
    let minDistance = this._getDistance(x, pickedSubstate.x);

    for (let i = 1; i < substates.length; i += 1) {
      const distance = this._getDistance(x, substates[i].x);

      if (distance < minDistance) {
        pickedSubstate = substates[i];
        minDistance = distance;
      }
    }

    return pickedSubstate;
  }
}

export default OneDimensionalPicker;
