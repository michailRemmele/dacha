import { Script } from '../index';

describe('Contrib -> components -> Script', () => {
  it('Returns correct values ', () => {
    const script = new Script({
      name: 'some-script',
      options: {
        value1: 10,
        value2: 'hello-world',
      },
    }).clone();

    expect(script.name).toEqual('some-script');
    expect(script.options.value1).toEqual(10);
    expect(script.options.value2).toEqual('hello-world');
  });

  it('Correct updates values ', () => {
    const script = new Script({
      name: 'some-script',
      options: {
        value1: 10,
        value2: 'hello-world',
      },
    }).clone();

    script.name = 'some-another-script';
    script.options.value1 = 20;
    script.options.value2 = 'world-hello';

    expect(script.name).toEqual('some-another-script');
    expect(script.options.value1).toEqual(20);
    expect(script.options.value2).toEqual('world-hello');
  });

  it('Clones return deep copy of original component', () => {
    const originalScript = new Script({
      name: 'some-script',
      options: {
        value1: 10,
        value2: 'hello-world',
      },
    });
    const cloneScript = originalScript.clone();

    expect(originalScript).not.toBe(cloneScript);
  });
});
