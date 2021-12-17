/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import useEnhancedHistory from '../../../utilities/use-enhanced-history';
import CatalogLink from '../../common/catalog-link';
import ordersMessages from '../../../messages/orders.messages';
import { stateToDisplay } from '../../../helpers/shared/helpers';

/**
 * Make sure to import correct Tabs styles
 */
import '@patternfly/react-styles/css/components/Tabs/tabs.css';
import useFormatMessage from '../../../utilities/use-format-message';
import { OrderStateEnum } from '@redhat-cloud-services/catalog-client';
import { FormatMessage } from '../../../types/common-types';
import { CatalogRootState } from '../../../types/redux';
import { OrderDetail } from '../../../redux/reducers/order-reducer';

const StyledCatalogLink = styled(CatalogLink)`
  color: var(--pf-c-tabs__link--Color);
  text-decoration: none;
`;

const StyledTabButton = styled(({ isDisabled, ...props }) => (
  <button {...props} />
))`
  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'initial')};
`;

const StyledTabItem = styled(({ isDisabled, ...props }) => <li {...props} />)`
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
`;

const useNavItems = (
  { state }: { state?: OrderStateEnum } = {},
  formatMessage: FormatMessage
) => [
  {
    link: '',
    title: formatMessage(ordersMessages.orderDetails)
  },
  {
    link: '/approval',
    title: formatMessage(ordersMessages.menuApproval)
  },
  {
    link: '/provision',
    title: formatMessage(ordersMessages.menuProvision)
  },
  {
    link: '/lifecycle',
    title: formatMessage(ordersMessages.menuLifecycle),
    isDisabled: stateToDisplay(state)
  }
];

export interface OrderDetailMenuProps {
  baseUrl: string;
  isFetching?: boolean;
}

const OrderDetailMenu: React.ComponentType<OrderDetailMenuProps> = ({
  baseUrl,
  isFetching
}) => {
  const formatMessage = useFormatMessage();
  const { push } = useEnhancedHistory();
  const orderDetailData = useSelector<CatalogRootState, OrderDetail>(
    ({ orderReducer: { orderDetail } }) => orderDetail || {}
  );
  const { pathname, search } = useLocation();
  const { order } = orderDetailData;
  const navItems = useNavItems(order, formatMessage);
  let activeKey = navItems.findIndex(
    ({ link }) => pathname.split('/').pop() === link.replace('/', '')
  );
  activeKey = activeKey > 0 ? activeKey : 0;
  const handleTabClick = (tabIndex: number) =>
    push({ pathname: `${baseUrl}${navItems[tabIndex].link}`, search });

  return (
    <div className="pf-c-tabs pf-u-pl-xl pf-u-pr-md">
      <ul className="pf-c-tabs__list">
        {navItems.map(({ link, title, isDisabled }, index) => (
          <StyledTabItem
            className={`pf-c-tabs__item${
              index === activeKey ? ' pf-m-current' : ''
            }`}
            isDisabled={isDisabled || isFetching}
            key={link || index}
          >
            <StyledTabButton
              className="pf-c-tabs__link"
              isDisabled={isDisabled || isFetching}
              {...(isDisabled || isFetching ? { tabIndex: -1 } : {})}
              onClick={() => handleTabClick(index)}
            >
              <StyledCatalogLink
                exact
                nav
                isDisabled={isDisabled || isFetching}
                pathname={`${baseUrl}${link}`}
                preserveSearch
                activeClassName="pf-m-active"
                {...(isDisabled || isFetching ? { tabIndex: -1 } : {})}
              >
                {title}
              </StyledCatalogLink>
            </StyledTabButton>
          </StyledTabItem>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetailMenu;
