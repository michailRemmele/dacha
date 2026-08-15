import { FC } from 'react';

import { LabelledTextArea } from '../../../text-area';
import type { TextAreaProps } from '../../../../../../../types/inputs';
import type { LabelledProps } from '../../../labelled';

export const TextAreaField: FC<TextAreaProps & LabelledProps> = (props) => (
  <LabelledTextArea {...props} />
);
