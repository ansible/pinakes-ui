// import PropTypes from 'prop-types';
import * as React from 'react';
import { Link } from 'react-router-dom';

import '@patternfly/patternfly/patternfly.scss';
import {
  DropdownItem,
  Grid,
  GridItem,
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

import { Routes, Paths } from './presentational-components/navigation/routes';
import { SmallLogo } from './presentational-components/navigation/small-logo';
import { StatefulDropdown } from './presentational-components/navigation/stateful-dropdown';
import { AboutModalWindow } from './presentational-components/navigation/about-modal/about-modal';
import AppContext from './app-context';
import Logo from './assets/images/logo-large.svg';
import { Fragment, useEffect, useState } from 'react';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { MIN_SCREEN_HEIGHT } from './constants/ui-constants';
import UserContext from './user-context';
import { useLocation } from 'react-router';

const App = (props) => {
  const [user, setUser] = useState(null);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [toggleOpen, setToggleOpen] = useState(false);
  const [menuExpandedSections, setMenuExpandedSections] = useState([]);
  const [token, setToken] = useState(null);

  const location = useLocation();

  const menu = () => {
    const menuItem = (name, options = {}) => ({
      condition: () => true,
      ...options,
      type: 'item',
      name
    });
    const baseUrl = '';

    return [
      menuItem('Products', {
        url: `${baseUrl}${Paths.products}`
      }),
      menuItem('Portfolios', {
        url: `${baseUrl}${Paths.portfolios}`
      }),
      menuItem('Platforms', {
        url: `${baseUrl}${Paths.platforms}`
      }),
      menuItem('Orders', {
        url: `${baseUrl}${Paths.orders}`
      }),
      menuItem('Approval', {
        url: `${baseUrl}${Paths.approval}`
      }),
      menuItem(`Documentation`, {
        url:
          'https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/',
        external: true
      })
    ];
  };

  const activateMenu = (items) => {
    items.forEach(
      (item) =>
        (item.active =
          item.type === 'section'
            ? activateMenu(item.items)
            : location.pathname.startsWith(item.url))
    );
    return some(items, 'active');
  };

  useEffect(() => {
    window.catalog = {
      ...window.catalog,
      token
    };
  }, [token]);

  useEffect(() => {
    const activeMenu = menu();
    activateMenu(activeMenu);
    setMenuExpandedSections(
      activeMenu
        ?.filter((i) => i.type === 'section' && i.active)
        .map((i) => i.name)
    );
  }, []);

  let docsDropdownItems = [];
  let userDropdownItems = [];
  let userName = null;

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
      <DropdownItem
        key="logout"
        aria-label={'logout'}
        onClick={() => setUser(null)}
      >
        {`Logout`}
      </DropdownItem>
    ];
  }

  const aboutModal = () => {
    return (
      <AboutModalWindow
        isOpen={aboutModalVisible}
        trademark=""
        brandImageSrc={Logo}
        onClose={() => setAboutModalVisible(false)}
        brandImageAlt={`Ansible Logo`}
        productName={'Ansible automation catalog'}
        user={user}
        userName={userName}
      />
    );
  };

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
    <DropdownItem key="about" onClick={() => setAboutModalVisible(true)}>
      {`About`}
    </DropdownItem>
  ];

  const headerNav = () => (
    <PageHeader
      logo={<SmallLogo alt={'Ansible automation catalog'} />}
      headerTools={
        <PageHeaderTools>
          {user ? (
            <Link to={Paths.login}>{`Login`}</Link>
          ) : (
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
          )}
        </PageHeaderTools>
      }
      showNavToggle
    />
  );

  activateMenu(menu());

  const MenuItem = ({ item }) => (
    <NavItem
      isActive={item.active}
      onClick={(e) => {
        item.onclick && item.onclick();
        e.stopPropagation();
      }}
    >
      {item.url && item.external ? (
        // eslint-disable-next-line react/jsx-no-target-blank
        <a href={item.url} data-cy={item['data-cy']} target="_blank">
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
  );

  const ItemOrSection = ({ item }) =>
    item.type === 'section' ? (
      <MenuSection section={item} />
    ) : (
      <MenuItem item={item} />
    );

  const Menu = ({ items }) => (
    <Fragment>
      {items.map((item) => (
        <ItemOrSection key={item.name} item={item} />
      ))}
    </Fragment>
  );

  const MenuSection = ({ section }) => (
    <NavExpandable
      title={section.name}
      groupId={section.name}
      isActive={section.active}
      isExpanded={menuExpandedSections.includes(section.name)}
    >
      <Menu items={section.items} />
    </NavExpandable>
  );

  const onToggle = ({ groupId, isExpanded }) => {
    return setMenuExpandedSections(
      isExpanded
        ? [...menuExpandedSections, groupId]
        : reject(menuExpandedSections, (name) => name === groupId)
    );
  };

  const sidebarNav = () => (
    <Fragment>
      <PageSidebar
        theme="dark"
        nav={
          <Nav theme="dark" onToggle={onToggle}>
            <NavList>
              <NavGroup
                className={'nav-title'}
                title={'Ansible automation catalog'}
              />
              <Menu items={menu()} />
            </NavList>
          </Nav>
        }
      />
    </Fragment>
  );
  // Hide navs on login page
  if (location?.pathname === Paths.login) {
    return (
      <UserContext.Provider
        value={{
          permissions: [
            { permission: 'catalog:portfolios:create' },
            { permission: 'catalog:portfolios:update' },
            { permission: 'catalog:portfolios:remove' },
            { permission: 'catalog:portfolio_items:create' },
            { permission: 'catalog:portfolio_items:update' },
            { permission: 'catalog:portfolio_items:remove' }
          ],
          userIdentity: { identity: { user: { is_org_admin: true } } },
          openApiSchema: {},
          standalone: true
        }}
      >
        <Fragment>
          <NotificationsPortal />
          <section className="pf-u-p-0 pf-u-ml-0 pf-l-page__main-section pf-c-page__main-section">
            <Grid style={{ minHeight: MIN_SCREEN_HEIGHT }}>
              <GridItem sm={12} className="content-layout">
                <Routes />
              </GridItem>
            </Grid>
          </section>
        </Fragment>
      </UserContext.Provider>
    );
  }

  return (
    <div id="app-render-root" className="pf-c-drawer__content">
      <Page isManagedSidebar={true} header={headerNav()} sidebar={sidebarNav()}>
        {aboutModalVisible && aboutModal()}
        <UserContext.Provider
          value={{
            permissions: [{ permission: 'catalog:portfolios:create' }],
            userIdentity: { identity: { user: { is_org_admin: true } } },
            openApiSchema: {},
            standalone: true
          }}
        >
          <NotificationsPortal />
          <div style={{ minHeight: MIN_SCREEN_HEIGHT }}>
            <Routes />
          </div>
        </UserContext.Provider>
      </Page>
    </div>
  );
};

export default App;
