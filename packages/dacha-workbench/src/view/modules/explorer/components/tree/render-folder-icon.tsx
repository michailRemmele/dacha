import { Folder, FolderOpen } from '@gravity-ui/icons';

import { Icon } from '../../../../components';

export const renderFolderIcon = ({
  expanded,
}: {
  expanded?: boolean;
}): JSX.Element => <Icon icon={expanded ? <FolderOpen /> : <Folder />} />;
