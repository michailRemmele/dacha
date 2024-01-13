import type { GameObject } from '../../../../engine/game-object';
import type { MessageConditionProps } from '../../../components/animatable/message-condition-props';

import { ConditionController } from './condition-controller';

export class MessageConditionController implements ConditionController {
  private isMessageFired: boolean;

  constructor(
    props: MessageConditionProps,
    gameObject: GameObject,
  ) {
    this.isMessageFired = false;

    const { message: messageType } = props;

    const handleMessage = (): void => {
      this.isMessageFired = true;
      gameObject.removeEventListener(messageType, handleMessage);
    };

    gameObject.addEventListener(messageType, handleMessage);
  }

  check(): boolean {
    return this.isMessageFired;
  }
}
