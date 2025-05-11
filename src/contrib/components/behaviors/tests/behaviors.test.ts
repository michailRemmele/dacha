import { Behaviors } from '../index';

describe('Contrib -> components -> Behaviors', () => {
  it('Returns correct values ', () => {
    const component = new Behaviors({
      list: [
        { name: 'some-script-1', options: {} },
        { name: 'some-script-2', options: {} },
        { name: 'some-script-3', options: {} },
      ],
    }).clone();

    expect(component.list).toEqual([
      { name: 'some-script-1', options: {} },
      { name: 'some-script-2', options: {} },
      { name: 'some-script-3', options: {} },
    ]);
  });

  it('Clones return deep copy of original component', () => {
    const originalComponent = new Behaviors({
      list: [
        { name: 'some-script-1', options: {} },
        { name: 'some-script-2', options: {} },
        { name: 'some-script-3', options: {} },
      ],
    });
    const cloneComponent = originalComponent.clone();

    expect(originalComponent).not.toBe(cloneComponent);
    expect(originalComponent.list).not.toBe(cloneComponent.list);
  });
});
