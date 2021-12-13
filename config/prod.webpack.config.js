const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { DefinePlugin } = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  ...(process.env.BETA && { deployment: 'beta/apps' })
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../')
    }
  )
);

plugins.push(
  new DefinePlugin({
    DEPLOYMENT_MODE: JSON.stringify('insights')
  })
);

module.exports = function(env) {
  if (env && env.analyze === 'true') {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    ...webpackConfig,
    plugins
  };
};
