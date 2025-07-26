import type { Constructor } from '../../../../types/utils';

import type { Picker } from './picker';
import { OneDimensionalPicker } from './one-dimensional-picker';
import { TwoDimensionalPicker } from './two-dimensional-picker';

export const substatePickers: Record<string, Constructor<Picker>> = {
  '1D': OneDimensionalPicker,
  '2D': TwoDimensionalPicker,
};
