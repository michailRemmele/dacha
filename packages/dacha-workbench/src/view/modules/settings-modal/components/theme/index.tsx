import { useState, useCallback, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';

import { persistentStorage } from '../../../../../persistent-storage';
import type { ThemePreference } from '../../../../providers/theme-provider/types';
import type { ModalComponentProps } from '../types';

import styles from './theme.module.css';

const PREFERENCES: ThemePreference[] = ['system', 'light', 'dark'];

export const Theme: FC<ModalComponentProps> = () => {
  const { t } = useTranslation();

  const [preference, setPreference] = useState<ThemePreference>(() =>
    persistentStorage.get('themePreference', 'system'),
  );

  const handleChange = useCallback((event: RadioChangeEvent): void => {
    const value = event.target.value as ThemePreference;

    setPreference(value);
    window.electron.switchTheme(value);
  }, []);

  return (
    <div className={styles.theme}>
      <Radio.Group value={preference} onChange={handleChange}>
        {PREFERENCES.map((value) => (
          <Radio key={value} value={value}>
            {t(`settings.theme.modal.field.${value}.label`)}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
};
