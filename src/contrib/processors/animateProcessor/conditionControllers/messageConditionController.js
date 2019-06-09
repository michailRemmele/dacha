import ConditionController from './conditionController';

class MessageConditionController extends ConditionController {
  check(props) {
    const {
      messageBus,
      gameObject,
      message: messageType,
    } = props;

    const messages = messageBus.get(messageType) || [];
    return messages.some((message) => {
      return message.gameObject.getId() === gameObject.getId();
    });
  }
}

export default MessageConditionController;
