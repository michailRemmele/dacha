import { useMemo, useCallback, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { LabelledSelect } from '../../../components/select';
import { LabelledTextInput } from '../../../components/text-input';
import { MultiField } from '../../../components/multi-field';
import { Field } from '../../../components/field';
import { Section } from '../../../components/section';
import { useCommander, useExtension } from '../../../../../hooks';
import { deleteValue } from '../../../../../commands';

import * as styles from './mouse-control.module.css';

export interface InputBindProps {
  path: string[];
  id: string;
  value: string;
  eventType: string;
  order: number;
  options: { title: string; value: string }[];
  selectedOptions: string[];
}

export const InputBind: FC<InputBindProps> = ({
  path,
  id,
  value,
  eventType,
  order,
  options,
  selectedOptions,
}) => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();
  const { events } = useExtension();

  const bindPath = useMemo(
    () => path.concat('inputEventBindings', `event:${value}`),
    [path, value],
  );

  const title =
    value || eventType
      ? `${value || '—'} → ${eventType || '—'}`
      : t('components.mouseControl.bind.title', { index: order + 1 });
  const attrsPath = useMemo(() => bindPath.concat('attrs'), [bindPath]);

  const inputEvents = useMemo(
    () =>
      options.filter(
        (option) =>
          !selectedOptions.includes(option.value) || option.value === value,
      ),
    [value, options, selectedOptions],
  );

  const handleDeleteBind = useCallback(() => {
    dispatch(deleteValue(bindPath));
  }, [dispatch, bindPath]);

  return (
    <Section id={id} title={title} onDelete={handleDeleteBind}>
      <Field
        name="event"
        component={LabelledSelect}
        options={inputEvents}
        path={bindPath}
      />
      <Field
        name="button"
        type="number"
        dependency={{ name: 'event', value: 'mousedown|mouseup' }}
        initialValue={0}
        path={bindPath}
      />
      <Field
        name="eventType"
        component={events ? LabelledSelect : LabelledTextInput}
        options={events}
        path={bindPath}
      />
      <span className={styles.sectionHeader}>
        {t('components.mouseControl.bind.attributes.title')}
      </span>
      <MultiField path={attrsPath} />
    </Section>
  );
};
