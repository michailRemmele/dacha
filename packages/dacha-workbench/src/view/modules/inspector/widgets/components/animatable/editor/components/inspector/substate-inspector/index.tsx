import {
  useMemo,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'

import { FormStyled } from '../inspector.style'
import {
  Field,
  DependencyField,
  LabelledTextInput,
  LabelledCheckbox,
  LabelledNumberInput,
} from '../../../../../../../components'
import { AnimationEditorContext } from '../../../providers'
import { getStatePath } from '../../../utils/paths'

export const SubstateInspector: FC = () => {
  const { t } = useTranslation()
  const { inspectedEntity } = useContext(AnimationEditorContext)
  const substatePath = inspectedEntity?.path as string[]
  const statePath = getStatePath(substatePath) as string[]

  const namePath = useMemo(() => substatePath.concat('name'), [substatePath])
  const loopedPath = useMemo(() => substatePath.concat('timeline', 'looped'), [substatePath])
  const xPath = useMemo(() => substatePath.concat('x'), [substatePath])
  const yPath = useMemo(() => substatePath.concat('y'), [substatePath])

  const pickModePath = useMemo(() => statePath.concat('pickMode'), [statePath])

  return (
    <FormStyled>
      <Field
        path={namePath}
        component={LabelledTextInput}
        label={t('components.animatable.editor.state.name.title')}
      />
      <Field
        path={loopedPath}
        component={LabelledCheckbox}
        label={t('components.animatable.editor.state.looped.title')}
      />
      <Field
        path={xPath}
        component={LabelledNumberInput}
        label={t('components.animatable.editor.substate.x.title')}
      />
      <DependencyField
        path={yPath}
        component={LabelledNumberInput}
        label={t('components.animatable.editor.substate.y.title')}
        dependencyPath={pickModePath}
        dependencyValue="2D"
      />
    </FormStyled>
  )
}
