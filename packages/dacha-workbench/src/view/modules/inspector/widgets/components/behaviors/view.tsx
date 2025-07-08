import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'

import type { WidgetProps } from '../../../../../../types/widget-schema'
import { EntityPicker } from '../../../components/entity-picker'
import {
  useConfig,
  useCommander,
  useBehaviors,
} from '../../../../../hooks'
import { addValue } from '../../../../../commands'

import { BehaviorsStyled, EntityPickerCSS } from './behavior.style'
import { BehaviorPanel } from './behavior-panel'
import type { BehaviorEntry } from './types'

export const BehaviorsWidget: FC<WidgetProps> = ({ path }) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const behaviors = useBehaviors()

  const behaviorsPath = useMemo(() => path.concat('list'), [path])

  const selectedBehaviors = useConfig(behaviorsPath) as BehaviorEntry[]

  const availableBehaviors = useMemo(() => {
    const selectedSet = new Set(selectedBehaviors.map((item) => item.name))
    const behaviorNames = Object.keys(behaviors ?? {}).filter((item) => !selectedSet.has(item))

    return behaviorNames.map((key) => ({
      label: key,
      value: key,
    }))
  }, [behaviors, selectedBehaviors])

  const handleAddBehavior = useCallback((name: string) => {
    dispatch(addValue(behaviorsPath, {
      id: uuidv4(),
      name,
      options: behaviors?.[name].getInitialState?.() ?? {},
    }))
  }, [dispatch, behaviorsPath, behaviors])

  const handleCreate = useCallback((name: string, filepath: string) => {
    window.electron.createBehavior(name, filepath)
  }, [])

  return (
    <BehaviorsStyled>
      <div>
        {selectedBehaviors.map(({ id, name }) => (
          <BehaviorPanel
            key={id}
            id={id}
            path={behaviorsPath}
            schema={behaviors?.[name]}
          />
        ))}
      </div>

      <EntityPicker
        css={EntityPickerCSS}
        size="small"
        placeholder={t('components.behaviors.behavior.addNew.title')}
        options={availableBehaviors}
        type="behavior"
        onAdd={handleAddBehavior}
        onCreate={handleCreate}
      />
    </BehaviorsStyled>
  )
}
