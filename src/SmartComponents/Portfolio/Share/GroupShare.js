import React, { Component } from 'react';
import propTypes from 'prop-types';
import { DataListItem,  DataListCell, FormSelect, FormSelectOption } from '@patternfly/react-core';

class GroupShare extends Component {

  onChange = () => {

  };

  permissionsDetails = (group) => {
    if (!group.group_permission) {
      return '';
    }
    else {
      return (
        <FormSelect value={ this.state.value } onChange={ this.onChange } aria-label="FormSelect Input">
          { this.group.map((option, index) => (
            <FormSelectOption key={ index } value={ option.permission } label={ option.permission }/>
          )) }
        </FormSelect>);
    }
  };

  render() {
    let { item } = this.props;

    return (
      <DataListItem key={ `group-${item.group_uuid}` }
        aria-labelledby={ `check-group-${item.uuid}` }>
        <DataListCell>
          <span id={ item.group_uuid }>{ item.group_name } </span>
        </DataListCell>
        <DataListCell>
          { this.permissionsDetails(item) }
        </DataListCell>
      </DataListItem>
    );
  };
}

GroupShare.propTypes = {
  item: propTypes.object,
  noItems: propTypes.string
};

export default GroupShare;
