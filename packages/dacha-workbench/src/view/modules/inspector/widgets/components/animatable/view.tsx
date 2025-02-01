import {
  useCallback,
  useState,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

import { Modal } from '../../../../../components'
import type { WidgetProps } from '../../../../../../types/widget-schema'

import { Editor } from './editor'
import { AnimationEditorProvider } from './editor/providers'

export const AnimatableWidget: FC<WidgetProps> = ({ path }) => {
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)

  const handleEditorOpen = useCallback(() => setOpen(true), [])
  const handleEditorClose = useCallback(() => setOpen(false), [])

  return (
    <div>
      <Button
        size="small"
        onClick={handleEditorOpen}
        block
      >
        {t('components.animatable.openEditorButton.title')}
      </Button>
      <Modal
        title={t('components.animatable.editor.title')}
        open={open}
        onCancel={handleEditorClose}
        width="90%"
      >
        <AnimationEditorProvider path={path}>
          <Editor />
        </AnimationEditorProvider>
      </Modal>
    </div>
  )
}
