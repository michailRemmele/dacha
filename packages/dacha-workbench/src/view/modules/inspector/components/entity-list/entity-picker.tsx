import React, { useCallback, useState, FC } from 'react'
import { Button, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import type { EntityOption } from './types'

interface EntityPickerProps {
  options: Array<EntityOption>
  placeholder: string
}

export const EntityPicker: FC<EntityPickerProps> = ({
  options,
  placeholder,
}): JSX.Element => {
  const [value, setValue] = useState<string>()

  const handleChange = useCallback((selectedValue: string) => {
    setValue(selectedValue)
  }, [])

  const handleAdd = useCallback(() => {
    if (!value) {
      return
    }

    // TODO: Implement entity addition
    console.log(`add entity: ${value}`)
    setValue(undefined)
  }, [value])

  return (
    <div className="entity-picker">
      <Select
        className="entity-picker__select"
        options={options}
        onChange={handleChange}
        value={value}
        placeholder={placeholder}
      />
      <Button
        className="entity-picker__button"
        icon={<PlusOutlined />}
        onClick={handleAdd}
      />
    </div>
  )
}
