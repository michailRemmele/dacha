import { useCallback, useState, useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InputNumber, Typography } from 'antd';

import * as styles from './grid.module.css';

const MIN_STEP = 1;

interface StepFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export const StepField: FC<StepFieldProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState<number | null>(value);

  useEffect(() => {
    if (inputValue !== null && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  const handleChange = useCallback(
    (newValue: number | null): void => {
      setInputValue(newValue);
      onChange(newValue ?? MIN_STEP);
    },
    [onChange],
  );

  const handleBlur = useCallback(() => {
    setInputValue(value);
  }, [value]);

  return (
    <label className={styles.settingsField}>
      <Typography.Text className={styles.settingsLabel}>
        {t('settings.grid.modal.field.step.label')}
      </Typography.Text>
      <InputNumber
        style={{ width: '60%' }}
        type="number"
        min={MIN_STEP}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        controls={false}
        precision={0}
      />
    </label>
  );
};
