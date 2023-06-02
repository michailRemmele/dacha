import React, {
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from 'antd'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'

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
    <label className="grid-settings__field">
      <span className="grid-settings__label">
        {t('settings.grid.modal.field.showGrid.label')}
      </span>
      <Checkbox
        checked={value}
        onChange={handleChange}
      />
    </label>
  )
}
