import { useEffect, useCallback, useState, useRef, FC, HTMLProps } from 'react';
import isEqual from 'lodash.isequal';

import { useConfig, useCommander } from '../../../../hooks';
import { setValue as setValueCmd } from '../../../../commands';

export interface InputFieldProps
  extends Omit<HTMLProps<HTMLElement>, 'onBlur' | 'onChange'> {
  path: string[];
  onBlur?: (value: unknown) => void;
  onChange?: (value: unknown) => void;
  onAccept?: (value: unknown) => void;
  validate?: (value: unknown) => boolean;
  // comment: Allow to pass any component to InputField
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: FC<any>;
  [key: string]: unknown;
}

export const InputField: FC<InputFieldProps> = ({
  component,
  path,
  onBlur = (): void => void 0,
  onChange = (): void => void 0,
  onAccept = (): void => void 0,
  validate,
  ...props
}) => {
  const initialValue = useConfig(path) as string;
  const { dispatch } = useCommander();

  const valueRef = useRef(initialValue);
  const [value, setValue] = useState(initialValue);

  const InputComponent = component;

  useEffect(() => {
    valueRef.current = initialValue;
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = useCallback(() => {
    onBlur(valueRef.current);
  }, [onBlur]);

  const handleChange = useCallback(
    (newValue: string) => {
      valueRef.current = newValue;
      setValue(newValue);
      onChange(newValue);
    },
    [onChange],
  );

  const handleAccept = useCallback(() => {
    if (validate && !validate(valueRef.current)) {
      valueRef.current = initialValue;
      setValue(initialValue);
      return;
    }

    if (!isEqual(valueRef.current, initialValue)) {
      dispatch(setValueCmd(path, valueRef.current));
      onAccept(valueRef.current);
    }
  }, [onAccept, path, dispatch, initialValue, validate]);

  return (
    <InputComponent
      value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onAccept={handleAccept}
      {...props}
    />
  );
};
