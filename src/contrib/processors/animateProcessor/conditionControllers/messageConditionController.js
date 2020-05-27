import ConditionController from './conditionController';

class MessageConditionController extends ConditionController {
  check(props, gameObject, messageBus) {
    const { message: messageType } = props;

    const messages = messageBus.get(messageType) || [];
    return messages.some((message) => {
      return message.gameObject.getId() === gameObject.getId();
    });
  }
}

export default MessageConditionController;
