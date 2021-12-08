const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { DefinePlugin } = require('webpack');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../')
});

plugins.push(
  new DefinePlugin({
    DEPLOYMENT_MODE: JSON.stringify('')
  })
);

module.exports = {
  ...webpackConfig,
  plugins
};
