import { useMemo, useCallback, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Field } from '../field';
import { LabelledSelect } from '../select';
import { Section } from '../section';
import { useCommander } from '../../../../hooks';
import { deleteValue, setValue } from '../../../../commands';
import { NAMESPACE_EDITOR } from '../../../../providers/schemas-provider/consts';

import type { MultiFieldEntryType } from './types';

const TYPES = [
  {
    title: 'string',
    value: 'string',
  },
  {
    title: 'number',
    value: 'number',
  },
  {
    title: 'boolean',
    value: 'boolean',
  },
  {
    title: 'array',
    value: 'array',
  },
];

const FIELD_TYPE_MAP = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  array: 'multitext',
} as const;

const TYPES_INITIAL_VALUES_MAP = {
  string: '',
  number: 0,
  boolean: false,
  array: [],
};

interface MultiFieldEntryProps {
  path: string[];
  order: number;
  id: string;
  type: MultiFieldEntryType;
}

export const Entry: FC<MultiFieldEntryProps> = ({ path, id, order, type }) => {
  const { t } = useTranslation(NAMESPACE_EDITOR);
  const { dispatch } = useCommander();

  const entryPath = useMemo(() => path.concat(`id:${id}`), [path]);
  const valuePath = useMemo(() => entryPath.concat('value'), [entryPath]);

  const handleDeleteField = useCallback(() => {
    dispatch(deleteValue(entryPath));
  }, [dispatch, entryPath]);

  const handleTypeChange = useCallback(
    (newType: unknown) => {
      dispatch(
        setValue(
          valuePath,
          TYPES_INITIAL_VALUES_MAP[newType as MultiFieldEntryType],
          true,
        ),
      );
    },
    [dispatch, valuePath],
  );

  return (
    <Section
      title={t('inspector.multifield.field.title', { index: order + 1 })}
      onDelete={handleDeleteField}
    >
      <Field name="name" type="string" path={entryPath} />
      <Field
        name="type"
        component={LabelledSelect}
        options={TYPES}
        onAccept={handleTypeChange}
        path={entryPath}
      />
      <Field
        // Reset component on type change to prevent issues with value mismatch
        key={type}
        name="value"
        type={FIELD_TYPE_MAP[type]}
        path={entryPath}
      />
    </Section>
  );
};
