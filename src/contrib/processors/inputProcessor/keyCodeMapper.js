import keyCodeValues from './keyCodeValues';

class KeyCodeMapper {
  getKeyCode(char) {
    return keyCodeValues[char] ? keyCodeValues[char] : 0;
  }
}

export default KeyCodeMapper;
