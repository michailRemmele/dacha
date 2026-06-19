import { useEffect, useMemo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_FIXED_UPDATE_RATE,
  DEFAULT_MAX_FRAME_DELTA,
  DEFAULT_MAX_FIXED_UPDATES_PER_FRAME,
} from 'dacha';

import { LabelledNumberInput } from '../../../components';
import { Field } from '../../../components/field';
import { useConfig, useCommander } from '../../../../../hooks';
import { addValue } from '../../../../../commands';
import { CollapsePanel } from '../../../components/collapse-panel';

import { PATH } from './consts';

interface Performance {
  maxFPS: number;
  fixedUpdateRate: number;
  maxFrameDelta: number;
  maxFixedUpdatesPerFrame: number;
}

export const PerformanceWidget: FC = () => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();

  const performanceOptions = useConfig(PATH) as Performance | undefined;

  const maxFPSPath = useMemo(() => PATH.concat('maxFPS'), []);
  const fixedUpdateRatePath = useMemo(() => PATH.concat('fixedUpdateRate'), []);
  const maxFrameDeltaPath = useMemo(() => PATH.concat('maxFrameDelta'), []);
  const maxFixedUpdatesPerFramePath = useMemo(() => PATH.concat('maxFixedUpdatesPerFrame'), []);

  useEffect(() => {
    if (performanceOptions) {
      return;
    }

    dispatch(
      addValue(['globalOptions'], {
        name: 'performance',
        options: {
          maxFPS: 0,
          fixedUpdateRate: DEFAULT_FIXED_UPDATE_RATE,
          maxFrameDelta: DEFAULT_MAX_FRAME_DELTA,
          maxFixedUpdatesPerFrame: DEFAULT_MAX_FIXED_UPDATES_PER_FRAME,
        },
      }),
    );
  }, [performanceOptions]);

  return (
    <CollapsePanel
      title={t('globalOptions.performance.title')}
      deletable={false}
    >
      <Field
        path={maxFPSPath}
        component={LabelledNumberInput}
        label={t('globalOptions.performance.maxFPS.title')}
      />
      <Field
        path={fixedUpdateRatePath}
        component={LabelledNumberInput}
        label={t('globalOptions.performance.fixedUpdateRate.title')}
      />
      <Field
        path={maxFrameDeltaPath}
        component={LabelledNumberInput}
        label={t('globalOptions.performance.maxFrameDelta.title')}
      />
      <Field
        path={maxFixedUpdatesPerFramePath}
        component={LabelledNumberInput}
        label={t('globalOptions.performance.maxFixedUpdatesPerFrame.title')}
      />
    </CollapsePanel>
  );
};
