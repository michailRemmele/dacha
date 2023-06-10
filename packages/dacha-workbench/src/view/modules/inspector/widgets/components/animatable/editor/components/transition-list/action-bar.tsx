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
import type { Animation } from 'remiz'

import { ActionBarStyled, ActionButtonCSS } from '../../editor.style'
import { duplicateTransition } from '../../utils'
import { useConfig, useCommander } from '../../../../../../../../hooks'
import { addValue, deleteValue } from '../../../../../../../../commands'
import { AnimationEditorContext } from '../../providers'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const {
    path,
    selectedState,
    selectedTransition,
    selectTransition,
  } = useContext(AnimationEditorContext)

  const statePath = useMemo(() => path.concat('states', `id:${selectedState as string}`), [path, selectedState])
  const transitionsPath = useMemo(() => statePath.concat('transitions'), [statePath])
  const transitionPath = useMemo(
    () => {
      if (selectedTransition === undefined) {
        return undefined
      }
      return transitionsPath.concat(`id:${selectedTransition}`)
    },
    [transitionsPath, selectedTransition],
  )
  const transition = useConfig(transitionPath) as Animation.TransitionConfig | undefined

  const stateConfig = useConfig(statePath) as Animation.StateConfig

  const handleAdd = useCallback(() => {
    dispatch(addValue(transitionsPath, {
      id: uuidv4(),
      state: stateConfig.id,
      time: 0,
      conditions: [],
    }))
  }, [dispatch, transitionsPath, stateConfig])

  const handleDuplicate = useCallback(() => {
    if (transitionsPath === undefined || transition === undefined) {
      return
    }

    dispatch(addValue(transitionsPath, duplicateTransition(transition)))
  }, [dispatch, transitionsPath, transition])

  const handleDelete = useCallback(() => {
    selectTransition()
    dispatch(deleteValue(transitionPath as Array<string>))
  }, [dispatch, transitionPath])

  return (
    <ActionBarStyled>
      <Button
        css={ActionButtonCSS}
        icon={<PlusOutlined />}
        size="small"
        onClick={handleAdd}
        title={t('components.animatable.editor.transition.add.button.title')}
        disabled={selectedState === undefined}
      />
      <Button
        css={ActionButtonCSS}
        icon={<CopyOutlined />}
        size="small"
        onClick={handleDuplicate}
        title={t('components.animatable.editor.transition.duplicate.button.title')}
        disabled={selectedTransition === undefined}
      />
      <Button
        css={ActionButtonCSS}
        icon={<DeleteOutlined />}
        size="small"
        onClick={handleDelete}
        title={t('components.animatable.editor.transition.delete.button.title')}
        disabled={selectedTransition === undefined}
      />
    </ActionBarStyled>
  )
}
