import IOC from 'engine/ioc/ioc';
import * as global from 'engine/consts/global';

import InputListener from './inputListener';
import ActionResolver from './actionResolver';
import KeyResolver from './keyResolver';

class InputProcessor {
  constructor(actions) {
    this.inputListener = new InputListener(window);
    this.actionResolver = new ActionResolver();
    this.keyResolver = new KeyResolver(this.actionResolver);

    actions.forEach((actionInfo) => {
      const Action = actionInfo.action;
      const action = new Action();
      this.actionResolver.register(action);
      this.keyResolver.register({
        name: action.getName(),
        args: [
          ...actionInfo.args,
          IOC,
          global,
        ],
        key: actionInfo.key,
      });
    });

    this.inputListener.startListen(this.keyResolver.getKeys());
  }

  process() {
    this.inputListener.getQueue().forEach((key) => {
      this.keyResolver.resolve(key);
    });
    this.inputListener.clearQueue();
  }
}

export default InputProcessor;
