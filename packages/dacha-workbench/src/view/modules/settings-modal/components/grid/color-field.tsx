import React, {
  useCallback,
  useState,
  useEffect,
  FC,
  ChangeEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from 'antd'

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
    <label className="grid-settings__field">
      <span className="grid-settings__label">
        {t('settings.grid.modal.field.color.label')}
      </span>
      <Input
        className="grid-settings__input"
        size="small"
        value={inputValue}
        onChange={handleChange}
      />
    </label>
  )
}
