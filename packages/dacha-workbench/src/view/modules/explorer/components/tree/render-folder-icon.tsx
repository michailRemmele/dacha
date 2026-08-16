import type { ReactElement } from 'react';
import { Folder, FolderOpen } from '@gravity-ui/icons';

import { Icon } from '../../../../components';

export const renderFolderIcon = ({
  expanded,
}: {
  expanded?: boolean;
}): ReactElement => <Icon icon={expanded ? <FolderOpen /> : <Folder />} />;
