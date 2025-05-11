import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'
import { BehaviorSystem } from 'dacha'

import { Panel } from '../../../components/panel'
import { Field } from '../../../components/field'
import { LabelledSelect } from '../../../components/select'
import { Widget } from '../../../components/widget'
import { NAMESPACE_EXTENSION } from '../../../../../providers/schemas-provider/consts'
import { useExtension, useConfig, useCommander } from '../../../../../hooks'
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
  const { t, i18n } = useTranslation()
  const { dispatch } = useCommander()

  const { resourcesSchema } = useExtension()

  const behaviorPath = useMemo(() => path.concat(`id:${id}`), [path])
  const namePath = useMemo(() => behaviorPath.concat('name'), [behaviorPath])
  const optionsPath = useMemo(() => behaviorPath.concat('options'), [behaviorPath])

  const behaviorName = useConfig(namePath) as string

  const partSchema = resourcesSchema[BehaviorSystem.systemName]?.[behaviorName]
  const partFields = partSchema?.fields
  const partReferences = partSchema?.references

  const handleSelect = useCallback((newName: unknown) => {
    const nextPartSchema = resourcesSchema[BehaviorSystem.systemName]?.[newName as string]
    if (nextPartSchema !== void 0) {
      dispatch(setValue(optionsPath, nextPartSchema.getInitialState?.() ?? {}, true))
    }
  }, [resourcesSchema, optionsPath])

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
      {partFields && (
        <I18nextProvider i18n={i18n} defaultNS={NAMESPACE_EXTENSION}>
          <Widget path={optionsPath} fields={partFields} references={partReferences} />
        </I18nextProvider>
      )}
    </Panel>
  )
}
