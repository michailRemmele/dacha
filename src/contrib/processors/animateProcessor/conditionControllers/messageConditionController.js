import ConditionController from './conditionController';

class MessageConditionController extends ConditionController {
  constructor(props) {
    super(props);

    this._gameObjectId = props.gameObject.getId();
    this._message = props.message;
  }

  check(messageBus) {
    return messageBus.get(this._message) && messageBus.get(this._message).some((message) => {
      return message.gameObject.getId() === this._gameObjectId;
    });
  }
}

export default MessageConditionController;
