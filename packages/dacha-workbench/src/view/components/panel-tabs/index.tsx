import type { ReactElement } from 'react';
import { Tabs as AntdTabs } from 'antd';
import type { TabsProps } from 'antd';

import styles from './tabs.module.css';

const defaultClassNames: TabsProps['classNames'] = {
  root: styles.tabs,
  header: styles.header,
  item: styles.item,
  content: styles.content,
  body: styles.body,
};

const defaultStyles: TabsProps['styles'] = {
  header: {
    margin: 0,
  },
  item: {
    margin: 0,
    border: 'none',
    padding: '6px 14px',
  },
};

export const PanelTabs = ({
  type = 'card',
  classNames,
  styles: stylesProp,
  ...rest
}: TabsProps): ReactElement => (
  <AntdTabs
    type={type}
    classNames={{ ...defaultClassNames, ...classNames }}
    styles={{ ...defaultStyles, ...stylesProp }}
    {...rest}
  />
);
