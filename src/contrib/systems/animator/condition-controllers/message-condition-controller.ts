import type { Entity } from '../../../../engine/entity';
import type { MessageBus, Message } from '../../../../engine/message-bus';
import type { MessageConditionProps } from '../../../components/animatable/message-condition-props';

import { ConditionController } from './condition-controller';

interface ConditionMessage extends Message {
  entity: Entity
}

export class MessageConditionController implements ConditionController {
  check(props: MessageConditionProps, entity: Entity, messageBus: MessageBus): boolean {
    const { message: messageType } = props;

    const messages = messageBus.get(messageType) as Array<ConditionMessage> || [];
    return messages.some((message) => message.entity.getId() === entity.getId());
  }
}
