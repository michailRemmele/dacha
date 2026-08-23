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

    colorBgBase: '#121311',
    colorBgContainer: '#262824',
    colorBgElevated: '#33352E',
    colorBgLayout: '#121311',

    colorBorder: '#4D4F45',
    colorBorderSecondary: '#41433C',

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
      borderRadius: 0,
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
      colorBgContainer: '#121311',
      hoverBorderColor: '#4E4F47',
      activeBorderColor: '#72A85A',
    },
    InputNumber: {
      colorBgContainer: '#121311',
      hoverBorderColor: '#4E4F47',
      activeBorderColor: '#72A85A',
    },
    Select: {
      colorBgContainer: '#121311',
      optionSelectedBg: '#2A3B29',
      optionActiveBg: '#282924',
    },
    Checkbox: {
      colorBgContainer: '#121311',
    },
    Slider: {
      railBg: '#121311',
      railHoverBg: '#121311',
      trackBg: '#72A85A',
      trackHoverBg: '#85BC6D',
      handleColor: '#72A85A',
      handleActiveColor: '#85BC6D',
      dotActiveBorderColor: '#72A85A',
    },
    Radio: {
      colorBgContainer: '#121311',
    },
    ColorPicker: {
      colorBgElevated: '#121311',
    },
    Tooltip: {
      colorBgSpotlight: '#34352F',
      colorTextLightSolid: '#E7E5DE',
    },
    Modal: {
      headerBg: '#33352E',
      contentBg: '#33352E',
    },
  },
};
