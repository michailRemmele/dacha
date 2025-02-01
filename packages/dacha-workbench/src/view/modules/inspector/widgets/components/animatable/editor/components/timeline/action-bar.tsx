import {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { Animation } from 'dacha'

import { getStatePath, getSubstatePath } from '../../utils/paths'
import { ActionBarStyled, ActionButtonCSS } from '../../editor.style'
import { useConfig, useCommander } from '../../../../../../../../hooks'
import { HotkeysBar } from '../../../../../../../../components'
import { AnimationEditorContext } from '../../providers'
import { addFrame } from '../../commands/frames'

import { getFramesPath } from './utils'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const { inspectedEntity } = useContext(AnimationEditorContext)

  const statePath = inspectedEntity ? getStatePath(inspectedEntity.path) : undefined
  const substatePath = inspectedEntity ? getSubstatePath(inspectedEntity.path) : undefined

  const state = useConfig(statePath) as Animation.StateConfig | undefined

  const framesPath = getFramesPath(state, statePath, substatePath)

  const handleAdd = useCallback(() => {
    dispatch(addFrame(framesPath as string[]))
  }, [dispatch, framesPath])

  return (
    <ActionBarStyled>
      <Button
        css={ActionButtonCSS}
        icon={<PlusOutlined />}
        size="small"
        onClick={handleAdd}
        title={t('components.animatable.editor.frame.add.button.title')}
        disabled={framesPath === undefined}
      />

      <HotkeysBar />
    </ActionBarStyled>
  )
}
