import { ScriptBundle } from '../index';

describe('Contrib -> components -> ScriptBundle', () => {
  it('Returns correct values ', () => {
    const script = new ScriptBundle({
      scripts: [
        { name: 'some-script-1', options: {} },
        { name: 'some-script-2', options: {} },
        { name: 'some-script-3', options: {} },
      ],
    }).clone();

    expect(script.scripts).toEqual([
      { name: 'some-script-1', options: {} },
      { name: 'some-script-2', options: {} },
      { name: 'some-script-3', options: {} },
    ]);
  });

  it('Clones return deep copy of original component', () => {
    const originalScript = new ScriptBundle({
      scripts: [
        { name: 'some-script-1', options: {} },
        { name: 'some-script-2', options: {} },
        { name: 'some-script-3', options: {} },
      ],
    });
    const cloneScript = originalScript.clone();

    expect(originalScript).not.toBe(cloneScript);
    expect(originalScript.scripts).not.toBe(cloneScript.scripts);
  });
});
