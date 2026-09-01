import { useCallback, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Typography } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';

import * as styles from './grid.module.css';

interface ShowGridFieldProps {
  value: boolean;
  onChange: (checked: boolean) => void;
}

export const ShowGridField: FC<ShowGridFieldProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const handleChange = useCallback(
    (event: CheckboxChangeEvent): void => {
      onChange(event.target.checked);
    },
    [onChange],
  );

  return (
    <label className={styles.settingsField}>
      <Typography.Text className={styles.settingsLabel}>
        {t('settings.grid.modal.field.showGrid.label')}
      </Typography.Text>
      <Checkbox
        data-testid="settings-show-grid"
        checked={value}
        onChange={handleChange}
      />
    </label>
  );
};
