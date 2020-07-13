import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  TextContent,
  Text,
  TextVariants,
  NavList,
  Nav
} from '@patternfly/react-core';
import CatalogLink from '../../common/catalog-link';
import { useIntl } from 'react-intl';
import ordersMessages from '../../../messages/orders.messages';

const useNavItems = ({ state } = {}, formatMessage) => [
  {
    link: '',
    title: formatMessage(ordersMessages.orderDetails)
  },
  {
    link: '/approval',
    title: formatMessage(ordersMessages.menuApproval)
  },
  {
    link: '/lifecycle',
    title: formatMessage(ordersMessages.menuLifecycle),
    isDisabled: state !== 'Completed' && state !== 'Ordered'
  }
];

const OrderDetailMenu = ({ baseUrl, isFetching }) => {
  const { formatMessage } = useIntl();
  const orderDetailData = useSelector(
    ({ orderReducer: { orderDetail } }) => orderDetail || {}
  );
  const { order } = orderDetailData;
  const navItems = useNavItems(order, formatMessage);
  return (
    <Nav>
      <NavList className="orders-side-nav-list">
        <li className="pf-c-nav__item orders-nav-section-group">
          <TextContent>
            <Text component={TextVariants.small}>
              {formatMessage(ordersMessages.menuSteps)}
            </Text>
          </TextContent>
        </li>
        {navItems.map(({ link, title, isDisabled }) => (
          <li
            key={link || title}
            className={`pf-c-nav__item orders-side-nav-item orders-side-nav-category${
              isDisabled || isFetching ? ' disabled' : ''
            }`}
            {...(isDisabled ? { tabIndex: -1 } : {})}
          >
            <CatalogLink
              exact
              nav
              isDisabled={isDisabled}
              pathname={`${baseUrl}${link}`}
              preserveSearch
              className="pf-c-nav__link orders-side-nav-link"
              activeClassName="pf-m-active"
              {...(isDisabled ? { tabIndex: -1 } : {})}
            >
              {title}
            </CatalogLink>
          </li>
        ))}
      </NavList>
    </Nav>
  );
};

OrderDetailMenu.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  isFetching: PropTypes.bool
};

export default OrderDetailMenu;
