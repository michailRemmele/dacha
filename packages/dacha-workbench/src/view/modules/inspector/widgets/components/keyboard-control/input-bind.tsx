import { useMemo, useCallback, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { LabelledTextInput } from '../../../components/text-input';
import { LabelledSelect } from '../../../components/select';
import { MultiField } from '../../../components/multi-field';
import { Field } from '../../../components/field';
import { Section } from '../../../components/section';
import { useCommander, useExtension } from '../../../../../hooks';
import { deleteValue, setValue } from '../../../../../commands';

import { KeyPicker } from './key-picker';
import styles from './keyboard-control.module.css';

const KEEP_EMIT_DEPENDENCY_VALUE = true;

export interface InputBindProps {
  path: string[];
  id: string;
  inputKey: string;
  order: number;
}

export const InputBind: FC<InputBindProps> = ({
  path,
  id,
  inputKey,
  order,
}) => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();
  const { events } = useExtension();

  const bindPath = useMemo(
    () => path.concat('inputEventBindings', `id:${id}`),
    [path],
  );
  const keyPath = useMemo(() => bindPath.concat('key'), [bindPath]);
  const attrsPath = useMemo(() => bindPath.concat('attrs'), [bindPath]);

  const handleKeyChange = useCallback(
    (value: string) => {
      dispatch(setValue(keyPath, value));
    },
    [keyPath, keyPath],
  );

  const handleDeleteBind = useCallback(() => {
    dispatch(deleteValue(bindPath));
  }, [dispatch, bindPath]);

  return (
    <Section
      title={t('components.keyboardControl.bind.title', { index: order + 1 })}
      onDelete={handleDeleteBind}
    >
      <KeyPicker value={inputKey} onChange={handleKeyChange} />
      <Field name="pressed" type="boolean" path={bindPath} />
      <Field
        name="keepEmit"
        type="boolean"
        dependency={{ name: 'pressed', value: KEEP_EMIT_DEPENDENCY_VALUE }}
        path={bindPath}
      />
      <Field
        name="eventType"
        component={events ? LabelledSelect : LabelledTextInput}
        options={events}
        path={bindPath}
      />
      <span className={styles.sectionHeader}>
        {t('components.keyboardControl.bind.attributes.title')}
      </span>
      <MultiField path={attrsPath} />
    </Section>
  );
};
