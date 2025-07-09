import {
  useCallback,
  useState,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Typography } from 'antd'
import { FileOutlined } from '@ant-design/icons'

import { LabelledTextInput } from '../text-input'
import { LabelledDirectoryInput } from '../directory-input'
import { LabelledCheckbox } from '../checkbox'
import { Modal } from '../../../../components'
import { toKebabCase } from '../../../../../utils/to-kebab-case'
import { persistentStorage } from '../../../../../persistent-storage'

import {
  getFileName,
  getFilePath,
  getDefaultDirectory,
} from './utils'
import type { EntityType } from './types'
import {
  ModalContentStyled,
  HeaderCSS,
  HeaderIconCSS,
  ModalFooterStyled,
  ButtonCSS,
} from './entity-picker.style'

interface CreateNewModalProps {
  open: boolean
  type: EntityType
  onClose: () => void
  onCreate: (name: string, path: string) => void
}

export const CreateNewModal: FC<CreateNewModalProps> = ({
  open,
  type,
  onClose,
  onCreate,
}) => {
  const { t } = useTranslation()

  const [baseDirectory, setBaseDirectory] = useState(
    () => persistentStorage.get(`inspector.createNewModal.baseDirectory.${type}`, getDefaultDirectory(type)),
  )
  const [subdirectory, setSubdirectory] = useState('')
  const [filename, setFilename] = useState('')
  const [name, setName] = useState('')
  const [customizePath, setCustomizePath] = useState(false)

  const handleCreate = useCallback(() => {
    onCreate(name, getFilePath(baseDirectory, subdirectory, filename))

    persistentStorage.set(`inspector.createNewModal.baseDirectory.${type}`, baseDirectory)

    onClose()
  }, [onCreate, onClose, baseDirectory, subdirectory, filename, name])

  const handleChangeBaseDirectory = useCallback((value: string) => {
    setBaseDirectory(value)
  }, [])

  const handleChangeName = useCallback((value: string) => {
    setName(value)

    if (!customizePath) {
      setFilename(getFileName(value, type))
      setSubdirectory(toKebabCase(value))
    }
  }, [customizePath, type])

  const handleChangeCustomizePath = useCallback((value: boolean) => {
    setCustomizePath(value)

    if (!value) {
      setFilename(getFileName(name, type))
      setSubdirectory(toKebabCase(name))
    }
  }, [name, type])
  const handleChangeSubdirectory = useCallback((value: string) => setSubdirectory(value), [])
  const handleChangeFilename = useCallback((value: string) => setFilename(value), [])

  return (
    <Modal
      title={t(`inspector.entityPicker.createNew.modal.${type}.title`)}
      open={open}
      onCancel={onClose}
      width={640}
    >
      <Typography.Text css={HeaderCSS}>
        <FileOutlined css={HeaderIconCSS} />
        {`${t('inspector.entityPicker.createNew.modal.field.path.label')} "${getFilePath(baseDirectory, subdirectory, filename)}"`}
      </Typography.Text>

      <ModalContentStyled>
        <LabelledDirectoryInput
          label={t('inspector.entityPicker.createNew.modal.field.baseDirectory.label')}
          value={baseDirectory}
          onChange={handleChangeBaseDirectory}
        />
        <LabelledTextInput
          label={t('inspector.entityPicker.createNew.modal.field.name.label')}
          value={name}
          onChange={handleChangeName}
        />
        <LabelledCheckbox
          label={t('inspector.entityPicker.createNew.modal.field.customizePath.label')}
          value={customizePath}
          onChange={handleChangeCustomizePath}
        />
        <LabelledTextInput
          label={t('inspector.entityPicker.createNew.modal.field.subdirectory.label')}
          value={subdirectory}
          onChange={handleChangeSubdirectory}
          disabled={!customizePath}
        />
        <LabelledTextInput
          label={t('inspector.entityPicker.createNew.modal.field.filename.label')}
          value={filename}
          onChange={handleChangeFilename}
          disabled={!customizePath}
        />
      </ModalContentStyled>

      <ModalFooterStyled>
        <Button css={ButtonCSS} onClick={onClose}>
          {t('inspector.entityPicker.createNew.modal.button.cancel.label')}
        </Button>
        <Button css={ButtonCSS} type="primary" onClick={handleCreate}>
          {t('inspector.entityPicker.createNew.modal.button.create.label')}
        </Button>
      </ModalFooterStyled>
    </Modal>
  )
}
