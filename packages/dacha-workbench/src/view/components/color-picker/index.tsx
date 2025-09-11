import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { ColorPicker as ColorPickerAntd, Button } from 'antd';
import type { ColorPickerProps as ColorPickerAntdProps } from 'antd';

import { debounce } from '../../../utils/debounce';

import { ColorStyled, ColorButtonCSS } from './color-picker.style';

const DELAY = 100;
const CLOSE_CODES = ['Escape', 'Enter'];

interface ColorPickerProps
  extends Omit<ColorPickerAntdProps, 'onChange' | 'value'> {
  onChange?: (value: string) => void;
  value: string;
}

export const ColorPicker: FC<ColorPickerProps> = ({
  onChange = (): void => void 0,
  onOpenChange = (): void => void 0,
  value,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] =
    useState<ColorPickerAntdProps['value']>(value);

  const triggerRef = useRef<HTMLElement | null>(null);

  // TODO: Remove all keyboard accessibility hacks once ColorPicker will be updated
  useEffect(() => {
    if (!open) {
      return (): void => {};
    }

    const handleClose = (event: KeyboardEvent): void => {
      if (!CLOSE_CODES.includes(event.code)) {
        return;
      }

      setOpen(false);
      onOpenChange(false);

      setTimeout(() => triggerRef.current?.focus());
    };

    window.addEventListener('keydown', handleClose);

    return (): void => window.removeEventListener('keydown', handleClose);
  }, [open, onOpenChange]);

  const onChangeDebounced = useMemo(
    () => debounce(onChange, DELAY),
    [onChange],
  );

  const handleChange = useCallback<Required<ColorPickerAntdProps>['onChange']>(
    (color, hex) => {
      setInputValue(color);
      onChangeDebounced(hex);
    },
    [onChangeDebounced],
  );

  const handleOpenChange = useCallback(
    (state: boolean) => {
      setOpen(state);

      if (state) {
        triggerRef.current?.blur();
      }

      onOpenChange(state);
    },
    [onOpenChange],
  );

  const setRef = useCallback((ref: HTMLElement | null) => {
    triggerRef.current = ref;
  }, []);

  return (
    <>
      <ColorPickerAntd
        onChange={handleChange}
        onOpenChange={handleOpenChange}
        arrow={false}
        open={open}
        value={inputValue}
        {...props}
      >
        <Button css={ColorButtonCSS(open)} size="small" ref={setRef}>
          <ColorStyled color={value} />
        </Button>
      </ColorPickerAntd>
    </>
  );
};
