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
            <React.Fragment>
              <rawComponents.Select
                isSearchable
                isClearable
                menuIsPortal
                loadOptions={asyncFormValidator(loadOptions)}
                placeholder="Select group"
                isValid={!(props?.meta?.error && props.meta.touched)}
                {...input}
                {...props}
              />
              {props?.meta?.error && props.meta.touched && (
                <div
                  className="pf-c-form__helper-text pf-m-error"
                  id="permission-helper"
                  aria-live="polite"
                >
                  {props.meta.error}
                </div>
              )}
            </React.Fragment>
          )}
        />
      </GridItem>
      <GridItem span={5}>
        <FieldProvider
          name={selectName}
          options={permissions}
          menuIsPortal
          render={({ input, ...props }) => (
            <React.Fragment>
              <rawComponents.Select
                placeholder="Select permission"
                isValid={!(props?.meta?.error && props.meta.touched)}
                {...input}
                {...props}
              />
              {props?.meta?.error && props.meta.touched && (
                <div
                  className="pf-c-form__helper-text pf-m-error"
                  id="permission-helper"
                  aria-live="polite"
                >
                  {props.meta.error}
                </div>
              )}
            </React.Fragment>
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
  permissions: PropTypes.any,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string
  })
};

export default ShareGroupSelect;
