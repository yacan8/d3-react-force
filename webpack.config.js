const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const isDebug = process.env.NODE_ENV === 'development';
const host = '127.0.0.1';
const port = '9000';

const config = {
  entry: isDebug ? [`webpack-dev-server/client?http://${host}:${port}`, 'webpack/hot/dev-server', './src/index.js'] : ['./src/release'],
  mode: isDebug ? 'development' : 'production',
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port,
    // inline: true,
    // hot: true
  },
  devtool:'eval-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          babelrc: false,
          presets: [
            'es2015-ie',
            'react',
            'stage-2'
          ],
          plugins: [
            'transform-decorators-legacy',
            'transform-class-properties',
            'transform-runtime'
          ]
        },
        include: path.join(__dirname, 'src')
      },
      {test: /\.css$/, loaders: ['style-loader', 'css-loader']},
      {test: /\.less/, loaders: ['style-loader', 'css-loader', 'less-loader']}
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      hash: false,
      title: 'd3-react-force',
      filename: 'index.html',
      inject: 'body'
    })
  ]
}

if (!isDebug) {
  config.output = {
    path: '/Users/can.yang/tdProject/react-ssr-demo/src/main/resources/static/src'
  }
}

module.exports = config;
