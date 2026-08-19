const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: 'none',

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    i18next: 'i18next',
    'react-i18next': 'ReactI18next',
    dayjs: 'dayjs',
    antd: 'antd',
  },

  devtool: isDev ? 'eval' : false,

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.(j|t)s(x?)$/,
        exclude: [/node_modules/, /[\\/]packages[\\/][^\\/]+[\\/]build[\\/]/],
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: require.resolve('style-loader'),
          },
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: {
                auto: /\.module\.css$/,
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
        ],
      },
    ],
  },
};
