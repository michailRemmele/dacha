import { FC } from 'react';
import { Space } from 'antd';

import { NumberInput } from '../number-input';
import { Labelled, LabelledProps } from '../labelled';
import type { VectorInputProps } from '../../../../../types/inputs';
import { cx } from '../../../../../utils/cx';

import * as styles from './vector-input.module.css';

export const VectorInput: FC<VectorInputProps> = ({
  value,
  onChange = (): void => void 0,
  onAccept = (): void => void 0,
  onBlur = (): void => void 0,
  className,
}) => (
  <div className={cx(styles.vector, className)}>
    <Space.Compact>
      <Space.Addon
        className={styles.axisX}
        onClick={(e): void => e.preventDefault()}
      >
        X
      </Space.Addon>
      <NumberInput
        value={value?.x}
        onChange={(x): void => onChange({ ...value, x })}
        onAccept={onAccept}
        onBlur={onBlur}
      />
    </Space.Compact>
    <Space.Compact>
      <Space.Addon
        className={styles.axisY}
        onClick={(e): void => e.preventDefault()}
      >
        Y
      </Space.Addon>
      <NumberInput
        value={value?.y}
        onChange={(y): void => onChange({ ...value, y })}
        onAccept={onAccept}
        onBlur={onBlur}
      />
    </Space.Compact>
  </div>
);

export const LabelledVectorInput: FC<
  VectorInputProps & Omit<LabelledProps, 'children'>
> = ({ label, ...props }) => (
  <Labelled label={label}>
    <VectorInput {...props} />
  </Labelled>
);
