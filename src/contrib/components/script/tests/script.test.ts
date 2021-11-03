import { Script } from '../index';

describe('Contrib -> components -> Script', () => {
  it('Returns correct values ', () => {
    const script = new Script('script', {
      name: 'some-script',
    }).clone();

    expect(script.name).toEqual('some-script');
  });

  it('Correct updates values ', () => {
    const script = new Script('script', {
      name: 'some-script',
    }).clone();

    script.name = 'some-another-script';

    expect(script.name).toEqual('some-another-script');
  });
});
