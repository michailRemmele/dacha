import { useMemo, useContext, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { FormStyled } from '../inspector.style';
import {
  Field,
  DependencyField,
  LabelledNumberInput,
  fieldValueValidators,
} from '../../../../../../../components';
import { AnimationEditorContext } from '../../../providers';
import { getStatePath } from '../../../utils/paths';

export const SubstateInspector: FC = () => {
  const { t } = useTranslation();
  const { inspectedEntity } = useContext(AnimationEditorContext);
  const substatePath = inspectedEntity?.path as string[];
  const statePath = getStatePath(substatePath) as string[];

  const timelinePath = useMemo(
    () => substatePath.concat('timeline'),
    [substatePath],
  );
  const yPath = useMemo(() => substatePath.concat('y'), [substatePath]);

  const pickModePath = useMemo(() => statePath.concat('pickMode'), [statePath]);

  return (
    <FormStyled>
      <Field name="name" type="string" path={substatePath} />
      <Field name="looped" type="boolean" path={timelinePath} />
      <Field name="x" type="number" path={substatePath} />
      <DependencyField
        path={yPath}
        component={LabelledNumberInput}
        label={t('components.animatable.editor.substate.y.title')}
        dependencyPath={pickModePath}
        dependencyValue="2D"
        initialValue={0}
        validate={fieldValueValidators.number}
      />
    </FormStyled>
  );
};
