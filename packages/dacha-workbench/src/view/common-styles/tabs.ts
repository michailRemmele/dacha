import type { TabsProps } from 'antd';

import styles from './tabs.module.css';

export const tabsClassNames: TabsProps['classNames'] = {
  root: styles.tabs,
  header: styles.header,
  item: styles.item,
  content: styles.content,
  body: styles.body,
};
