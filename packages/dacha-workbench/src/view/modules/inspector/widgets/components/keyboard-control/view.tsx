import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { uuid } from '../../../../../../utils/uuid'

import type { WidgetProps } from '../../../../../../types/widget-schema'
import { useConfig, useCommander } from '../../../../../hooks'
import { addValue } from '../../../../../commands'

import styles from './keyboard-control.module.css'
import { InputBind } from './input-bind'
import type { InputEventBind } from './types'

export const KeyboardControlWidget: FC<WidgetProps> = ({ path }) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const bindingsPath = useMemo(() => path.concat('inputEventBindings'), [path])
  const inputEventBindings = useConfig(bindingsPath) as InputEventBind[]

  const addedKeys = useMemo(() => inputEventBindings.map((inputBind) => ({
    id: inputBind.id,
    key: inputBind.key,
  })), [inputEventBindings])

  const handleAddNewBind = useCallback(() => {
    dispatch(addValue(bindingsPath, {
      id: uuid(),
      key: '',
      pressed: true,
      keepEmit: false,
      eventType: '',
      attrs: [],
    }))
  }, [dispatch, bindingsPath])

  return (
    <div>
      <ul className={styles.eventList}>
        {addedKeys.map(({ id, key }, index) => (
          <li key={id}>
            <InputBind
              path={path}
              id={id}
              inputKey={key}
              order={index}
            />
          </li>
        ))}
      </ul>
      <Button
        className={styles.button}
        onClick={handleAddNewBind}
      >
        {t('components.keyboardControl.bind.addNew.title')}
      </Button>
    </div>
  )
}
