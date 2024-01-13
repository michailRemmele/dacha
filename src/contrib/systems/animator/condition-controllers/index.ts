import type { Constructor } from '../../../../types/utils';

import type { ConditionController } from './condition-controller';
import { MessageConditionController } from './message-condition-controller';
import { ComparatorConditionController } from './comparator-condition-controller';

export const conditionControllers: Record<string, Constructor<ConditionController>> = {
  message: MessageConditionController,
  comparator: ComparatorConditionController,
};
