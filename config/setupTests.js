import { configure, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import mock, { once } from 'xhr-mock';

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;

/**
 * Setup mock of tests
 */
mock.setup();
global.mockOnce = once;
global.apiClientMock = mock;
