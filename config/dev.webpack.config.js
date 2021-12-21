const { resolve } = require('path');
const { DefinePlugin } = require('webpack');

const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  https: true,
  hot: false,
  useFileHash: false,
  useProxy: true,
  ...(process.env.BETA && { deployment: 'beta/apps' })
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
      useFileHash: false
    }
  )
);

plugins.push(
  new DefinePlugin({
    DEPLOYMENT_MODE: JSON.stringify('insights')
  })
);

module.exports = {
  ...webpackConfig,
  plugins
};
