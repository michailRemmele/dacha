import type { Constructor } from '../../../../types/utils';

import type { ConditionController } from './condition-controller';
import { EventConditionController } from './event-condition-controller';
import { ComparatorConditionController } from './comparator-condition-controller';

export const conditionControllers: Record<string, Constructor<ConditionController>> = {
  event: EventConditionController,
  comparator: ComparatorConditionController,
};
