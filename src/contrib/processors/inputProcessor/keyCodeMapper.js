import keyCodeValues from './keyCodeValues';

class KeyCodeMapper {
  getChar(keyCode) {
    return keyCodeValues[keyCode];
  }
}

export default KeyCodeMapper;
