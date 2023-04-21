import React, {
  useCallback,
  useState,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal } from 'antd'

import type { WidgetProps } from '../../../../../../types/widget-schema'

import { Editor } from './editor'
import { AnimationEditorProvider } from './editor/providers'

import './style.less'

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
        wrapClassName="animatable-widget__modal"
        width=""
        title={t('components.animatable.editor.title')}
        open={open}
        onCancel={handleEditorClose}
        footer={null}
      >
        <AnimationEditorProvider path={path}>
          <Editor />
        </AnimationEditorProvider>
      </Modal>
    </div>
  )
}
