import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import {
  DeleteOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  RightCircleOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import type { Animation } from 'dacha'

import { ActionBarStyled, ActionButtonCSS } from '../../editor.style'
import { duplicateState, duplicateSubstate } from '../../utils'
import { useConfig, useCommander } from '../../../../../../../../hooks'
import { addValue, deleteValue, setValue } from '../../../../../../../../commands'
import { AnimationEditorContext } from '../../providers'
import { PICK_MODE, STATE_TYPE } from '../../const'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const {
    path,
    selectedState: statePath,
    selectedSubstate: substatePath,
    selectedEntity,
  } = useContext(AnimationEditorContext)

  const initialStatePath = useMemo(() => path.concat('initialState'), [path])
  const statesPath = useMemo(() => path.concat('states'), [path])
  const substatesPath = useMemo(
    () => statePath && statePath.concat('substates'),
    [statePath],
  )

  const initialState = useConfig(initialStatePath) as string
  const states = useConfig(statesPath) as Array<Animation.StateConfig>
  const selectedStateConfig = useConfig(statePath) as Animation.StateConfig | undefined
  const selectedSubstateConfig = useConfig(substatePath) as Animation.SubstateConfig | undefined

  const handleAddSubstate = useCallback(() => {
    const { substates, pickMode } = selectedStateConfig as Animation.GroupStateConfig

    dispatch(addValue(substatesPath as Array<string>, {
      id: uuidv4(),
      name: t('components.animatable.editor.substate.new.title', { index: substates.length }),
      timeline: {
        frames: [],
        looped: false,
      },
      x: 0,
      y: pickMode === PICK_MODE.TWO_DIMENSIONAL ? 0 : undefined,
    }))
  }, [dispatch, substatesPath, selectedStateConfig])

  const handleAddState = useCallback(() => {
    dispatch(addValue(statesPath, {
      id: uuidv4(),
      name: t('components.animatable.editor.state.new.title', { index: states.length }),
      type: STATE_TYPE.INDIVIDUAL,
      speed: 1,
      timeline: {
        frames: [],
        looped: false,
      },
      transitions: [],
    }))
  }, [dispatch, statesPath, states])

  const handleInitialSet = useCallback(() => {
    dispatch(setValue(initialStatePath, (selectedStateConfig as Animation.GroupStateConfig).id))
  }, [dispatch, selectedStateConfig, initialStatePath])

  const handleDuplicate = useCallback(
    () => {
      if (selectedEntity?.type === 'state') {
        dispatch(addValue(
          statesPath,
          duplicateState(selectedStateConfig as Animation.StateConfig),
        ))
      }
      if (selectedEntity?.type === 'substate') {
        dispatch(addValue(
          substatesPath as Array<string>,
          duplicateSubstate(selectedSubstateConfig as Animation.SubstateConfig),
        ))
      }
    },
    [
      dispatch, selectedEntity, statesPath,
      substatesPath, selectedStateConfig, selectedSubstateConfig,
    ],
  )

  const handleDelete = useCallback(() => {
    if (selectedEntity?.type === 'state') {
      dispatch(deleteValue(statePath as Array<string>))
    }
    if (selectedEntity?.type === 'substate') {
      dispatch(deleteValue(substatePath as Array<string>))
    }
  }, [dispatch, statePath, substatePath, selectedEntity])

  return (
    <ActionBarStyled>
      <Button
        css={ActionButtonCSS}
        icon={<PlusOutlined />}
        size="small"
        onClick={handleAddState}
        title={t('components.animatable.editor.state.add.button.title')}
      />
      <Button
        css={ActionButtonCSS}
        icon={<PlusCircleOutlined />}
        size="small"
        onClick={handleAddSubstate}
        title={t('components.animatable.editor.substate.add.button.title')}
        disabled={(selectedEntity?.type !== 'state' || selectedStateConfig?.type !== 'group') && selectedEntity?.type !== 'substate'}
      />
      <Button
        css={ActionButtonCSS}
        icon={<RightCircleOutlined />}
        size="small"
        onClick={handleInitialSet}
        title={t('components.animatable.editor.state.setInitial.button.title')}
        disabled={selectedEntity?.type !== 'state' || selectedStateConfig?.id === initialState}
      />
      <Button
        css={ActionButtonCSS}
        icon={<CopyOutlined />}
        size="small"
        onClick={handleDuplicate}
        title={
          selectedEntity?.type === 'substate'
            ? t('components.animatable.editor.substate.duplicate.button.title')
            : t('components.animatable.editor.state.duplicate.button.title')
        }
        disabled={selectedEntity?.type !== 'state' && selectedEntity?.type !== 'substate'}
      />
      <Button
        css={ActionButtonCSS}
        icon={<DeleteOutlined />}
        size="small"
        onClick={handleDelete}
        title={
          selectedEntity?.type === 'substate'
            ? t('components.animatable.editor.substate.delete.button.title')
            : t('components.animatable.editor.state.delete.button.title')
        }
        disabled={selectedEntity?.type !== 'state' && selectedEntity?.type !== 'substate'}
      />
    </ActionBarStyled>
  )
}
