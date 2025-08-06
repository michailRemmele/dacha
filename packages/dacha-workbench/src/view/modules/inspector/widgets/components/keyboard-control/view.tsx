import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { v4 as uuidv4 } from 'uuid'

import type { WidgetProps } from '../../../../../../types/widget-schema'
import { useConfig, useCommander } from '../../../../../hooks'
import { addValue } from '../../../../../commands'

import {
  EventListStyled,
  ButtonCSS,
} from './keyboard-control.style'
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
      id: uuidv4(),
      key: '',
      pressed: true,
      keepEmit: false,
      eventType: '',
      attrs: [],
    }))
  }, [dispatch, bindingsPath])

  return (
    <div>
      <EventListStyled>
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
      </EventListStyled>
      <Button
        css={ButtonCSS}
        size="small"
        onClick={handleAddNewBind}
      >
        {t('components.keyboardControl.bind.addNew.title')}
      </Button>
    </div>
  )
}
