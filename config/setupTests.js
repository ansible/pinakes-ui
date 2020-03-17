import { configure, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

/**
 * mock fetch
 */
import 'whatwg-fetch';

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;

/**
 * setup ENV vars
 */
process.env.BASE_PATH = '/api';

/**
 * Setup JSDOM
 */
global.SVGPathElement = function () {};

global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};

// prepare root element
const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
Element.prototype.scrollTo = () => {};

// mock insights instance
global.insights = {
  chrome: {
    appNavClick: () => {},
    auth: {
      getUser: () => new Promise(resolve => resolve(true))
    },
    getUserPermissions: () => Promise.resolve([]),
  }
};
