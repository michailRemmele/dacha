import type { GameObject } from '../../../../engine/game-object';
import type { MessageBus, Message } from '../../../../engine/message-bus';
import type { MessageConditionProps } from '../../../components/animatable/message-condition-props';

import { ConditionController } from './condition-controller';

interface ConditionMessage extends Message {
  gameObject: GameObject
}

export class MessageConditionController implements ConditionController {
  check(props: MessageConditionProps, gameObject: GameObject, messageBus: MessageBus): boolean {
    const { message: messageType } = props;

    const messages = messageBus.get(messageType) as Array<ConditionMessage> || [];
    return messages.some((message) => message.gameObject.getId() === gameObject.getId());
  }
}
