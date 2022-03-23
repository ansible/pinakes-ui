const webpackBase = require('./webpack.base.config');

// Compile configuration for stnadalone mode
module.exports = webpackBase({
  API_HOST: '',
  API_BASE_PATH: '/api/pinakes/v1',
  AUTH_BASE_PATH: '/api/pinakes/auth',
  DEPLOYMENT_MODE: 'standalone',
  UI_USE_HTTPS: false,
  UI_DEBUG: false,
  TARGET_ENVIRONMENT: 'prod',
  WEBPACK_PUBLIC_PATH: '/ui/catalog/',
  APPLICATION_NAME: process.env.APPLICATION_NAME || 'Pinakes prod'
});
