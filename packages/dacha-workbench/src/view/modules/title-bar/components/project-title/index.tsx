import { FC } from 'react';
import { Typography } from 'antd';

import { cx } from '../../../../../utils/cx';

import * as styles from './project-title.module.css';

interface ProjectTitleProps {
  projectName: string;
  unsavedChanges: boolean;
}

export const ProjectTitle: FC<ProjectTitleProps> = ({
  projectName,
  unsavedChanges,
}) => (
  <div className={styles.projectTitle}>
    <span className={cx(styles.nameWrapper, unsavedChanges && styles.unsaved)}>
      <Typography.Text
        className={styles.name}
        ellipsis={{ tooltip: projectName }}
      >
        {projectName}
      </Typography.Text>
    </span>
  </div>
);
