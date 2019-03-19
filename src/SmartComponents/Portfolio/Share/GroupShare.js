import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Stack,
  StackItem,
  DataListItem,
  DataListCell,
  DataListCheck,
  DataListToggle,
  DataListContent,
  DropdownItem,
  Dropdown,
  DropdownPosition,
  KebabToggle,
  Title,
  TextVariants,
  TextContent } from '@patternfly/react-core';

class GroupShare extends Component {
  state = {
    isKebabOpen: false
  };

  onKebabToggle = isOpen => {
    this.setState({
      isKebabOpen: isOpen
    });
  };

  onKebabSelect = (event) => {
    this.setState({ isKebabOpen: !this.state.isKebabOpen });
  };

  buildGroupActionKebab = (group) => {
    return (
      <Dropdown
        position={ DropdownPosition.right }
        onSelect={ this.onKebabSelect }
        toggle={ <KebabToggle onToggle={ this.onKebabToggle }/> }
        isOpen = { this.state.isKebabOpen}
        dropdownItems={ [
          <DropdownItem aria-label="Edit Group" key="edit-group">
            <Link to={ `/groups/edit/${group.uuid}` }>
              Edit
            </Link>
          </DropdownItem>,
          <DropdownItem component="link" aria-label="Remove Group" key="remove-group">
            <Link to={ `/groups/remove/${group.uuid}` }>
              Delete
            </Link>
          </DropdownItem>
        ] }
        isPlain
      />
    );
  };

  fetchPermissionsForGroup = (group) => {
    if (!group.permissions) {
      return '';
    }
    return group.permissions.map(verb => ` ${verb.description}`).join(', ');
  };

  render() {
    let { item } = this.props;

    return (
      <DataListItem key={ `group-${item.uuid}` }
        aria-labelledby={ `check-group-${item.uuid}` }
        isExpanded={ this.props.isExpanded(`group-${item.uuid}`) }>
        <DataListToggle
          onClick={ () => this.props.toggleExpand(`group-${item.uuid}`) }
          isExpanded={ this.props.isExpanded(`group-${item.uuid}`) }
          id={ `group-${item.uuid}` }
          aria-labelledby={ `group-${item.uuid} group-${item.uuid}` }
          aria-label="Toggle details for"
        />
        <DataListCheck aria-labelledby={ `check-group-${item.uuid}` } name={ `check-group-${item.uuid}` }/>
        <DataListCell>
          <span id={ item.uuid }>{ item.name } </span>
        </DataListCell>
        <DataListCell>
          { this.fetchPermissionsForGroup(item) }
        </DataListCell>
        <DataListCell
          class="pf-c-data-list__action"
          aria-labelledby={ `group-${item.uuid} check-group-action${item.uuid}` }
          id={ `group-${item.uuid}` }
          aria-label="Actions">
          { this.buildGroupActionKebab(item) }
        </DataListCell>
        <DataListContent aria-label="Group Content Details"
          isHidden={ !this.props.isExpanded(`group-${item.uuid}`) }>
          <Stack gutter="md">
            <StackItem>
              <Title size="md">Description</Title>
            </StackItem>
            <StackItem>
              <TextContent component={ TextVariants.h6 }>
                { item.description }
              </TextContent>
            </StackItem>
            <StackItem>
            </StackItem>
            <StackItem>
              <Title size="md">Permissions</Title>
            </StackItem>
            <StackItem>
              <TextContent component={ TextVariants.h6 }>
                { this.fetchPermissionsForGroup(item) }
              </TextContent>
            </StackItem>
          </Stack>
        </DataListContent>
      </DataListItem>
    );
  };
}

GroupShare.propTypes = {
  isLoading: propTypes.bool,
  item: propTypes.object,
  isExpanded: propTypes.func.isRequired,
  toggleExpand: propTypes.func.isRequired,
  noItems: propTypes.string
};

export default GroupShare;
