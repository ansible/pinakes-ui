// import PropTypes from 'prop-types';
import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';

import {
  DropdownItem,
  DropdownSeparator,
  Modal,
  Nav,
  NavExpandable,
  NavGroup,
  NavItem,
  NavList,
  Page,
  PageHeader,
  PageHeaderTools,
  PageSidebar
} from '@patternfly/react-core';
import {
  ExternalLinkAltIcon,
  QuestionCircleIcon
} from '@patternfly/react-icons';
import { reject, some } from 'lodash';

import { SmallLogo } from './presentational-components/navigation/small-logo';
import { StatefulDropdown } from './presentational-components/navigation/stateful-dropdown';
import { AboutModal } from '@patternfly/react-core';
import {
  ORDER_ROUTE,
  PORTFOLIO_ROUTE,
  PORTFOLIOS_ROUTE
} from './constants/routes';

export const catalogPaths = {
  products: '/products',
  platforms: '/platforms',
  order_processes: '/order-processes',
  platform: '/platform',
  portfolios: PORTFOLIOS_ROUTE,
  portfolio: PORTFOLIO_ROUTE,
  orders: '/orders',
  order: ORDER_ROUTE,
  approval: '/approval'
};

const errorPaths = ['/400', '/401', '/403', '/404'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      selectedRepo: 'published',
      aboutModalVisible: false,
      toggleOpen: false,
      featureFlags: null,
      menuExpandedSections: []
    };
  }

  componentDidMount() {
    const menu = this.menu();
    //this.activateMenu(menu);
    this.setState({
      menuExpandedSections: menu
        .filter((i) => i.type === 'section' && i.active)
        .map((i) => i.name)
    });
  }

  render() {
    const { featureFlags, menuExpandedSections, user } = this.state;

    let aboutModal = null;
    let docsDropdownItems = [];
    let userDropdownItems = [];
    let userName;

    if (user) {
      if (user.first_name || user.last_name) {
        userName = user.first_name + ' ' + user.last_name;
      } else {
        userName = user.username;
      }

      userDropdownItems = [
        <DropdownItem isDisabled key="username">
          Username: {user.username}
        </DropdownItem>,
        <DropdownSeparator key="separator" />,
        <DropdownItem key="logout" aria-label={'logout'}>
          Logout
        </DropdownItem>
      ];

      docsDropdownItems = [
        <DropdownItem
          key="customer_support"
          href="https://access.redhat.com/support"
          target="_blank"
        >
          Customer Support <ExternalLinkAltIcon />
        </DropdownItem>,
        <DropdownItem
          key="training"
          href="https://www.ansible.com/resources/webinars-training"
          target="_blank"
        >
          Training <ExternalLinkAltIcon />
        </DropdownItem>,
        <DropdownItem
          key="about"
          onClick={() =>
            this.setState({ aboutModalVisible: true, toggleOpen: false })
          }
        >
          About
        </DropdownItem>
      ];

      aboutModal = <AboutModal />;
    }

    const Header = (
      <PageHeader
        logo={<SmallLogo alt={'Automation services catalog'} />}
        headerTools={
          <PageHeaderTools>
            <div>
              <StatefulDropdown
                ariaLabel={'docs-dropdown'}
                defaultText={<QuestionCircleIcon />}
                items={docsDropdownItems}
                toggleType="icon"
              />
              <StatefulDropdown
                ariaLabel={'user-dropdown'}
                defaultText={userName}
                items={userDropdownItems}
                toggleType="dropdown"
              />
            </div>
          </PageHeaderTools>
        }
        showNavToggle
      />
    );

    const menu = this.menu();
    //this.activateMenu(menu);

    const ItemOrSection = ({ item }) =>
      item.type === 'section' ? (
        <MenuSection section={item} />
      ) : (
        <MenuItem item={item} />
      );
    const MenuItem = ({ item }) =>
      item.condition({ user, featureFlags }) ? (
        <NavItem
          isActive={item.active}
          onClick={(e) => {
            item.onclick && item.onclick();
            e.stopPropagation();
          }}
        >
          {item.url && item.external ? (
            <a
              href={item.url}
              data-cy={item['data-cy']}
              target="_blank"
              rel="noreferrer"
            >
              {item.name}
              <ExternalLinkAltIcon
                style={{ position: 'absolute', right: '32px' }}
              />
            </a>
          ) : item.url ? (
            <Link to={item.url}>{item.name}</Link>
          ) : (
            item.name
          )}
        </NavItem>
      ) : null;
    const Menu = ({ items }) => (
      <>
        {items.map((item) => (
          <ItemOrSection key={item.name} item={item} />
        ))}
      </>
    );
    const MenuSection = ({ section }) =>
      section.condition({ user, featureFlags }) ? (
        <NavExpandable
          title={section.name}
          groupId={section.name}
          isActive={section.active}
          isExpanded={menuExpandedSections.includes(section.name)}
        >
          <Menu items={section.items} />
        </NavExpandable>
      ) : null;

    const onToggle = ({ groupId, isExpanded }) => {
      this.setState({
        menuExpandedSections: isExpanded
          ? [...menuExpandedSections, groupId]
          : reject(menuExpandedSections, (name) => name === groupId)
      });
    };

    const Sidebar = (
      <PageSidebar
        theme="dark"
        nav={
          <Nav theme="dark" onToggle={onToggle}>
            <NavList>
              <NavGroup
                className={'nav-title'}
                title={'Automation services catalog'}
              />
              {user && featureFlags && <Menu items={menu} />}
            </NavList>
          </Nav>
        }
      />
    );

    return (
      <Page isManagedSidebar={true} header={Header} sidebar={Sidebar}>
        {this.state.aboutModalVisible && aboutModal}
      </Page>
    );
  }

  menu() {
    const menuItem = (name, options = {}) => ({
      condition: () => true,
      ...options,
      type: 'item',
      name
    });
    const menuSection = (name, options = {}, items = []) => ({
      condition: (...params) =>
        some(items, (item) => item.condition(...params)), // any visible items inside
      ...options,
      type: 'section',
      name,
      items
    });

    return [
      menuSection('Automation services catalog', {}, [
        menuItem('Products', {
          url: catalogPaths.products
        }),
        menuItem('Portfolios', {
          url: catalogPaths.portfolios
        }),
        menuItem('Platforms', {
          url: catalogPaths.platforms
        }),
        menuItem('Order processes', {
          url: catalogPaths.orderProcesses
        }),
        menuItem('Orders', {
          url: catalogPaths.orders
        }),
        menuItem('Approval', {
          condition: true,
          url: catalogPaths.approval
        })
      ]),
      menuItem('Documentation', {
        url:
          'https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/',
        external: true
      })
    ];
  }

  activateMenu(items) {
    items.forEach(
      (item) =>
        (item.active =
          item.type === 'section'
            ? this.activateMenu(item.items)
            : this.props.location.pathname.startsWith(item.url))
    );
    return some(items, 'active');
  }

  updateInitialData = (user, flags, callback) =>
    this.setState({ user, featureFlags: flags }, () => {
      if (callback) {
        callback();
      }
    });

  ctx(component) {
    return { component };
  }
}

export default withRouter(App);
