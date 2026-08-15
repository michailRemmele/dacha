import {
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

import {
  MultiFieldStyled,
  FieldsStyled,
  NoFieldsStyled,
  FieldStyled,
  ButtonCSS,
} from './multi-field.style'

interface MultiFieldProps {
  path: string[]
}

export const MultiField: FC<MultiFieldProps> = ({ path }) => {
  const { t } = useTranslation(NAMESPACE_EDITOR)
  const { dispatch } = useCommander()

  const values = useConfig(path) as MultiFieldEntry[]

  const handleAddField = useCallback(() => {
    dispatch(addValue(path, {
      id: uuidv4(),
      name: '',
      type: 'string',
      value: '',
    }))
  }, [dispatch, path])

  return (
    <MultiFieldStyled>
      {!values.length && (
        <NoFieldsStyled>
          {t('inspector.multifield.noFields.title')}
        </NoFieldsStyled>
      )}
      {Boolean(values.length) && (
        <FieldsStyled>
          {values.map((entry, index) => (
            <FieldStyled key={entry.id}>
              <Entry
                path={path}
                id={entry.id}
                type={entry.type}
                order={index}
              />
            </FieldStyled>
          ))}
        </FieldsStyled>
      )}
      <Button
        css={ButtonCSS}
        size="small"
        onClick={handleAddField}
      >
        {t('inspector.multifield.addNew.value.title')}
      </Button>
    </MultiFieldStyled>
  )
}
