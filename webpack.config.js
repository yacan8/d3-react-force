const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDebug = process.env.NODE_ENV === 'development';

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
            'react',
            'stage-2'
          ],
          plugins: [
            'transform-class-properties',
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


if (isDebug) {
  config.module.rules[0].query.presets.unshift('react-hmre')
}

module.exports = config;
