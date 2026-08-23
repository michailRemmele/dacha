import { useContext, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Scissors, Copy, Files, TrashBin } from '@gravity-ui/icons';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';

import { HotkeysSectionContext } from '../../providers';

export const HotkeysBar: FC = () => {
  const { t } = useTranslation();

  const { cut, copy, paste, remove } = useContext(HotkeysSectionContext);

  return (
    <>
      <IconButton
        icon={<Icon icon={<Scissors />} />}
        onClick={cut}
        title={t('explorer.actionBar.cut.button.title')}
      />
      <IconButton
        icon={<Icon icon={<Copy />} />}
        onClick={copy}
        title={t('explorer.actionBar.copy.button.title')}
      />
      <IconButton
        icon={<Icon icon={<Files />} />}
        onClick={paste}
        title={t('explorer.actionBar.paste.button.title')}
      />
      <IconButton
        icon={<Icon icon={<TrashBin />} />}
        onClick={remove}
        title={t('explorer.actionBar.delete.button.title')}
      />
    </>
  );
};
