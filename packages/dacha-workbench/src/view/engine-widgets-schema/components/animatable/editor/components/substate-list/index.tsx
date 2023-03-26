import React, {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import type { Animation } from 'remiz'

import { cn } from '../../../../../../utils/cn'
import { useConfig, useCommander } from '../../../../../../hooks'
import { addValue } from '../../../../../../commands'
import { AnimationEditorContext } from '../../providers'

import './style.less'

interface SubstateListProps {
  className?: string
  onSelect?: (id: string) => void
}

export const SubstateList: FC<SubstateListProps> = ({
  className = '',
  onSelect = (): void => void 0,
}) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const {
    path,
    selectedEntity,
    selectedSubstate,
    selectedState,
  } = useContext(AnimationEditorContext)

  const substatesPath = useMemo(
    () => path.concat('states', `id:${selectedState as string}`, 'substates'),
    [path, selectedState],
  )

  const substates = useConfig(substatesPath) as Array<Animation.SubstateConfig>

  const handleAdd = useCallback(() => {
    dispatch(addValue(substatesPath, {
      id: uuidv4(),
      name: t('components.animatable.editor.substate.new.title', { index: substates.length }),
      timeline: {
        frames: [],
        looped: false,
      },
      x: 0,
      y: 0,
    }))
  }, [dispatch, substatesPath, substates])

  const handleSelect = useCallback((id: string) => {
    onSelect(id)
  }, [onSelect])

  const renderSubstate = useCallback(({
    id, name, x, y,
  }: Animation.SubstateConfig) => {
    const isSelected = id === selectedSubstate
    const isInspected = id === selectedEntity?.id
    return (
      <li
        className="substate-list__item"
        key={id}
      >
        <button
          className={cn(
            'substate-list__substate',
            isSelected && 'substate-list__substate_selected',
            isInspected && 'substate-list__substate_inspected',
          )}
          type="button"
          onClick={(): void => handleSelect(id)}
        >
          {`${name} (x: ${x}, y: ${y})`}
        </button>
      </li>
    )
  }, [selectedSubstate, handleSelect, selectedEntity])

  return (
    <ul className={`substate-list ${className}`}>
      {substates.map(renderSubstate)}
      <li className="substate-list__item" key="add-substate">
        <button
          className="substate-list__substate substate-list__substate_add"
          type="button"
          onClick={handleAdd}
        >
          Add New Substate
        </button>
      </li>
    </ul>
  )
}
