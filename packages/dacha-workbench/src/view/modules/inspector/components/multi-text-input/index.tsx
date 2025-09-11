import { useCallback, FC } from 'react';
import { Select as AntdSelect } from 'antd';

import { Labelled, LabelledProps } from '../labelled';
import type { MultiTextInputProps } from '../../../../../types/inputs';

import { SelectCSS } from './multi-text-input.style';

export const MultiTextInput: FC<MultiTextInputProps> = ({
  onChange = (): void => void 0,
  onBlur = (): void => void 0,
  onAccept = (): void => void 0,
  defaultValue,
  onSelect,
  value,
  ...props
}) => {
  const handleChange = useCallback(
    (values: string[]) => onChange(values),
    [onChange],
  );

  const handleDeselect = useCallback(() => {
    onAccept();
  }, [onAccept]);

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      onAccept();
      onBlur(event);
    },
    [onBlur, onAccept],
  );

  return (
    <AntdSelect
      css={SelectCSS}
      tokenSeparators={[' ', ',']}
      size="small"
      mode="tags"
      onChange={handleChange}
      onDeselect={handleDeselect}
      onBlur={handleBlur}
      suffixIcon={null}
      open={false}
      value={value}
      {...props}
    />
  );
};

export const LabelledMultiTextInput: FC<
  MultiTextInputProps & Omit<LabelledProps, 'children'>
> = ({ label, ...props }) => (
  <Labelled label={label}>
    <MultiTextInput {...props} />
  </Labelled>
);
