import { useCallback, type FC, type ChangeEvent } from 'react';
import { Input } from 'antd';

import { Labelled, LabelledProps } from '../labelled';
import type { TextAreaProps } from '../../../../../types/inputs';

export const TextArea: FC<TextAreaProps> = ({
  onChange = (): void => void 0,
  onAccept = (): void => void 0,
  onBlur = (): void => void 0,
  ...props
}) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value),
    [onChange],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
      onAccept();
      onBlur(event);
    },
    [onAccept, onBlur],
  );

  return (
    <Input.TextArea
      size="small"
      onChange={handleChange}
      onBlur={handleBlur}
      onPressEnter={onAccept}
      rows={3}
      {...props}
    />
  );
};

export const LabelledTextArea: FC<
  TextAreaProps & Omit<LabelledProps, 'children'>
> = ({ label, ...props }) => (
  <Labelled label={label}>
    <TextArea {...props} />
  </Labelled>
);
