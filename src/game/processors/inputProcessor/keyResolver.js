import * as global from 'consts/global';

import IOC from 'core/ioc/ioc';

import KeyCodeMapper from './keyCodeMapper';

class KeyResolver {
  constructor() {
    this.keyMap = {};
    this.keyCodeMapper = new KeyCodeMapper();
  }

  register(sceneName, actionInfo) {
    const { key, name, args } = actionInfo;
    const keyCode = this.keyCodeMapper.getKeyCode(key);

    if (!keyCode) {
      throw new Error(`Registration of input action failed for key: ${key}`);
    }

    this.keyMap[sceneName] = this.keyMap[sceneName] || {};
    this.keyMap[sceneName][keyCode] = {
      key: keyCode,
      name: name,
      args: args,
    };
  }

  resolve(sceneName, key) {
    if (!this.keyMap[sceneName] || !this.keyMap[sceneName][key]) {
      return;
    }

    const { name, args } = this.keyMap[sceneName][key];

    const actionResolver = IOC.resolve(global.ACTION_RESOLVER_KEY_NAME);
    actionResolver.resolve(name, args);
  }

  getKeys(sceneName) {
    if (!this.keyMap[sceneName]) {
      return [];
    }

    return Object.values(this.keyMap[sceneName]).map((keyMapItem) => {
      return keyMapItem.key;
    });
  }
}

export default KeyResolver;
