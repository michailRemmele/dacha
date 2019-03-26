import KeyCodeMapper from './keyCodeMapper';

class ActionResolver {
  constructor(keyBindings) {
    this.keyMap = {};
    this.keyCodeMapper = new KeyCodeMapper();

    this.keyMap = Object.keys(keyBindings).reduce((storage, key) => {
      const keyCode = this.keyCodeMapper.getKeyCode(key);

      if (!keyCode) {
        throw new Error(`Registration of input action failed for key: ${key}`);
      }

      storage[keyCode] = {
        key: keyCode,
        action: keyBindings[key],
      };

      return storage;
    }, {});
  }

  resolve(key) {
    if (!this.keyMap[key]) {
      return;
    }

    return this.keyMap[key].action;
  }

  getKeys() {
    return Object.values(this.keyMap).map((keyMapItem) => {
      return keyMapItem.key;
    });
  }
}

export default ActionResolver;
