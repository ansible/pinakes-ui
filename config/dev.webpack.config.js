/* global require, module */

const _ = require('lodash');
const path = require('path');
const webpackConfig = require('./base.webpack.config');

webpackConfig.devServer = {
  contentBase: path.join(__dirname, '../dist'),
  port: 8002,
  https: true,
  historyApiFallback: true,
  hot: false,
  inline: false,
  disableHostCheck: true
};

module.exports = _.merge({},
  webpackConfig,
  require('./dev.webpack.plugins.js')
);
