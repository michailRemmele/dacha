import { useContext, useMemo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from 'antd';
import { FilePlus } from '@gravity-ui/icons';

import {
  ActionBarStyled,
  ButtonCSS,
  AdditionalSectionStyled,
} from '../../explorer.style';
import { useCommander } from '../../../../hooks';
import { SchemasContext } from '../../../../providers';
import { addAsset } from '../../../../commands/assets';
import { formatWidgetName } from '../../../../../utils/format-widget-name';
import { HotkeysBar, Icon } from '../../../../components';

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
    <ActionBarStyled>
      <Dropdown menu={{ items }} trigger={['click']}>
        <Button
          css={ButtonCSS}
          icon={<Icon icon={<FilePlus />} />}
          size="small"
          title={t('explorer.assets.actionBar.addAsset.button.title')}
        />
      </Dropdown>

      <AdditionalSectionStyled>
        <HotkeysBar />
      </AdditionalSectionStyled>
    </ActionBarStyled>
  );
};
