import {
  LabelledTextInput,
  LabelledNumberInput,
  LabelledCheckbox,
} from '../../../../../../../components'
import { COMPARATOR_VALUE } from '../../../const'

export const comparatorValues = [
  {
    title: COMPARATOR_VALUE.STRING,
    value: COMPARATOR_VALUE.STRING,
  },
  {
    title: COMPARATOR_VALUE.NUMBER,
    value: COMPARATOR_VALUE.NUMBER,
  },
  {
    title: COMPARATOR_VALUE.BOOLEAN,
    value: COMPARATOR_VALUE.BOOLEAN,
  },
  {
    title: COMPARATOR_VALUE.COMPONENT_VALUE,
    value: COMPARATOR_VALUE.COMPONENT_VALUE,
  },
]

export const COMPARATOR_TYPES_MAP = {
  [COMPARATOR_VALUE.STRING]: LabelledTextInput,
  [COMPARATOR_VALUE.NUMBER]: LabelledNumberInput,
  [COMPARATOR_VALUE.BOOLEAN]: LabelledCheckbox,
  [COMPARATOR_VALUE.COMPONENT_VALUE]: LabelledTextInput,
}

export const COMPARATOR_INITIAL_VALUES_MAP = {
  [COMPARATOR_VALUE.STRING]: '',
  [COMPARATOR_VALUE.NUMBER]: 0,
  [COMPARATOR_VALUE.BOOLEAN]: false,
  [COMPARATOR_VALUE.COMPONENT_VALUE]: '',
}
