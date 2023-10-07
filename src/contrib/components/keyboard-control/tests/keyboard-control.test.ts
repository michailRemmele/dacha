import { KeyboardControl } from '../index';

describe('Contrib -> components -> KeyboardControl', () => {
  it('Returns correct values ', () => {
    const keyboardControl = new KeyboardControl({
      inputEventBindings: [
        {
          key: 'W',
          event: 'PRESSED',
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
          key: 'I',
          event: 'RELEASED',
          messageType: 'INVENTORY_OPEN',
          attrs: [],
        },
      ],
    }).clone();

    expect(keyboardControl.inputEventBindings.W_PRESSED).toStrictEqual({
      messageType: 'RUN',
      attrs: {
        angle: 270,
      },
    });
    expect(keyboardControl.inputEventBindings.I_RELEASED).toStrictEqual({
      messageType: 'INVENTORY_OPEN',
      attrs: {},
    });
    expect(keyboardControl.keyStates).toStrictEqual({
      W: null,
      I: null,
    });
  });

  it('Correct updates values ', () => {
    const keyboardControl = new KeyboardControl({
      inputEventBindings: [
        {
          key: 'W',
          event: 'PRESSED',
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
    }).clone();

    keyboardControl.inputEventBindings = {
      W_PRESSED: {
        messageType: 'WALK',
        attrs: {
          angle: 90,
        },
      },
    };
    keyboardControl.keyStates.W = 'PRESSED';

    expect(keyboardControl.inputEventBindings.W_PRESSED).toStrictEqual({
      messageType: 'WALK',
      attrs: {
        angle: 90,
      },
    });
    expect(keyboardControl.keyStates).toStrictEqual({
      W: 'PRESSED',
    });
  });

  it('Clones return deep copy of original component', () => {
    const originalKeyboardControl = new KeyboardControl({
      inputEventBindings: [
        {
          key: 'W',
          event: 'PRESSED',
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
    expect(originalKeyboardControl.inputEventBindings.W_PRESSED).not.toBe(
      cloneKeyboardControl.inputEventBindings.W_PRESSED,
    );
    expect(
      originalKeyboardControl.inputEventBindings.W_PRESSED.attrs,
    ).not.toBe(
      cloneKeyboardControl.inputEventBindings.W_PRESSED.attrs,
    );

    expect(originalKeyboardControl.keyStates).not.toBe(
      cloneKeyboardControl.keyStates,
    );
  });
});
