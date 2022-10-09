const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { getThemeVariables } = require('antd/dist/theme')

module.exports = ({ componentsPath, systemsPath }) => ({
  mode: 'none',

  entry: {
    app: path.resolve(__dirname, 'src/app.tsx'),
  },

  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },

  devtool: 'eval',

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      'project-components': componentsPath
        ? path.resolve(componentsPath)
        : path.resolve(__dirname, 'src/alias-stubs/project-components'),
      'project-systems': systemsPath
        ? path.resolve(systemsPath)
        : path.resolve(__dirname, 'src/alias-stubs/project-systems'),
    },
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
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'public/index.html'),
    }),
  ],

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules[\\/](?!remiz-editor)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-typescript',
                '@babel/preset-react',
              ],
            },
          },
        ],
      },
      {
        test: /\.less$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: getThemeVariables({
                  compact: true,
                }),
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
})
