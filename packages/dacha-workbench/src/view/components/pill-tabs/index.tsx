import type { ReactElement } from 'react';
import { Tabs as AntdTabs } from 'antd';
import type { TabsProps } from 'antd';

import * as styles from './tabs.module.css';

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
    padding: '4px',
  },
  item: {
    margin: 0,
    borderRadius: 'var(--ant-border-radius)',
    border: 'none',
    padding: '0 8px',
  },
};

export const PillTabs = ({
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
