import { theme } from 'antd';

export const customTheme = {
  algorithm: [theme.defaultAlgorithm],
  token: {
    fontSize: 13,
    borderRadius: 6,

    colorPrimary: '#4E7A43',
    colorPrimaryHover: '#5F8F52',
    colorPrimaryActive: '#3E6335',
    colorPrimaryBg: '#E8EFE3',
    colorPrimaryBgHover: '#DEE7D6',
    colorTextLightSolid: '#FFFFFF',

    colorBgBase: '#F3F2EE',
    colorBgContainer: '#FBFAF7',
    colorBgElevated: '#FEFDFB',
    colorBgLayout: '#F3F2EE',

    colorBorder: '#DEDBD3',
    colorBorderSecondary: '#E8E6E1',

    colorText: '#2B2A26',
    colorTextSecondary: '#67655D',
    colorTextTertiary: '#9C9A90',
    colorTextDisabled: '#9C9A90',

    colorError: '#C0473B',
    colorWarning: '#B8862E',
    colorSuccess: '#2E8B6F',
    colorInfo: '#3E71A8',

    controlOutline: 'rgba(78, 122, 67, 0.22)',
  },
  components: {
    Tree: {
      nodeSelectedBg: '#E8EFE3',
      nodeHoverBg: '#EBE9E4',
    },
    Menu: {
      itemSelectedBg: '#E8EFE3',
      itemSelectedColor: '#4E7A43',
      itemHoverBg: '#EBE9E4',
    },
    Tabs: {
      itemSelectedColor: '#4E7A43',
      itemHoverColor: '#2B2A26',
      inkBarColor: '#4E7A43',
    },
    Input: {
      hoverBorderColor: '#C7C4BA',
      activeBorderColor: '#4E7A43',
    },
    InputNumber: {
      hoverBorderColor: '#C7C4BA',
      activeBorderColor: '#4E7A43',
    },
    Select: {
      optionSelectedBg: '#E8EFE3',
      optionActiveBg: '#EBE9E4',
    },
    Tooltip: {
      colorBgSpotlight: '#2B2A26',
      colorTextLightSolid: '#FBFAF7',
    },
    Modal: {
      headerBg: '#FEFDFB',
      contentBg: '#FEFDFB',
    },
  },
};
