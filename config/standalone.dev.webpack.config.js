const webpackBase = require('./webpack.base.config');

// Used for getting the correct host when running in a container
const proxyHost = process.env.PINAKES_API_PROXY_HOST || 'catalog.k8s.local';
const proxyPort = process.env.PINAKES_API_PROXY_PORT || '';
const apiBasePath = process.env.PINAKES_API_BASE_PATH || '/api/pinakes/v1';
const authBasePath = process.env.PINAKES_AUTH_BASE_PATH || '/api/pinakes/auth';

module.exports = webpackBase({
  // The host where the API lives. EX: https://localhost:5001
  API_HOST: '',

  // Path to the API on the API host. EX: /api/pinakes
  API_BASE_PATH: apiBasePath,
  AUTH_BASE_PATH: authBasePath,

  // Port that the UI is served over
  UI_PORT: 8002,

  // Determines if the app should be compiled to run on insights or on
  // another platform. Options: insights, standalone
  DEPLOYMENT_MODE: 'standalone',

  // Serve the UI over http or https. Options: true, false
  UI_USE_HTTPS: false,

  // Enables webpack debug mode. Options: true, false
  UI_DEBUG: true,

  // Target compilation environment. Options: dev, prod
  TARGET_ENVIRONMENT: 'dev',
  WEBPACK_PUBLIC_PATH: '/ui/catalog/',

  // Value for webpack.devServer.proxy
  // https://webpack.js.org/configuration/dev-server/#devserverproxy
  // used to get around CORS requirements when running in dev mode
  WEBPACK_PROXY: {
    '/api/**': {
      target: 'http://catalog.k8s.local',
      secure: false,
      changeOrigin: true
    },
    '/login/': {
      target: 'http://catalog.k8s.local',
      secure: false,
      changeOrigin: true
    }
  }
});
