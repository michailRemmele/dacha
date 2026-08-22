import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { uuid } from '../../../../../../utils/uuid'

import type { WidgetProps } from '../../../../../../types/widget-schema'
import { EntityMultiselect } from '../../../components/entity-picker'
import {
  useConfig,
  useCommander,
  useBehaviors,
} from '../../../../../hooks'
import { addValue } from '../../../../../commands'
import { buildInitialState } from '../../../../../../schema'

import styles from './behavior.module.css'
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
      id: uuid(),
      name,
      options: buildInitialState(behaviors?.[name].fields ?? []),
    }))
  }, [dispatch, behaviorsPath, behaviors])

  const handleCreate = useCallback((name: string, filepath: string) => {
    window.electron.createBehavior(name, filepath)
  }, [])

  return (
    <div className={styles.behaviors}>
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

      <EntityMultiselect
        className={styles.entityPicker}
        size="small"
        placeholder={t('components.behaviors.behavior.addNew.title')}
        options={availableBehaviors}
        type="behavior"
        onAdd={handleAddBehavior}
        onCreate={handleCreate}
      />
    </div>
  )
}
