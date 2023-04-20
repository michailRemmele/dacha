import React, {
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
} from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import type { Animation } from 'remiz'

import { useConfig, useCommander } from '../../../../../../../../hooks'
import { addValue, deleteValue, setValue } from '../../../../../../../../commands'
import { AnimationEditorContext } from '../../providers'
import { PICK_MODE, STATE_TYPE } from '../../const'

interface ActionBarProps {
  expandedKeys: Array<string>
  setExpandedKeys: (keys: Array<string>) => void
}

export const ActionBar: FC<ActionBarProps> = ({ expandedKeys, setExpandedKeys }) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const {
    path,
    selectedState,
    selectedSubstate,
    selectedEntity,
    selectState,
    selectSubstate,
  } = useContext(AnimationEditorContext)

  const initialStatePath = useMemo(() => path.concat('initialState'), [path])
  const statesPath = useMemo(() => path.concat('states'), [path])
  const statePath = useMemo(
    () => !!selectedState && statesPath.concat(`id:${selectedState}`),
    [statesPath, selectedState],
  )
  const substatesPath = useMemo(
    () => statePath && statePath.concat('substates'),
    [statePath],
  )
  const substatePath = useMemo(
    () => !!(substatesPath && selectedSubstate) && substatesPath.concat(`id:${selectedSubstate}`),
    [substatesPath, selectedSubstate],
  )

  const initialState = useConfig(initialStatePath) as string
  const states = useConfig(statesPath) as Array<Animation.StateConfig>
  const selectedStateConfig = useMemo(
    () => states.find((item) => item.id === selectedState),
    [states, selectedState],
  )

  const handleAddSubstate = useCallback(() => {
    const { id, substates, pickMode } = selectedStateConfig as Animation.GroupStateConfig

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

    if (!expandedKeys.includes(id)) {
      setExpandedKeys([...expandedKeys, id])
    }
  }, [dispatch, substatesPath, selectedStateConfig, expandedKeys])

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

  const handleDelete = useCallback(() => {
    if (selectedEntity?.type === 'state') {
      if (expandedKeys.includes(selectedEntity.id)) {
        setExpandedKeys(expandedKeys.filter((key) => key !== selectedEntity.id))
      }

      selectState()
      dispatch(deleteValue(statePath as Array<string>))
    }
    if (selectedEntity?.type === 'substate') {
      if ((selectedStateConfig as Animation.GroupStateConfig).substates.length === 1) {
        setExpandedKeys(expandedKeys.filter((key) => key !== selectedStateConfig?.id))
      }

      selectSubstate()
      dispatch(deleteValue(substatePath as Array<string>))
    }
  }, [dispatch, statePath, substatePath, selectedEntity, expandedKeys, selectedStateConfig])

  return (
    <header className="animation-editor__action-bar">
      <Button
        className="animation-editor__action"
        icon={<PlusOutlined />}
        size="small"
        onClick={handleAddState}
        title={t('components.animatable.editor.state.add.button.title')}
      />
      <Button
        className="animation-editor__action"
        icon={<PlusCircleOutlined />}
        size="small"
        onClick={handleAddSubstate}
        title={t('components.animatable.editor.substate.add.button.title')}
        disabled={(selectedEntity?.type !== 'state' || selectedStateConfig?.type !== 'group') && selectedEntity?.type !== 'substate'}
      />
      <Button
        className="animation-editor__action"
        icon={<RightCircleOutlined />}
        size="small"
        onClick={handleInitialSet}
        title={t('components.animatable.editor.state.setInitial.button.title')}
        disabled={selectedEntity?.type !== 'state' || selectedStateConfig?.id === initialState}
      />
      <Button
        className="animation-editor__action"
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
    </header>
  )
}
