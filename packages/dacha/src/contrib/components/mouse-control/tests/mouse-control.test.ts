import { MouseControl } from '../index';

describe('Contrib -> components -> MouseControl', () => {
  it('Returns correct values ', () => {
    const mouseControl = new MouseControl({
      inputEventBindings: [
        {
          event: 'mousedown',
          button: 0,
          eventType: 'ATTACK',
          attrs: [
            {
              name: 'someOption',
              type: 'number',
              value: 10,
            },
          ],
        },
        {
          event: 'mousedown',
          button: 2,
          eventType: 'BLOCK',
          attrs: [
            {
              name: 'someOption',
              type: 'number',
              value: 20,
            },
          ],
        },
      ],
    });

    expect(mouseControl.inputEventBindings.mousedown[0]).toStrictEqual({
      eventType: 'ATTACK',
      attrs: {
        someOption: 10,
      },
    });
    expect(mouseControl.inputEventBindings.mousedown[2]).toStrictEqual({
      eventType: 'BLOCK',
      attrs: {
        someOption: 20,
      },
    });
  });

  it('Correct updates values ', () => {
    const mouseControl = new MouseControl({
      inputEventBindings: [
        {
          event: 'mousedown',
          button: 0,
          eventType: 'ATTACK',
          attrs: [
            {
              name: 'someOption',
              type: 'number',
              value: 10,
            },
          ],
        },
      ],
    });

    mouseControl.inputEventBindings = {
      mousedown: {
        0: {
          eventType: 'BLOCK',
          attrs: {
            someOption: 20,
          },
        },
      },
    };

    expect(mouseControl.inputEventBindings.mousedown[0]).toStrictEqual({
      eventType: 'BLOCK',
      attrs: {
        someOption: 20,
      },
    });
  });
});
