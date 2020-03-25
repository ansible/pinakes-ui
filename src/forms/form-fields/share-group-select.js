import React from 'react';
import PropTypes from 'prop-types';
import { rawComponents } from '@data-driven-forms/pf4-component-mapper';
import { Grid, GridItem } from '@patternfly/react-core';
import asyncFormValidator from '../../utilities/async-form-validator';

export const ShareGroupSelect = ({
  FieldProvider,
  inputName,
  selectName,
  loadOptions,
  permissions
}) => {
  return (
    <Grid gutter="md" className="share-column">
      <GridItem span={7}>
        <FieldProvider
          name={inputName}
          loadOptions={asyncFormValidator(loadOptions)}
          render={({ input, ...props }) => (
            <rawComponents.Select
              isSearchable
              isClearable
              menuIsPortal
              loadOptions={asyncFormValidator(loadOptions)}
              placeholder="Select group"
              {...input}
              {...props}
            />
          )}
        />
      </GridItem>
      <GridItem span={5}>
        <FieldProvider
          name={selectName}
          options={permissions}
          menuIsPortal
          render={({ input, ...props }) => (
            <rawComponents.Select
              placeholder="Select permission"
              {...input}
              {...props}
            />
          )}
        />
      </GridItem>
    </Grid>
  );
};

ShareGroupSelect.propTypes = {
  FieldProvider: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
    .isRequired,
  inputName: PropTypes.string.isRequired,
  selectName: PropTypes.string.isRequired,
  loadOptions: PropTypes.func.isRequired,
  permissions: PropTypes.any
};

export default ShareGroupSelect;
