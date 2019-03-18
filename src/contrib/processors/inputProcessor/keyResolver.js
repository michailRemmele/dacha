import KeyCodeMapper from './keyCodeMapper';

class KeyResolver {
  constructor(actionResolver) {
    this.keyMap = {};
    this.keyCodeMapper = new KeyCodeMapper();
    this.actionResolver = actionResolver;
  }

  register(actionInfo) {
    const { key, name, args } = actionInfo;
    const keyCode = this.keyCodeMapper.getKeyCode(key);

    if (!keyCode) {
      throw new Error(`Registration of input action failed for key: ${key}`);
    }

    this.keyMap[keyCode] = {
      key: keyCode,
      name: name,
      args: args,
    };
  }

  resolve(key) {
    if (!this.keyMap[key]) {
      return;
    }

    const { name, args } = this.keyMap[key];

    this.actionResolver.resolve(name, args);
  }

  getKeys() {
    return Object.values(this.keyMap).map((keyMapItem) => {
      return keyMapItem.key;
    });
  }
}

export default KeyResolver;
