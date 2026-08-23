import { useContext, useMemo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'antd';
import { FilePlus } from '@gravity-ui/icons';

import styles from '../../explorer.module.css';
import { useCommander } from '../../../../hooks';
import { SchemasContext } from '../../../../providers';
import { addAsset } from '../../../../commands/assets';
import { formatWidgetName } from '../../../../../utils/format-widget-name';
import { HotkeysBar, Icon, IconButton } from '../../../../components';

import { getAssetIcon } from './utils';

export const ActionBar: FC = () => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();
  const { assets } = useContext(SchemasContext);

  const items = useMemo(
    () =>
      assets.map((entry) => ({
        key: entry.name,
        label: formatWidgetName(entry.name),
        onClick: (): void => dispatch(addAsset(entry.name, entry.schema)),
        icon: getAssetIcon(entry.name),
      })),
    [assets, dispatch],
  );

  return (
    <header className={styles.actionBar}>
      <Dropdown menu={{ items }} trigger={['click']}>
        <IconButton
          className={styles.button}
          icon={<Icon icon={<FilePlus />} />}
          title={t('explorer.assets.actionBar.addAsset.button.title')}
        />
      </Dropdown>

      <div className={styles.actionDivider} />

      <HotkeysBar />
    </header>
  );
};
