// import PropTypes from 'prop-types';
import * as React from 'react';
import '../app.scss';
import {
  withRouter,
  Link,
  RouteComponentProps,
  matchPath,
} from 'react-router-dom';

import '@patternfly/patternfly/patternfly.scss';
import {
  DropdownItem,
  DropdownSeparator,
  Nav,
  NavExpandable,
  NavGroup,
  NavItem,
  NavList,
  Page,
  PageHeader,
  PageHeaderTools,
  PageSidebar,
} from '@patternfly/react-core';
import {
  ExternalLinkAltIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';
import { reject, some } from 'lodash';

import { Routes } from './presentational-components/navigation/routes';
import { Paths, formatPath } from 'src/paths';
import { SmallLogo, StatefulDropdown } from 'src/components';
import { AboutModalWindow } from './presentational-components/navigation';
import { AppContext } from './presentational-components/navigation/app-context';
import Logo from 'src/../static/images/logo_large.svg';

const App = (props) => {
  const [user, setUser] = useState(null);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [toggleOpen, setToggleOpen] = useState(false);
  const [menuExpandedSections, setMenuExpandedSections] = useState([]);

  useEffect(() => {
    const menu = menu();
    activateMenu(menu);
    setMenuExpandedSections(menu.filter((i) => i.type === 'section' && i.active).map((i) => i.name))
  });

  const render = () => {
    let aboutModal = null;
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
        <DropdownItem isDisabled key='username'>
          Username: {user.username}
        </DropdownItem>,
        <DropdownItem
          key='logout'
          aria-label={'logout'}
          onClick={() => setUser(null)}
        >
          {_`Logout`}
        </DropdownItem>,
      ];

      docsDropdownItems = [
        <DropdownItem
          key='customer_support'
          href='https://access.redhat.com/support'
          target='_blank'
        >
          Customer Support <ExternalLinkAltIcon />
        </DropdownItem>,
        <DropdownItem
          key='training'
          href='https://www.ansible.com/resources/webinars-training'
          target='_blank'
        >
          Training <ExternalLinkAltIcon />
        </DropdownItem>,
        <DropdownItem
          key='about'
          onClick={() =>
            this.setState({ aboutModalVisible: true, toggleOpen: false })
          }
        >
          {_`About`}
        </DropdownItem>,
      ];

      aboutModal = (
        <AboutModalWindow
          isOpen=aboutModalVisible
          trademark=''
          brandImageSrc={Logo}
          onClose={() => setAboutModalVisible(false)}
          brandImageAlt={_`Ansible Logo`}
          productName={APPLICATION_NAME}
          user={user}
          userName={userName}
        />
      );
    }

    const Header = (
      <PageHeader
        logo={<SmallLogo alt={APPLICATION_NAME}/>}
        headerTools={
          <PageHeaderTools>
            {!user ? (
              <Link
                to={formatPath(
                  Paths.login,
                  {},
                  { next: location.pathname },
                )}
              >
                {_`Login`}
              </Link>
            ) : (
              <div>
                <StatefulDropdown
                  ariaLabel={'docs-dropdown'}
                  defaultText={<QuestionCircleIcon />}
                  items={docsDropdownItems}
                  toggleType='icon'
                />
                <StatefulDropdown
                  ariaLabel={'user-dropdown'}
                  defaultText={userName}
                  items={userDropdownItems}
                  toggleType='dropdown'
                />
              </div>
            )}
          </PageHeaderTools>
        }
        showNavToggle
      />
    );

    const menu = menu();
    activateMenu(menu);

    const ItemOrSection = ({ item }) =>
      item.type === 'section' ? (
        <MenuSection section={item} />
      ) : (
        <MenuItem item={item} />
      );
    const MenuItem = ({ item }) =>
      item.condition({ user }) ? (
        <NavItem
          isActive={item.active}
          onClick={(e) => {
            item.onclick && item.onclick();
            e.stopPropagation();
          }}
        >
          {item.url && item.external ? (
            <a href={item.url} data-cy={item['data-cy']} target='_blank'>
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
      section.condition({ user }) ? (
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
      return  setMenuExpandedSections( isExpanded
          ? [...menuExpandedSections, groupId]
          : reject(menuExpandedSections, (name) => name === groupId))
    };

    const Sidebar = () => {
      return (
        <Fragment>
          <PageSidebar
            theme='dark'
            nav={
              <Nav theme='dark' onToggle={onToggle}>
                <NavList>
                  <NavGroup className={'nav-title'} title={APPLICATION_NAME}/>
                  {user && <Menu items={menu}/>}
                </NavList>
              </Nav>
            }
          />
        </Fragment>
      )
    };

    // Hide navs on login page
    if (location.pathname === Paths.login) {
      return ctx(<Routes/>);
    }

    return this.ctx(
      <Page isManagedSidebar={true} header={Header} sidebar={Sidebar}>
        {aboutModalVisible && aboutModal}
        <Routes/>
      </Page>,
    );
  }

  const menu = () => {
    const menuItem = (name, options = {}) => ({
      condition: () => true,
      ...options,
      type: 'item',
      name,
    });
    const menuSection = (name, options = {}, items = []) => ({
      condition: (...params) =>
        some(items, (item) => item.condition(...params)), // any visible items inside
      ...options,
      type: 'section',
      name,
      items,
    });

    return [
      menuItem('Products', {
        url: Paths.products,
      }),
      menuItem('Portfolios', {
        url: Paths.portfolios,
      }),
      menuItem('Platforms', {
        url: Paths.platforms,
      }),
      menuItem('Order Processes', {
        url: Paths.orderProcesses,
      }),
      menuItem('Orders', {
        url: Paths.orders,
      }),
      menuItem(`Documentation`, {
        url: 'https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/',
        external: true,
      })
    ];
  }

  const activateMenu = (items) => {
    items.forEach(
      (item) =>
        (item.active =
          item.type === 'section'
            ? activateMenu(item.items)
            : props.location.pathname.startsWith(item.url)),
    );
    return some(items, 'active');
  }



const ctx = (component) => {
  return (
    <AppContext.Provider
      value={{
        user: user,
        setUser: setUser
      }}
    >
      {component}
    </AppContext.Provider>
  );
}

return render();
}

export default App;
