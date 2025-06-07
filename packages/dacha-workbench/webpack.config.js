const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: 'none',

  entry: {
    app: path.resolve(__dirname, 'src/app.tsx'),
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    i18next: 'i18next',
    'react-i18next': 'ReactI18next',
    dayjs: 'dayjs',
    antd: 'antd',
    '@emotion/react': 'emotionReact',
    '@emotion/styled': 'emotionStyled',
  },

  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },

  devtool: isDev ? 'eval' : false,

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    isDev ? null : new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'public/index.html'),
      chunks: ['app'],
    }),
    isDev ? null : new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'public'),
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ].filter(Boolean),

  module: {
    rules: [
      {
        test: /\.(j|t)s(x?)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'ts-loader',
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
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
}
