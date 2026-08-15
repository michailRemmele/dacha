import { Behaviors } from '../index';

describe('Contrib -> components -> Behaviors', () => {
  it('Returns correct values ', () => {
    const component = new Behaviors({
      list: [
        { id: 'b1', name: 'some-script-1', options: {} },
        { id: 'b2', name: 'some-script-2', options: {} },
        { id: 'b3', name: 'some-script-3', options: {} },
      ],
    });

    expect(component.list).toEqual([
      { id: 'b1', name: 'some-script-1', options: {} },
      { id: 'b2', name: 'some-script-2', options: {} },
      { id: 'b3', name: 'some-script-3', options: {} },
    ]);
  });
});
