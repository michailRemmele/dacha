import { useMemo, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { LabelledNumberInput } from '../../../components';
import { Field } from '../../../components/field';
import { CollapsePanel } from '../../../components/collapse-panel';
import { fieldValueValidators } from '../../../components/widget/field-value-validators';

import { PATH } from './consts';

export const PerformanceWidget: FC = () => {
  const { t } = useTranslation();

  const maxFPSPath = useMemo(() => PATH.concat('maxFPS'), []);
  const fixedUpdateRatePath = useMemo(() => PATH.concat('fixedUpdateRate'), []);
  const maxFrameDeltaPath = useMemo(() => PATH.concat('maxFrameDelta'), []);
  const maxFixedUpdatesPerFramePath = useMemo(() => PATH.concat('maxFixedUpdatesPerFrame'), []);

  return (
    <CollapsePanel
      title={t('globalOptions.performance.title')}
      deletable={false}
    >
      <Field
        path={maxFPSPath}
        component={LabelledNumberInput}
        label={t('globalOptions.performance.maxFPS.title')}
        isValueValid={fieldValueValidators.number}
      />
      <Field
        path={fixedUpdateRatePath}
        component={LabelledNumberInput}
        label={t('globalOptions.performance.fixedUpdateRate.title')}
        isValueValid={fieldValueValidators.number}
      />
      <Field
        path={maxFrameDeltaPath}
        component={LabelledNumberInput}
        label={t('globalOptions.performance.maxFrameDelta.title')}
        isValueValid={fieldValueValidators.number}
      />
      <Field
        path={maxFixedUpdatesPerFramePath}
        component={LabelledNumberInput}
        label={t('globalOptions.performance.maxFixedUpdatesPerFrame.title')}
        isValueValid={fieldValueValidators.number}
      />
    </CollapsePanel>
  );
};
