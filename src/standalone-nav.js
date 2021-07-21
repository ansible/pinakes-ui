import React from 'react';
import { withRouter } from 'react-router-dom';
import '@patternfly/patternfly/patternfly.css';

import {
  Avatar,
  Brand,
  Button,
  Dropdown,
  DropdownGroup,
  DropdownToggle,
  DropdownItem,
  KebabToggle,
  Nav,
  NavItem,
  NavList,
  OverflowMenu,
  OverflowMenuControl,
  OverflowMenuDropdownItem,
  OverflowMenuItem,
  Page,
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  PageSection,
  PageSidebar,
  Pagination,
  Select,
  SelectOption,
  SkipToContent,
  TextContent,
  Text,
  Toolbar,
  ToolbarItem,
  ToolbarFilter,
  ToolbarContent,
  Sidebar,
  NavExpandable
} from '@patternfly/react-core';
import CogIcon from '@patternfly/react-icons/dist/js/icons/cog-icon';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import imgBrand from '@patternfly/react-core/src/components/Brand/examples/pfLogo.svg';
import imgAvatar from '@patternfly/react-core/src/components/Avatar/examples/avatarImg.svg';
import pfIcon from './assets/images/logo_small.svg';
import Products from './smart-components/products/products';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        products: []
      },
      res: [],
      selectedItems: [],
      areAllSelected: false,
      itemsCheckedByDefault: false,
      isUpperToolbarDropdownOpen: false,
      isUpperToolbarKebabDropdownOpen: false,
      isLowerToolbarDropdownOpen: false,
      isLowerToolbarKebabDropdownOpen: false,
      isCardKebabDropdownOpen: false,
      activeItem: 0,
      splitButtonDropdownIsOpen: false,
      page: 1,
      perPage: 10,
      totalItemCount: 10
    };

    this.onPageDropdownToggle = (isUpperToolbarDropdownOpen) => {
      this.setState({
        isUpperToolbarDropdownOpen
      });
    };

    this.onPageDropdownSelect = (event) => {
      this.setState({
        isUpperToolbarDropdownOpen: !this.state.isUpperToolbarDropdownOpen
      });
    };

    this.onPageToolbarDropdownToggle = (isPageToolbarDropdownOpen) => {
      this.setState({
        isPageToolbarDropdownOpen
      });
    };

    this.onPageToolbarKebabDropdownToggle = (
      isUpperToolbarKebabDropdownOpen
    ) => {
      this.setState({
        isUpperToolbarKebabDropdownOpen
      });
    };

    this.onToolbarDropdownToggle = (isLowerToolbarDropdownOpen) => {
      this.setState((prevState) => ({
        isLowerToolbarDropdownOpen
      }));
    };

    this.onNavSelect = (result) => {
      this.setState({
        activeItem: result.itemId
      });
    };

    this.deleteItem = (item) => (event) => {
      const filter = (getter) => (val) => getter(val) !== item.id;
      this.setState({
        res: this.state.res.filter(filter(({ id }) => id)),
        selectedItems: this.state.selectedItems.filter(filter((id) => id))
      });
    };

    this.onSetPage = (_event, pageNumber) => {
      this.setState({
        page: pageNumber
      });
    };

    this.onPerPageSelect = (_event, perPage) => {
      this.setState({
        perPage
      });
    };

    this.onSplitButtonToggle = (isOpen) => {
      this.setState({
        splitButtonDropdownIsOpen: isOpen
      });
    };

    this.onSplitButtonSelect = (event) => {
      this.setState((prevState, props) => {
        return {
          splitButtonDropdownIsOpen: !prevState.splitButtonDropdownIsOpen
        };
      });
    };

    this.onNameSelect = (event, selection) => {
      const checked = event.target.checked;
      this.setState((prevState) => {
        const prevSelections = prevState.filters.products;
        return {
          filters: {
            ...prevState.filters,
            ['products']: checked
              ? [...prevSelections, selection]
              : prevSelections.filter((value) => value !== selection)
          }
        };
      });
    };

    this.onDelete = (type = '', id = '') => {
      if (type) {
        this.setState((prevState) => {
          prevState.filters[type.toLowerCase()] = prevState.filters[
            type.toLowerCase()
          ].filter((s) => s !== id);
          return {
            filters: prevState.filters
          };
        });
      } else {
        this.setState({
          filters: {
            products: []
          }
        });
      }
    };
  }
  selectedItems(e) {
    const { value, checked } = e.target;
    let { selectedItems } = this.state;
    if (checked) {
      selectedItems = [...selectedItems, value];
    } else {
      selectedItems = selectedItems.filter((el) => el !== value);
      if (this.state.areAllSelected) {
        this.setState({
          areAllSelected: !this.state.areAllSelected
        });
      }
    }

    this.setState({ selectedItems });
  }

  render() {
    const {
      isUpperToolbarDropdownOpen,
      isUpperToolbarKebabDropdownOpen,
      isLowerToolbarKebabDropdownOpen,
      activeItem,
      filters,
      res
    } = this.state;

    const kebabDropdownItems = [
      <DropdownItem key="kebab-settings">
        <CogIcon /> Settings
      </DropdownItem>,
      <DropdownItem key="kebab-help">
        <HelpIcon /> Help
      </DropdownItem>
    ];
    const userDropdownItems = [
      <DropdownGroup key="group 2">
        <DropdownItem key="group 2 profile">My profile</DropdownItem>
        <DropdownItem key="group 2 user" component="button">
          User management
        </DropdownItem>
        <DropdownItem key="group 2 logout">Logout</DropdownItem>
      </DropdownGroup>
    ];
    const headerTools = (
      <PageHeaderTools>
        <PageHeaderToolsGroup
          visibility={{
            default: 'hidden',
            lg: 'visible'
          }} /** the settings and help icon buttons are only visible on desktop sizes and replaced by a kebab dropdown for other sizes */
        >
          <PageHeaderToolsItem>
            <Button aria-label="Settings actions">
              <CogIcon />
            </Button>
          </PageHeaderToolsItem>
          <PageHeaderToolsItem>
            <Button aria-label="Help actions" variant="plain">
              <HelpIcon />
            </Button>
          </PageHeaderToolsItem>
        </PageHeaderToolsGroup>
        <PageHeaderToolsGroup>
          <PageHeaderToolsItem
            visibility={{
              lg: 'hidden'
            }} /** this kebab dropdown replaces the icon buttons and is hidden for desktop sizes */
          >
            <Dropdown
              isPlain
              position="right"
              onSelect={this.onKebabDropdownSelect}
              toggle={
                <KebabToggle onToggle={this.onPageToolbarKebabDropdownToggle} />
              }
              isOpen={isUpperToolbarKebabDropdownOpen}
              dropdownItems={kebabDropdownItems}
            />
          </PageHeaderToolsItem>
          <PageHeaderToolsItem
            visibility={{
              default: 'hidden',
              md: 'visible'
            }} /** this user dropdown is hidden on mobile sizes */
          >
            <Dropdown
              isPlain
              position="right"
              onSelect={this.onPageDropdownSelect}
              isOpen={isUpperToolbarDropdownOpen}
              toggle={
                <DropdownToggle onToggle={this.onPageDropdownToggle}>
                  User
                </DropdownToggle>
              }
              dropdownItems={userDropdownItems}
            />
          </PageHeaderToolsItem>
        </PageHeaderToolsGroup>
        <Avatar src={imgAvatar} alt="Avatar image" />
      </PageHeaderTools>
    );
    const Header = (
      <PageHeader
        logo={<Brand src={imgBrand} alt="Patternfly Logo" />}
        headerTools={headerTools}
        showNavToggle
      />
    );

    const PageNav = (
      <Nav onSelect={this.onNavSelect} aria-label="Nav">
        <NavExpandable title={'Automation services catalog'}>
          <NavList>
            <NavItem itemId={0} isActive={activeItem === 0}>
              Products
            </NavItem>
            <NavItem itemId={1} isActive={activeItem === 1}>
              Portfolios
            </NavItem>
            <NavItem itemId={2} isActive={activeItem === 2}>
              Platforms
            </NavItem>
            <NavItem itemId={3} isActive={activeItem === 3}>
              Order processes
            </NavItem>
            <NavItem itemId={4} isActive={activeItem === 4}>
              Orders
            </NavItem>
            <NavItem itemId={5} isActive={activeItem === 4}>
              Approval
            </NavItem>
          </NavList>
        </NavExpandable>
      </Nav>
    );

    const Sidebar = <PageSidebar isFilled nav={PageNav} />;
    const pageId = 'main-content-card-view-default-nav';
    const PageSkipToContent = (
      <SkipToContent href={`#${pageId}`}>Skip to Content</SkipToContent>
    );
    const filtered =
      filters.products.length > 0
        ? res.filter((card) => {
            return (
              filters.products.length === 0 ||
              filters.products.includes(card.name)
            );
          })
        : res;
    const icons = {
      pfIcon
    };
    return (
      <React.Fragment>
        <Page
          isFilled
          header={Header}
          sidebar={Sidebar}
          isManagedSidebar
          skipToContent={PageSkipToContent}
          mainContainerId={pageId}
        >
          <PageSection isFilled variant="light">
            <TextContent>
              <Text component="h1">Catalog</Text>
            </TextContent>
            <Toolbar id="toolbar-group-types" clearAllFilters={this.onDelete}>
              <ToolbarContent />
            </Toolbar>
          </PageSection>
          <PageSection isFilled />
          <PageSection
            isFilled={false}
            sticky="bottom"
            padding={{ default: 'noPadding' }}
            variant="light"
          />
        </Page>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
