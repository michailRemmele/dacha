import React, {
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { v4 as uuidv4 } from 'uuid'

import { useConfig, useCommander } from '../../../../hooks'
import { addValue } from '../../../../commands'
import { NAMESPACE_EDITOR } from '../../../../providers/schemas-provider/consts'

import { Entry } from './entry'
import type { MultiFieldEntry } from './types'

import './style.less'

interface MultiFieldProps {
  path: Array<string>
}

export const MultiField: FC<MultiFieldProps> = ({ path }) => {
  const { t } = useTranslation(NAMESPACE_EDITOR)
  const { dispatch } = useCommander()

  const values = useConfig(path) as Array<MultiFieldEntry>

  const handleAddField = useCallback(() => {
    dispatch(addValue(path, {
      id: uuidv4(),
      name: '',
      type: 'string',
      value: '',
    }))
  }, [dispatch, path])

  return (
    <div className="multifield">
      {!values.length && (
        <div className="multifield__no-fields">
          {t('inspector.multifield.noFields.title')}
        </div>
      )}
      {Boolean(values.length) && (
        <ul className="multifield__fields">
          {values.map((entry, index) => (
            <li key={entry.id} className="multifield__field">
              <Entry
                path={path}
                id={entry.id}
                type={entry.type}
                order={index}
              />
            </li>
          ))}
        </ul>
      )}
      <Button
        className="multifield__button"
        size="small"
        onClick={handleAddField}
      >
        {t('inspector.multifield.addNew.value.title')}
      </Button>
    </div>
  )
}
