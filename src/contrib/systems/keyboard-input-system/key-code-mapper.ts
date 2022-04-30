import keyCodeValues from './key-code-values';

export class KeyCodeMapper {
  getChar(keyCode: number): string {
    return (keyCodeValues as Record<number, string>)[keyCode];
  }
}
