import { MouseControl } from '../index';

describe('Contrib -> components -> MouseControl', () => {
  it('Returns correct values ', () => {
    const mouseControl = new MouseControl({
      inputEventBindings: [
        {
          event: 'mousedown',
          button: 0,
          messageType: 'ATTACK',
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
          messageType: 'BLOCK',
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
      messageType: 'ATTACK',
      attrs: {
        someOption: 10,
      },
    });
    expect(mouseControl.inputEventBindings.mousedown[2]).toStrictEqual({
      messageType: 'BLOCK',
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
          messageType: 'ATTACK',
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
          messageType: 'BLOCK',
          attrs: {
            someOption: 20,
          },
        },
      },
    };

    expect(mouseControl.inputEventBindings.mousedown[0]).toStrictEqual({
      messageType: 'BLOCK',
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
          messageType: 'ATTACK',
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
