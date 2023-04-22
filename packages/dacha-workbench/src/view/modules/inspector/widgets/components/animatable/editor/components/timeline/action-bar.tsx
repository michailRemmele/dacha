import React, {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { DeleteOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import type { Animation } from 'remiz'

import { duplicateFrame } from '../../utils'
import { useConfig, useCommander } from '../../../../../../../../hooks'
import { addValue, deleteValue } from '../../../../../../../../commands'
import { AnimationEditorContext } from '../../providers'
import { STATE_TYPE } from '../../const'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const {
    path,
    selectedState,
    selectedSubstate,
    selectedFrame,
    selectFrame,
  } = useContext(AnimationEditorContext)

  const statesPath = useMemo(() => path.concat('states'), [path])
  const states = useConfig(statesPath) as Array<Animation.StateConfig>

  const framesPath = useMemo(
    () => {
      const state = states.find((item) => item.id === selectedState)

      if (!state) {
        return undefined
      }

      if (state.type === STATE_TYPE.INDIVIDUAL) {
        return statesPath.concat(`id:${selectedState as string}`, 'timeline', 'frames')
      }

      if (!selectedSubstate) {
        return undefined
      }

      return statesPath.concat(`id:${selectedState as string}`, 'substates', `id:${selectedSubstate}`, 'timeline', 'frames')
    },
    [states, selectedState, statesPath, selectedSubstate],
  )
  const framePath = useMemo(
    () => framesPath && framesPath.concat(`id:${selectedFrame as string}`),
    [framesPath, selectedFrame],
  )
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
    selectFrame()
    dispatch(deleteValue(framePath as Array<string>))
  }, [dispatch, framePath])

  return (
    <header className="animation-editor__action-bar">
      <Button
        className="animation-editor__action"
        icon={<PlusOutlined />}
        size="small"
        onClick={handleAdd}
        title={t('components.animatable.editor.frame.add.button.title')}
        disabled={framesPath === undefined}
      />
      <Button
        className="animation-editor__action"
        icon={<CopyOutlined />}
        size="small"
        onClick={handleDuplicate}
        title={t('components.animatable.editor.frame.duplicate.button.title')}
        disabled={selectedFrame === undefined}
      />
      <Button
        className="animation-editor__action"
        icon={<DeleteOutlined />}
        size="small"
        onClick={handleDelete}
        title={t('components.animatable.editor.frame.delete.button.title')}
        disabled={selectedFrame === undefined}
      />
    </header>
  )
}
