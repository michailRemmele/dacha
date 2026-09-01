import { useCallback, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { uuid } from '../../../../../../utils/uuid';

import type { WidgetProps } from '../../../../../../types/widget-schema';
import { useConfig, useCommander } from '../../../../../hooks';
import { addValue } from '../../../../../commands';
import { getUniqueName } from '../../../../../../utils/get-unique-name';
import type { AudioGroup } from '../../types/audio-system';

import * as styles from './audio-groups.module.css';
import { AudioGroup as AudioGroupPanel } from './audio-group';
import { PATH } from './consts';

export const AudioGroupsWidget: FC<WidgetProps> = () => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();

  const groups = useConfig(PATH) as AudioGroup[] | undefined;

  const handleAddNewGroup = useCallback(() => {
    if (!groups) {
      return;
    }

    dispatch(
      addValue<AudioGroup>(PATH, {
        id: uuid(),
        name: getUniqueName('bus', groups),
        volume: 1,
      }),
    );
  }, [dispatch, groups]);

  return (
    <>
      <div className={styles.groups}>
        {groups?.map(({ id }) => (
          <AudioGroupPanel key={id} id={id} />
        ))}
      </div>
      <Button className={styles.button} onClick={handleAddNewGroup}>
        {t('globalOptions.audioGroups.addNew.title')}
      </Button>
    </>
  );
};
