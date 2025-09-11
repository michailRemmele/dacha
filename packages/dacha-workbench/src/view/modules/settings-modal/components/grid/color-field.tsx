import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';

import { ColorPicker } from '../../../../components';

import {
  SettingsFieldStyled,
  SettingsLabelCSS,
  SettingsInputCSS,
} from './grid.style';

interface ColorFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColorField: FC<ColorFieldProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <SettingsFieldStyled>
      <Typography.Text css={SettingsLabelCSS}>
        {t('settings.grid.modal.field.color.label')}
      </Typography.Text>
      <ColorPicker
        css={SettingsInputCSS}
        value={value}
        onChange={onChange}
        disabledAlpha
      />
    </SettingsFieldStyled>
  );
};
