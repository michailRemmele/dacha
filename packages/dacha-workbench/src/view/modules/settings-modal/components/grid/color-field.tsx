import {
  useCallback,
  useState,
  useEffect,
  FC,
  ChangeEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Input, Typography } from 'antd'

import {
  SettingsFieldStyled,
  SettingsLabelCSS,
  SettingsInputCSS,
} from './grid.style'

interface ColorFieldProps {
  value: string
  onChange: (value: string) => void
}

export const ColorField: FC<ColorFieldProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation()

  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value)
    }
  }, [value])

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value)
    onChange(event.target.value)
  }, [onChange])

  return (
    <SettingsFieldStyled>
      <Typography.Text css={SettingsLabelCSS}>
        {t('settings.grid.modal.field.color.label')}
      </Typography.Text>
      <Input
        css={SettingsInputCSS}
        size="small"
        value={inputValue}
        onChange={handleChange}
      />
    </SettingsFieldStyled>
  )
}
