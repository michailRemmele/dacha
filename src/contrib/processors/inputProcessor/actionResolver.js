class ActionResolver {
  constructor() {
    this.actionMap = {};
  }

  register(action) {
    if (!this.actionMap[name]) {
      this.actionMap[action.getName()] = action;
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
