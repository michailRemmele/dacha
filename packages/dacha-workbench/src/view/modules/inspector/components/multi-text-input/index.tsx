import { useCallback, FC } from 'react';
import { Select as AntdSelect } from 'antd';

import { Labelled, LabelledProps } from '../labelled';
import type { MultiTextInputProps } from '../../../../../types/inputs';

import { cx } from '../../../../../utils/cx';

import styles from './multi-text-input.module.css';

export const MultiTextInput: FC<MultiTextInputProps> = ({
  onChange = (): void => void 0,
  onBlur = (): void => void 0,
  onAccept = (): void => void 0,
  defaultValue,
  onSelect,
  value,
  className,
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
      className={cx(styles.select, className)}
      classNames={{ item: styles.item }}
      tokenSeparators={[' ', ',']}
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
