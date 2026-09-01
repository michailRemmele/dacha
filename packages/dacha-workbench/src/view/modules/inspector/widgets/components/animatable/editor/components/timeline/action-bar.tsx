import {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from '@gravity-ui/icons'
import type { Animation } from 'dacha'

import { getStatePath, getSubstatePath } from '../../utils/paths'
import * as editorStyles from '../../editor.module.css'
import { useConfig, useCommander } from '../../../../../../../../hooks'
import { HotkeysBar, Icon, IconButton } from '../../../../../../../../components'
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
    <header className={editorStyles.actionBar}>
      <IconButton
        icon={<Icon icon={<Plus />} />}
        onClick={handleAdd}
        title={t('components.animatable.editor.frame.add.button.title')}
        disabled={framesPath === undefined}
      />

      <div className={editorStyles.actionDivider} />

      <HotkeysBar />
    </header>
  )
}
