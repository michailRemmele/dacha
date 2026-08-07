import { useCallback, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import type { WidgetProps } from '../../../../../../types/widget-schema';
import { useConfig, useCommander } from '../../../../../hooks';
import { addValue } from '../../../../../commands';
import { getUniqueName } from '../../../../../../utils/get-unique-name';
import type { AudioGroup } from '../../types/audio-system';

import { GroupsStyled, ButtonCSS } from './audio-groups.style';
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
        id: uuidv4(),
        name: getUniqueName('bus', groups),
        volume: 1,
      }),
    );
  }, [dispatch, groups]);

  return (
    <>
      <GroupsStyled>
        {groups?.map(({ id }) => (
          <AudioGroupPanel key={id} id={id} />
        ))}
      </GroupsStyled>
      <Button css={ButtonCSS} size="small" onClick={handleAddNewGroup}>
        {t('globalOptions.audioGroups.addNew.title')}
      </Button>
    </>
  );
};
