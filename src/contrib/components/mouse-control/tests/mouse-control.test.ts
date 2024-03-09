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
    }).clone();

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
    }).clone();

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

  it('Clones return deep copy of original component', () => {
    const originalMouseControl = new MouseControl({
      inputEventBindings: [
        {
          event: 'dblclick',
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
    const cloneMouseControl = originalMouseControl.clone();

    expect(originalMouseControl).not.toBe(cloneMouseControl);

    expect(originalMouseControl.inputEventBindings.dblclick[0]).toBeDefined();
    expect(cloneMouseControl.inputEventBindings.dblclick[0]).toBeDefined();

    expect(originalMouseControl.inputEventBindings).not.toBe(cloneMouseControl.inputEventBindings);
    expect(originalMouseControl.inputEventBindings.dblclick[0]).not.toBe(
      cloneMouseControl.inputEventBindings.dblclick[0],
    );
    expect(
      originalMouseControl.inputEventBindings.dblclick[0].attrs,
    ).not.toBe(
      cloneMouseControl.inputEventBindings.dblclick[0].attrs,
    );
  });
});
