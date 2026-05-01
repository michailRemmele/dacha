import { Behaviors } from '../index';

describe('Contrib -> components -> Behaviors', () => {
  it('Returns correct values ', () => {
    const component = new Behaviors({
      list: [
        { name: 'some-script-1', options: {} },
        { name: 'some-script-2', options: {} },
        { name: 'some-script-3', options: {} },
      ],
    });

    expect(component.list).toEqual([
      { name: 'some-script-1', options: {} },
      { name: 'some-script-2', options: {} },
      { name: 'some-script-3', options: {} },
    ]);
  });
});
