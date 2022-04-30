import type { GameObject } from '../../../../engine/game-object';
import type { MessageBus } from '../../../../engine/message-bus';
import type { ComparatorConditionProps } from '../../../components/animatable/comparator-condition-props';
import type { MessageConditionProps } from '../../../components/animatable/message-condition-props';

export interface ConditionController {
  check(
    props: ComparatorConditionProps | MessageConditionProps,
    gameObject: GameObject,
    messageBus: MessageBus
  ): boolean
}
