import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { BehaviorSystem } from 'dacha'

import type { WidgetProps } from '../../../../../../types/widget-schema'
import { useConfig, useCommander, useExtension } from '../../../../../hooks'
import { addValue } from '../../../../../commands'

import { BehaviorListStyled, ButtonCSS } from './behavior.style'
import { BehaviorPanel } from './behavior-panel'
import type { BehaviorEntry } from './types'

export const BehaviorsWidget: FC<WidgetProps> = ({ path }) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { resourcesSchema } = useExtension()

  const behaviorsPath = useMemo(() => path.concat('list'), [path])

  const selectedBehaviors = useConfig(behaviorsPath) as BehaviorEntry[]

  const availableBehaviors = useMemo(() => {
    const behaviorNames = Object.keys(resourcesSchema[BehaviorSystem.systemName] || {})
    return behaviorNames.map((key) => ({
      title: key,
      value: key,
    }))
  }, [])

  const handleAddBehavior = useCallback(() => {
    dispatch(addValue(behaviorsPath, {
      id: uuidv4(),
      name: '',
      options: {},
    }))
  }, [dispatch, behaviorsPath])

  return (
    <div>
      <BehaviorListStyled>
        {selectedBehaviors.map(({ id }, index) => (
          <li key={id}>
            <BehaviorPanel
              id={id}
              path={behaviorsPath}
              order={index}
              availableBehaviors={availableBehaviors}
            />
          </li>
        ))}
      </BehaviorListStyled>
      <Button
        css={ButtonCSS}
        size="small"
        onClick={handleAddBehavior}
        disabled={availableBehaviors.length === 0}
      >
        {t('components.behaviors.behavior.addNew.title')}
      </Button>
    </div>
  )
}
