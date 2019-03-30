import ConditionController from './conditionController';

class MessageConditionController extends ConditionController {
  constructor(props) {
    super(props);

    this._message = props.message;
  }

  check(messageBus) {
    return !!messageBus.get(this._message);
  }
}

export default MessageConditionController;
