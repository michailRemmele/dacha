import {
  useEffect,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_FIXED_UPDATE_RATE } from 'dacha'

import { LabelledNumberInput } from '../../../components'
import { Field } from '../../../components/field'
import { useConfig, useCommander } from '../../../../../hooks'
import { addValue } from '../../../../../commands'
import { CollapsePanel } from '../../../components/collapse-panel'

import { PATH } from './consts'

interface Performance {
  maxFPS: number
  fixedUpdateRate: number
}

export const PerformanceWidget: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const performanceOptions = useConfig(PATH) as Performance | undefined

  const maxFPSPath = useMemo(() => PATH.concat('maxFPS'), [])
  const fixedUpdateRatePath = useMemo(() => PATH.concat('fixedUpdateRate'), [])

  useEffect(() => {
    if (performanceOptions) {
      return
    }

    dispatch(addValue(['globalOptions'], {
      name: 'performance',
      options: {
        maxFPS: 0,
        fixedUpdateRate: DEFAULT_FIXED_UPDATE_RATE,
      },
    }))
  }, [performanceOptions])

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
    </CollapsePanel>
  )
}
