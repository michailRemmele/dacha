import {
  useCallback,
  useState,
} from 'react'
import type { ReactElement, FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { CreateNewModal } from './create-new-modal'
import {
  EntityPickerStyled,
  FooterStyled,
  SelectCSS,
  ButtonCSS,
} from './entity-picker.style'

interface EntityPickerProps {
  placeholder: string
  options: {
    label: string
    value: string
  }[]
  onAdd: (value: string) => void
  onCreate: (name: string, path: string) => void
  type: 'system' | 'component' | 'behavior'
  size?: 'middle' | 'small'
  className?: string
}

export const EntityPicker: FC<EntityPickerProps> = ({
  placeholder,
  options,
  onAdd,
  onCreate,
  type,
  size = 'middle',
  className,
}): JSX.Element => {
  const { t } = useTranslation()

  const [value, setValue] = useState<string>()
  const [open, setOpen] = useState(false)

  const handleChange = useCallback((selectedValue: string) => {
    setValue(selectedValue)
  }, [])

  const handleAdd = useCallback(() => {
    if (!value) {
      return
    }

    onAdd(value)

    setValue(undefined)
  }, [value, onAdd])

  const handleCancel = useCallback(() => setOpen(false), [])
  const handleOpen = useCallback(() => setOpen(true), [])

  return (
    <>
      <EntityPickerStyled className={className}>
        <Select
          css={SelectCSS}
          size={size}
          options={options}
          onChange={handleChange}
          value={value}
          placeholder={placeholder}
          open={open ? false : undefined}
          showSearch
          dropdownRender={(menu): ReactElement => (
            <>
              <div>
                {menu}
              </div>
              <FooterStyled>
                <Button block size="small" onClick={handleOpen}>
                  {t('inspector.entityPicker.createNew.button.title')}
                </Button>
              </FooterStyled>
            </>
          )}
        />
        <Button
          css={ButtonCSS}
          size={size}
          icon={<PlusOutlined />}
          onClick={handleAdd}
        />
      </EntityPickerStyled>

      {open && (
        <CreateNewModal
          type={type}
          open={open}
          onClose={handleCancel}
          onCreate={onCreate}
        />
      )}
    </>
  )
}
