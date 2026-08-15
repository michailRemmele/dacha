import { ComparatorConditionSimpleValue } from './comparator-condition-number-value';
import { ComparatorConditionComponentValue } from './comparator-condition-component-value';

export const conditionValues = {
  string: ComparatorConditionSimpleValue,
  number: ComparatorConditionSimpleValue,
  boolean: ComparatorConditionSimpleValue,
  componentValue: ComparatorConditionComponentValue,
};
