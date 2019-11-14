import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { TextContent, Text, TextVariants, NavList, Nav } from '@patternfly/react-core';

const navItems = [{
  link: '',
  title: 'Order details'
}, {
  link: '/approval',
  title: 'Approval'
}, {
  link: '/provision',
  title: 'Provision'
}, {
  link: '/lifecycle',
  title: 'Lifecycle'
}];

const OrderDetailMenu = ({ baseUrl, search }) => {
  return (
    <Nav>
      <NavList className="orders-side-nav-list">
        <li className="pf-c-nav__item orders-nav-section-group">
          <TextContent>
            <Text component={ TextVariants.small }>
              Order steps
            </Text>
          </TextContent>
        </li>
        { navItems.map(({ link, title }) => (
          <li key={ link || title }
            className="pf-c-nav__item orders-side-nav-item orders-side-nav-category"
          >
            <NavLink
              exact
              to={ {
                pathname: `${baseUrl}${link}`,
                search
              } }
              className="pf-c-nav__link orders-side-nav-link"
              activeClassName="pf-m-active"
            >
              { title }
            </NavLink>
          </li>
        )) }
      </NavList>
    </Nav>
  );
};

OrderDetailMenu.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired
};

export default OrderDetailMenu;
