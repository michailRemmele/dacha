import { KeyboardControl } from '../index';

describe('Contrib -> components -> KeyboardControl', () => {
  it('Returns correct values ', () => {
    const keyboardControl = new KeyboardControl({
      inputEventBindings: [
        {
          key: 'KeyW',
          pressed: true,
          keepEmit: true,
          messageType: 'RUN',
          attrs: [
            {
              name: 'angle',
              type: 'number',
              value: 270,
            },
          ],
        },
        {
          key: 'KeyI',
          pressed: false,
          messageType: 'INVENTORY_OPEN',
          attrs: [],
        },
      ],
    }).clone();

    expect(keyboardControl.inputEventBindings.KeyW.pressed).toStrictEqual({
      messageType: 'RUN',
      keepEmit: true,
      attrs: {
        angle: 270,
      },
    });
    expect(keyboardControl.inputEventBindings.KeyI.released).toStrictEqual({
      messageType: 'INVENTORY_OPEN',
      keepEmit: false,
      attrs: {},
    });
  });

  it('Clones return deep copy of original component', () => {
    const originalKeyboardControl = new KeyboardControl({
      inputEventBindings: [
        {
          key: 'KeyW',
          pressed: true,
          keepEmit: true,
          messageType: 'WALK',
          attrs: [
            {
              name: 'angle',
              type: 'number',
              value: 90,
            },
          ],
        },
      ],
    });
    const cloneKeyboardControl = originalKeyboardControl.clone();

    expect(originalKeyboardControl).not.toBe(cloneKeyboardControl);

    expect(originalKeyboardControl.inputEventBindings).not.toBe(
      cloneKeyboardControl.inputEventBindings,
    );
    expect(originalKeyboardControl.inputEventBindings.KeyW.pressed).not.toBe(
      cloneKeyboardControl.inputEventBindings.KeyW.pressed,
    );
    expect(
      originalKeyboardControl.inputEventBindings.KeyW.pressed?.attrs,
    ).not.toBe(
      cloneKeyboardControl.inputEventBindings.KeyW.pressed?.attrs,
    );
  });
});
