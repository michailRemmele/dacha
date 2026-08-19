import {
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { uuid } from '../../../../../utils/uuid'

import { useConfig, useCommander } from '../../../../hooks'
import { addValue } from '../../../../commands'
import { NAMESPACE_EDITOR } from '../../../../providers/schemas-provider/consts'

import { Entry } from './entry'
import type { MultiFieldEntry } from './types'

import styles from './multi-field.module.css'

interface MultiFieldProps {
  path: string[]
}

export const MultiField: FC<MultiFieldProps> = ({ path }) => {
  const { t } = useTranslation(NAMESPACE_EDITOR)
  const { dispatch } = useCommander()

  const values = useConfig(path) as MultiFieldEntry[]

  const handleAddField = useCallback(() => {
    dispatch(addValue(path, {
      id: uuid(),
      name: '',
      type: 'string',
      value: '',
    }))
  }, [dispatch, path])

  return (
    <div className={styles.multiField}>
      {!values.length && (
        <div className={styles.noFields}>
          {t('inspector.multifield.noFields.title')}
        </div>
      )}
      {Boolean(values.length) && (
        <ul className={styles.fields}>
          {values.map((entry, index) => (
            <li className={styles.field} key={entry.id}>
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
        className={styles.button}
        onClick={handleAddField}
      >
        {t('inspector.multifield.addNew.value.title')}
      </Button>
    </div>
  )
}
