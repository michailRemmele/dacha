import { useMemo, useCallback, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Field } from '../../../components/field';
import { Section } from '../../../components/section';
import { useCommander } from '../../../../../hooks';
import { deleteValue } from '../../../../../commands';

import { PATH } from './consts';

export interface AudioGroupProps {
  id: string;
}

export const AudioGroup: FC<AudioGroupProps> = ({ id }) => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();

  const groupPath = useMemo(() => PATH.concat(`id:${id}`), [PATH]);

  const handleDeleteBind = useCallback(() => {
    dispatch(deleteValue(groupPath));
  }, [dispatch, groupPath]);

  return (
    <Section
      title={t('globalOptions.audioGroups.panel.name.title')}
      onDelete={handleDeleteBind}
    >
      <Field name="name" type="string" path={groupPath} />
      <Field
        name="volume"
        type="range"
        min={0}
        max={1}
        step={0.01}
        path={groupPath}
      />
    </Section>
  );
};
