import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'

import { Panel } from '../../../components/panel'
import { Field } from '../../../components/field'
import { LabelledSelect } from '../../../components/select'
import { BehaviorWidget } from '../../../components/behavior-widget'
import {
  useConfig,
  useCommander,
  useBehaviors,
} from '../../../../../hooks'
import { setValue, deleteValue } from '../../../../../commands'

import { PanelCSS } from './behavior.style'

interface BehaviorPanelProps {
  id: string
  path: Array<string>
  order: number
  availableBehaviors: { title: string; value: string }[]
}

export const BehaviorPanel: FC<BehaviorPanelProps> = ({
  id,
  path,
  order,
  availableBehaviors,
}) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const behaviors = useBehaviors()

  const behaviorPath = useMemo(() => path.concat(`id:${id}`), [path])
  const namePath = useMemo(() => behaviorPath.concat('name'), [behaviorPath])
  const optionsPath = useMemo(() => behaviorPath.concat('options'), [behaviorPath])

  const behaviorName = useConfig(namePath) as string | undefined

  const handleSelect = useCallback((newName: unknown) => {
    const nextBehavior = behaviors?.[newName as string]
    if (nextBehavior !== void 0) {
      dispatch(setValue(optionsPath, nextBehavior.getInitialState?.() ?? {}, true))
    }
  }, [behaviors, optionsPath])

  const handleDelete = useCallback(() => {
    dispatch(deleteValue(behaviorPath))
  }, [dispatch, behaviorPath])

  return (
    <Panel
      css={PanelCSS}
      title={t('components.behaviors.behavior.title', { index: order + 1 })}
      onDelete={handleDelete}
    >
      <Field
        path={namePath}
        component={LabelledSelect}
        label={t('components.behaviors.behavior.name.title')}
        options={availableBehaviors}
        onAccept={handleSelect}
      />
      {behaviorName ? (
        <BehaviorWidget
          name={behaviorName}
          path={optionsPath}
        />
      ) : null}
    </Panel>
  )
}
