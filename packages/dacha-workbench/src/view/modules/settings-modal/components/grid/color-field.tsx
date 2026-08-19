import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';

import { ColorPicker } from '../../../../components';

import styles from './grid.module.css';

interface ColorFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColorField: FC<ColorFieldProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <label className={styles.settingsField}>
      <Typography.Text className={styles.settingsLabel}>
        {t('settings.grid.modal.field.color.label')}
      </Typography.Text>
      <ColorPicker value={value} onChange={onChange} disabledAlpha />
    </label>
  );
};
