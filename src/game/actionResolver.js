import actions from './actions/index';

class ActionResolver {
  constructor() {
    this.actionMap = {};
  }

  register(name) {
    if (!actions[name]) {
      throw new Error(`Error while registering action. Not found action with same name: ${name}`);
    }

    if (!this.actionMap[name]) {
      this.actionMap[name] = new actions[name]();
    }
  }

  resolve(name, args) {
    if (!this.actionMap[name]) {
      throw new Error(`Error while resolving action. Not found action with same name: ${name}`);
    }

    this.actionMap[name].execute(args);
  }
}

export default ActionResolver;
