import {
  useCallback,
  useState,
  useEffect,
  useRef,
  FC,
} from 'react'
import type { KeyboardEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { Space, Input, Button } from 'antd'
import type { InputRef } from 'antd'
import { CloseOutlined, EditOutlined } from '@ant-design/icons'

import { Labelled } from '../../../components/labelled'

import {
  KeyPickerSpaceCompactCSS,
  KeyPickerButtonCSS,
} from './keyboard-control.style'

const ENTER_KEY_CODE = 'Enter'
const SPACE_KEY_CODE = 'Space'

export interface KeyPickerProps {
  value: string
  onChange: (value: string) => void
}

export const KeyPicker: FC<KeyPickerProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation()

  const [editMode, setEditMode] = useState(false)
  const [valueVisible, setValueVisible] = useState(true)
  const inputRef = useRef<InputRef>(null)

  useEffect(() => {
    setValueVisible(true)
  }, [value])

  const handleKeyChange = useCallback<KeyboardEventHandler<HTMLInputElement>>((event) => {
    if (editMode) {
      event.preventDefault()

      if (event.code !== value) {
        onChange(event.code)
      } else {
        setValueVisible(true)
      }
      setEditMode(false)
      return
    }

    if (event.code === ENTER_KEY_CODE || event.code === SPACE_KEY_CODE) {
      setEditMode(true)
      setValueVisible(false)
    }
  }, [editMode, value])

  const handleBlur = useCallback(() => {
    setEditMode(false)
    setValueVisible(true)
  }, [])

  const handleClick = useCallback(() => {
    if (!editMode) {
      inputRef.current?.focus()
    }
    setEditMode(!editMode)
    setValueVisible(!valueVisible)
  }, [editMode, valueVisible])

  return (
    <Labelled label={t('components.keyboardControl.bind.key.title')}>
      <Space.Compact
        css={KeyPickerSpaceCompactCSS}
        size="small"
      >
        <Input
          ref={inputRef}
          onKeyDown={handleKeyChange}
          onBlur={handleBlur}
          value={valueVisible ? value : ''}
          readOnly={!editMode}
        />
        <Button
          css={KeyPickerButtonCSS}
          icon={!editMode ? <EditOutlined /> : <CloseOutlined />}
          onClick={handleClick}
        />
      </Space.Compact>
    </Labelled>
  )
}
