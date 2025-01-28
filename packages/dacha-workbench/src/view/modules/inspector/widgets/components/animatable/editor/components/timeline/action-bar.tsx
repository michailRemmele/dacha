import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { DeleteOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import type { Animation } from 'dacha'

import { getStatePath, getSubstatePath } from '../../utils/paths'
import { ActionBarStyled, ActionButtonCSS } from '../../editor.style'
import { duplicateFrame } from '../../utils'
import { useConfig, useCommander } from '../../../../../../../../hooks'
import { addValue, deleteValue } from '../../../../../../../../commands'
import { AnimationEditorContext } from '../../providers'
import { STATE_TYPE } from '../../const'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const { selectedEntity } = useContext(AnimationEditorContext)

  const statePath = selectedEntity ? getStatePath(selectedEntity.path) : undefined
  const substatePath = selectedEntity ? getSubstatePath(selectedEntity.path) : undefined
  const framePath = selectedEntity?.type === 'frame' ? selectedEntity.path : undefined

  const state = useConfig(statePath) as Animation.StateConfig | undefined

  const framesPath = useMemo(() => {
    if (statePath === undefined || state === undefined) {
      return undefined
    }
    if (state.type === STATE_TYPE.INDIVIDUAL) {
      return statePath.concat('timeline', 'frames')
    }
    if (!substatePath) {
      return undefined
    }
    return substatePath.concat('timeline', 'frames')
  }, [state, statePath, substatePath])

  const frame = useConfig(framePath) as Animation.FrameConfig | undefined

  const handleAdd = useCallback(() => {
    dispatch(addValue(framesPath as Array<string>, {
      id: uuidv4(),
      fields: [],
    }))
  }, [dispatch, framesPath])

  const handleDuplicate = useCallback(() => {
    if (framesPath === undefined || frame === undefined) {
      return
    }

    dispatch(addValue(framesPath, duplicateFrame(frame)))
  }, [dispatch, framesPath, frame])

  const handleDelete = useCallback(() => {
    dispatch(deleteValue(framePath as Array<string>))
  }, [dispatch, framePath])

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
      <Button
        css={ActionButtonCSS}
        icon={<CopyOutlined />}
        size="small"
        onClick={handleDuplicate}
        title={t('components.animatable.editor.frame.duplicate.button.title')}
        disabled={framePath === undefined}
      />
      <Button
        css={ActionButtonCSS}
        icon={<DeleteOutlined />}
        size="small"
        onClick={handleDelete}
        title={t('components.animatable.editor.frame.delete.button.title')}
        disabled={framePath === undefined}
      />
    </ActionBarStyled>
  )
}
