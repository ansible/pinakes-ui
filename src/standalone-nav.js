// import PropTypes from 'prop-types';
import * as React from 'react';
import './Navigation.scss';
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
import Logo from './assets/images/logo-large.svg';
import { Fragment, useEffect, useState } from 'react';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { MIN_SCREEN_HEIGHT } from './constants/ui-constants';
import UserContext from './user-context';
import { useLocation } from 'react-router';
import { getUser, logoutUser } from './helpers/shared/active-user';
import { getAxiosInstance } from './helpers/shared/user-login';
import { CATALOG_API_BASE } from './utilities/constants';
import { SET_OPENAPI_SCHEMA } from './redux/action-types';
import { useDispatch } from 'react-redux';

const App = (props) => {
  const [user, setUser] = useState(null);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [toggleOpen, setToggleOpen] = useState(false);
  const [menuExpandedSections, setMenuExpandedSections] = useState([]);
  const [openApiSchema, setOpenApiSchema] = useState();
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();

  const location = useLocation();

  const menu = () => {
    const menuItem = (name, options = {}) => ({
      condition: () => true,
      ...options,
      type: 'item',
      name
    });
    const index = window.location.href.indexOf(window.location.pathname);
    const baseUrl = window.location.href.substr(0, index);

    return [
      menuItem('Products', {
        url: `${baseUrl}/ui/catalog${Paths.products}`
      }),
      menuItem('Portfolios', {
        url: `${baseUrl}/ui/catalog${Paths.portfolios}`
      }),
      menuItem('Platforms', {
        url: `${baseUrl}/ui/catalog${Paths.platforms}`
      }),
      menuItem('Orders', {
        url: `${baseUrl}/ui/catalog${Paths.orders}`
      }),
      menuItem('Approval', {
        url: `${baseUrl}/ui/catalog${Paths.approval}/index.html`
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
    const activeMenu = menu();
    activateMenu(activeMenu);
    setMenuExpandedSections(
      activeMenu
        ?.filter((i) => i.type === 'section' && i.active)
        .map((i) => i.name)
    );
  }, []);

  useEffect(() => {
    getAxiosInstance()
      .get(`${CATALOG_API_BASE}/schema/openapi.json`)
      .then((payload) => {
        setOpenApiSchema(payload);
        dispatch({ type: SET_OPENAPI_SCHEMA, payload });
      });
    getUser().then((user) => setUser(user));
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
        onClick={() =>
          logoutUser().then(() => {
            setUser(null);
          })
        }
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
        productName={'Automation Services Catalog'}
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
      logo={<SmallLogo alt={'Automation Services Catalog'} />}
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
        <a href={item.url} to={item.url}>
          {item.name}
        </a>
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
                title={'Automation Services Catalog'}
              />
              <Menu items={menu()} />
            </NavList>
          </Nav>
        }
      />
    </Fragment>
  );

  return (
    <div id="app-render-root" className="pf-c-drawer__content">
      <Page
        classname=".pf-c-page__main"
        isManagedSidebar={true}
        header={headerNav()}
        sidebar={sidebarNav()}
      >
        {aboutModalVisible && aboutModal()}
        <UserContext.Provider
          value={{
            permissions: [{ permission: 'catalog:portfolios:create' }],
            userIdentity: { identity: { user: { is_org_admin: true } } },
            openApiSchema,
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
