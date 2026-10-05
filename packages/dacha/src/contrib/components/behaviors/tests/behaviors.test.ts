import { Behaviors } from '../index';
import type { BehaviorsConfig } from '../index';

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

  it('Starts with an empty list when the list is missing', () => {
    const component = new Behaviors({} as BehaviorsConfig);

    expect(component.list).toEqual([]);
  });

  it('Copies the options of each entry', () => {
    const config: BehaviorsConfig = {
      list: [{ id: 'b1', name: 'some-script-1', options: { speed: 1 } }],
    };
    const component = new Behaviors(config);

    component.list[0].options.speed = 2;

    expect(config.list[0].options).toEqual({ speed: 1 });
  });
});
