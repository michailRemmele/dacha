import { theme } from 'antd';

export const customTheme = {
  algorithm: [theme.darkAlgorithm],
  token: {
    fontSize: 13,
    borderRadius: 6,

    colorPrimary: '#72A85A',
    colorPrimaryHover: '#85BC6D',
    colorPrimaryActive: '#5C8E47',
    colorPrimaryBg: '#263526',
    colorPrimaryBgHover: '#2E402D',
    colorTextLightSolid: '#182015',

    colorBgBase: '#1B1C19',
    colorBgContainer: '#222320',
    colorBgElevated: '#2A2B26',
    colorBgLayout: '#1B1C19',

    colorBorder: '#3A3B34',
    colorBorderSecondary: '#2F302B',

    colorText: '#E7E5DE',
    colorTextSecondary: '#A6A49B',
    colorTextTertiary: '#6D6B63',
    colorTextDisabled: '#6D6B63',

    colorError: '#D9776A',
    colorWarning: '#D6A75B',
    colorSuccess: '#4FAE8C',
    colorInfo: '#7CACDE',

    controlOutline: 'rgba(114, 168, 90, 0.35)',
  },
  components: {
    Tree: {
      nodeSelectedBg: '#2A3B29',
      nodeHoverBg: '#282924',
    },
    Menu: {
      itemSelectedBg: '#2A3B29',
      itemSelectedColor: '#72A85A',
      itemHoverBg: '#282924',
    },
    Tabs: {
      itemSelectedColor: '#72A85A',
      itemHoverColor: '#E7E5DE',
      inkBarColor: '#72A85A',
    },
    Input: {
      hoverBorderColor: '#4E4F47',
      activeBorderColor: '#72A85A',
    },
    InputNumber: {
      hoverBorderColor: '#4E4F47',
      activeBorderColor: '#72A85A',
    },
    Select: {
      optionSelectedBg: '#2A3B29',
      optionActiveBg: '#282924',
    },
    Tooltip: {
      colorBgSpotlight: '#34352F',
      colorTextLightSolid: '#E7E5DE',
    },
    Modal: {
      headerBg: '#2A2B26',
      contentBg: '#2A2B26',
    },
  },
};
