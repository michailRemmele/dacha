import {
  LabelledTextInput,
  LabelledNumberInput,
} from '../../../../../../../components'
import { COMPARATOR_VALUE } from '../../../const'

export const comparatorValues = [
  {
    title: COMPARATOR_VALUE.NUMBER,
    value: COMPARATOR_VALUE.NUMBER,
  },
  {
    title: COMPARATOR_VALUE.COMPONENT_VALUE,
    value: COMPARATOR_VALUE.COMPONENT_VALUE,
  },
]

export const COMPARATOR_TYPES_MAP = {
  [COMPARATOR_VALUE.NUMBER]: LabelledNumberInput,
  [COMPARATOR_VALUE.COMPONENT_VALUE]: LabelledTextInput,
}

export const COMPARATOR_INITIAL_VALUES_MAP = {
  [COMPARATOR_VALUE.NUMBER]: 0,
  [COMPARATOR_VALUE.COMPONENT_VALUE]: '',
}
