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

    colorBgBase: '#E2E1DD',
    colorBgContainer: '#FBFAF7',
    colorBgElevated: '#FEFDFB',
    colorBgLayout: '#E2E1DD',

    colorBorder: '#CCCAC2',
    colorBorderSecondary: '#DAD7CF',

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
      directoryNodeSelectedBg: '#DEE7D6',
      directoryNodeSelectedColor: '#2B2A26',
      borderRadius: 0,
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
      colorBgContainer: '#FFFFFF',
      colorBorder: '#C7C4BA',
      hoverBorderColor: '#B6B2A6',
      activeBorderColor: '#4E7A43',
    },
    InputNumber: {
      colorBgContainer: '#FFFFFF',
      colorBorder: '#C7C4BA',
      hoverBorderColor: '#B6B2A6',
      activeBorderColor: '#4E7A43',
    },
    Select: {
      colorBgContainer: '#FFFFFF',
      colorBorder: '#C7C4BA',
      optionSelectedBg: '#E8EFE3',
      optionActiveBg: '#EBE9E4',
    },
    Checkbox: {
      colorBgContainer: '#FFFFFF',
      colorBorder: '#C7C4BA',
    },
    Slider: {
      railBg: '#DAD7CF',
      railHoverBg: '#CCCAC2',
      trackBg: '#4E7A43',
      trackHoverBg: '#5F8F52',
      handleColor: '#4E7A43',
      handleActiveColor: '#5F8F52',
      dotActiveBorderColor: '#4E7A43',
    },
    Radio: {
      colorBgContainer: '#FFFFFF',
      colorBorder: '#C7C4BA',
    },
    ColorPicker: {
      colorBgContainer: '#FFFFFF',
      colorBorder: '#C7C4BA',
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
