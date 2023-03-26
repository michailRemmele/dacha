import React, {
  useCallback,
  useMemo,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

import {
  Field,
  DependencyField,
  LabelledTextInput,
  LabelledCheckbox,
  LabelledNumberInput,
} from '../../../../../../../modules/inspector/components'
import { useCommander } from '../../../../../../../hooks'
import { deleteValue } from '../../../../../../../commands'
import { AnimationEditorContext } from '../../../providers'

export const SubstateInspector: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const {
    path,
    selectedState,
    selectedSubstate,
    selectEntity,
    setSubstate,
  } = useContext(AnimationEditorContext)
  const id = selectedSubstate as string

  const statePath = useMemo(
    () => path.concat('states', `id:${selectedState as string}`),
    [path, selectedState],
  )
  const substatePath = useMemo(
    () => statePath.concat('substates', `id:${id}`),
    [statePath, id],
  )

  const namePath = useMemo(() => substatePath.concat('name'), [substatePath])
  const loopedPath = useMemo(() => substatePath.concat('timeline', 'looped'), [substatePath])
  const xPath = useMemo(() => substatePath.concat('x'), [substatePath])
  const yPath = useMemo(() => substatePath.concat('y'), [substatePath])

  const pickModePath = useMemo(() => statePath.concat('pickMode'), [statePath])

  const handleDelete = useCallback(() => {
    selectEntity()
    setSubstate()
    dispatch(deleteValue(substatePath))
  }, [dispatch, selectEntity, setSubstate, substatePath])

  return (
    <form className="animation-inspector__form">
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

      <footer className="animation-inspector__footer">
        <Button
          className="animation-inspector__button"
          size="small"
          onClick={handleDelete}
        >
          {t('components.animatable.editor.substate.delete.button.title')}
        </Button>
      </footer>
    </form>
  )
}
