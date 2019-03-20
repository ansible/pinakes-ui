import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Stack,
  StackItem,
  DataListItem,
  DataListCell,
  DropdownItem,
  Dropdown,
  DropdownPosition,
  Title,
  TextVariants,
  TextContent } from '@patternfly/react-core';

const permissionOptions = [{ value: 'read,order', label: 'Can order/edit' }, { value: 'read,write,order', label: 'Can order/view'} ];

class GroupShare extends Component {

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
        aria-labelledby={ `check-group-${item.uuid}` }>
        <DataListCell>
          <span id={ item.uuid }>{ item.name } </span>
        </DataListCell>
        <DataListCell>
          { this.fetchPermissionsForGroup(item) }
        </DataListCell>
      </DataListItem>
    );
  };
}

GroupShare.propTypes = {
  isLoading: propTypes.bool,
  item: propTypes.object,
  noItems: propTypes.string
};

export default GroupShare;
