const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const isDebug = process.env.NODE_ENV === 'development';
const host = '127.0.0.1';
const port = '9000';

const config = {
  entry: './src/index',
  mode: isDebug ? 'development' : 'production',
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
            'react-hmre',
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
    // new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      hash: false,
      title: 'd3-react-force',
      filename: 'index.html',
      inject: 'body'
    })
  ]
}


module.exports = config;
