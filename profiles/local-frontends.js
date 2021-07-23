// Hack so that Mac OSX docker can sub in host.docker.internal instead of localhost
// see https://docs.docker.com/docker-for-mac/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host
const localhost =
  process.env.PLATFORM === 'linux' ? 'localhost' : 'host.docker.internal';

const SECTION = 'ansible';
const APP_ID = 'catalog';
const FRONTEND_PORT = 8002;

const routes = {
  [`/${SECTION}/${APP_ID}`]: { host: `https://${localhost}:${FRONTEND_PORT}` },
  [`/beta/${SECTION}/${APP_ID}`]: {
    host: `https://${localhost}:${FRONTEND_PORT}`
  },
  [`/beta/${SECTION}/${APP_ID}/portfolios`]: {
    host: `https://${localhost}:${FRONTEND_PORT}`
  },
  [`/${SECTION}/${APP_ID}/portfolios`]: {
    host: `https://${localhost}:${FRONTEND_PORT}`
  },
  [`/beta/${SECTION}/${APP_ID}/portfolios`]: {
    host: `https://${localhost}:${FRONTEND_PORT}`
  },
  [`/${SECTION}/${APP_ID}/platforms`]: {
    host: `https://${localhost}:${FRONTEND_PORT}`
  },
  [`/beta/${SECTION}/${APP_ID}/platforms`]: {
    host: `https://${localhost}:${FRONTEND_PORT}`
  },
  [`/${SECTION}/${APP_ID}/orders`]: {
    host: `https://${localhost}:${FRONTEND_PORT}`
  },
  [`/beta/${SECTION}/${APP_ID}/orders`]: {
    host: `https://${localhost}:${FRONTEND_PORT}`
  },
  [`/apps/${APP_ID}`]: { host: `https://${localhost}:${FRONTEND_PORT}` },
  [`/beta/apps/${APP_ID}`]: { host: `https://${localhost}:${FRONTEND_PORT}` },
  [`/beta/config`]: { host: `http://localhost:8889` }
};

exports.routes = routes;
