import { createBrowserHistory } from 'history';

const pathName = window.location.pathname.split('/');
pathName.shift();

let prefix = '/';
if (pathName[0] === 'beta') {
  prefix = `/${pathName.shift()}/`;
}

/**
 * Make sure that the [1] fragment is present in the pathname.
 * Otherwise we could end up with /undefined/ which will be transformed by the router to //
 */
const basename = `${prefix}${pathName[0]}/${pathName[1] ? pathName[1] : ''}`;
const catalogHistory = createBrowserHistory({
  basename
});

export const release = prefix;
export default catalogHistory;
