import {
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox, Typography } from 'antd'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'

import {
  SettingsFieldStyled,
  SettingsLabelCSS,
} from './grid.style'

interface ShowGridFieldProps {
  value: boolean
  onChange: (checked: boolean) => void
}

export const ShowGridField: FC<ShowGridFieldProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation()

  const handleChange = useCallback((event: CheckboxChangeEvent): void => {
    onChange(event.target.checked)
  }, [onChange])

  return (
    <SettingsFieldStyled>
      <Typography.Text css={SettingsLabelCSS}>
        {t('settings.grid.modal.field.showGrid.label')}
      </Typography.Text>
      <Checkbox
        checked={value}
        onChange={handleChange}
      />
    </SettingsFieldStyled>
  )
}
