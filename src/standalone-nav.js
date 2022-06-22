// import PropTypes from 'prop-types';
import * as React from 'react';
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

import { Routes } from './presentational-components/navigation/routes';
import { SmallLogo } from './presentational-components/navigation/small-logo';
import { StatefulDropdown } from './presentational-components/navigation/stateful-dropdown';
import { AboutModalWindow } from './presentational-components/navigation/about-modal/about-modal';
import Logo from './assets/images/logo-large.svg';
import { Fragment, useEffect, useState } from 'react';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { MIN_SCREEN_HEIGHT } from './constants/ui-constants';
import UserContext from './user-context';
import { useLocation, useHistory } from 'react-router';
import { getUser, loginUser, logoutUser } from './helpers/shared/active-user';
import { UnknownErrorPlaceholder } from './presentational-components/shared/loader-placeholders';
import {
  APPLICATION_TITLE,
  APPROVAL_ADMIN_ROLE,
  APPROVAL_APPROVER_ROLE,
  CATALOG_ADMIN_ROLE,
  CATALOG_UI_PREFIX
} from './utilities/constants';
import { Paths } from './constants/routes';
import useFormatMessage from './utilities/use-format-message';
import portfolioMessages from './messages/portfolio.messages';
import productsMessages from './messages/products.messages';
import platformsMessages from './messages/platforms.messages';
import ordersMessages from './messages/orders.messages';
import approvalMessages from './messages/approval.messages';

const App = (props) => {
  const [auth, setAuth] = useState(undefined);
  const [user, setUser] = useState(null);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [menuExpandedSections, setMenuExpandedSections] = useState([]);

  const location = useLocation();
  const history = useHistory();
  const formatMessage = useFormatMessage();
  const index = window.location.href.indexOf(window.location.pathname);
  const baseUrl = window.location.href.substr(0, index);

  const menu = () => {
    const menuItem = (name, options = {}) => {
      return !options.condition || options.condition({ user })
        ? { ...options, type: 'item', name }
        : null;
    };

    let menu = [];
    [
      menuItem(formatMessage(productsMessages.title), {
        url: `${baseUrl}${CATALOG_UI_PREFIX}${Paths.products}`
      }),
      menuItem(formatMessage(portfolioMessages.portfoliosTitle), {
        url: `${baseUrl}${CATALOG_UI_PREFIX}${Paths.portfolios}`
      }),
      menuItem(formatMessage(platformsMessages.title), {
        url: `${baseUrl}${CATALOG_UI_PREFIX}${Paths.platforms}`,
        condition: ({ user }) =>
          user?.roles ? user.roles.includes(CATALOG_ADMIN_ROLE) : false
      }),
      menuItem(formatMessage(ordersMessages.title), {
        url: `${baseUrl}${CATALOG_UI_PREFIX}${Paths.orders}`
      }),
      menuItem(formatMessage(ordersMessages.menuApproval), {
        url: `${baseUrl}${CATALOG_UI_PREFIX}${Paths.approval}`,
        condition: ({ user }) => {
          return user?.roles
            ? user.roles.includes(APPROVAL_ADMIN_ROLE) ||
                user.roles.includes(APPROVAL_APPROVER_ROLE)
            : false;
        }
      })
    ].forEach((item) => {
      if (item !== null) {
        menu.push(item);
      }
    });
    return menu;
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
    getUser()
      .then((user) => {
        setAuth(true);
        setUser(user);
      })
      .catch((error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          return loginUser(
            `${window.location.pathname}${window.location.search}`
          );
        } else {
          throw error;
        }
      });
  }, []);

  let docsDropdownItems = [];
  let userDropdownItems = [];
  let userName = '';

  if (user) {
    if (user.first_name || user.last_name) {
      userName = user.first_name + ' ' + user.last_name;
    } else {
      userName = user.username;
    }

    userDropdownItems = [
      <DropdownItem isDisabled key="username">
        Username: {user.username || ''}
      </DropdownItem>,
      <DropdownItem
        key="logout"
        aria-label={'logout'}
        onClick={() =>
          logoutUser().then(() => {
            setUser(null);
            window.location.replace(
              `${baseUrl}${CATALOG_UI_PREFIX}${Paths.portfolios}`
            );
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
        brandImageAlt={`Application Logo`}
        productName={APPLICATION_TITLE}
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
      logo={<SmallLogo alt={APPLICATION_TITLE} />}
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
        nav={
          <Nav onToggle={onToggle}>
            <NavList>
              <NavGroup title={APPLICATION_TITLE} />
              <Menu items={menu()} />
            </NavList>
          </Nav>
        }
      />
    </Fragment>
  );

  console.log('Debug - userRoles: ', user?.roles);
  return (
    <div id="app-render-root" className="pf-c-drawer__content">
      <Page
        className=".pf-c-page__main"
        isManagedSidebar={true}
        header={headerNav()}
        sidebar={sidebarNav()}
      >
        {aboutModalVisible && aboutModal()}
        <UserContext.Provider
          value={{
            userRoles: user?.roles,
            standalone: true
          }}
        >
          <NotificationsPortal />
          <Grid style={{ minHeight: MIN_SCREEN_HEIGHT }}>
            <GridItem sm={12}>
              {auth === false && <UnknownErrorPlaceholder />}
              {auth && user && <Routes />}
            </GridItem>
          </Grid>
        </UserContext.Provider>
      </Page>
    </div>
  );
};

export default App;
