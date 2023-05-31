import React, {
  useCallback,
  useState,
  useEffect,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { InputNumber } from 'antd'

const MIN_STEP = 1

interface StepFieldProps {
  value: number
  onChange: (value: number) => void
}

export const StepField: FC<StepFieldProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation()

  const [inputValue, setInputValue] = useState<number | null>(value)

  useEffect(() => {
    if (inputValue !== null && value !== inputValue) {
      setInputValue(value)
    }
  }, [value])

  const handleChange = useCallback((newValue: number | null): void => {
    setInputValue(newValue)
    onChange(newValue ?? MIN_STEP)
  }, [onChange])

  const handleBlur = useCallback(() => {
    setInputValue(value)
  }, [value])

  return (
    <label className="grid-settings__field">
      <span className="grid-settings__label">
        {t('settings.grid.modal.field.step.label')}
      </span>
      <InputNumber
        className="grid-settings__input"
        type="number"
        size="small"
        min={MIN_STEP}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        controls={false}
        precision={0}
      />
    </label>
  )
}
