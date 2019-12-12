import React from 'react';
import PropTypes from 'prop-types';
import { rawComponents } from '@data-driven-forms/pf4-component-mapper';
import { Level, LevelItem } from '@patternfly/react-core';
import asyncFormValidator from '../../utilities/async-form-validator';

export const ShareGroupSelect = ({
  FieldProvider,
  inputName,
  selectName,
  loadOptions,
  permissions
}) => {
  return (
    <div className="share-group-modal">
      <Level>
        <LevelItem className="share-column">
          <FieldProvider
            name={inputName}
            loadOptions={asyncFormValidator(loadOptions)}
          >
            {({ input, ...props }) => (
              <rawComponents.Select
                isSearchable
                isClearable
                loadOptions={asyncFormValidator(loadOptions)}
                placeholder="Select group"
                {...input}
                {...props}
              />
            )}
          </FieldProvider>
        </LevelItem>
        <LevelItem className="share-column">
          <FieldProvider name={selectName} options={permissions}>
            {({ input, ...props }) => (
              <rawComponents.Select
                placeholder="Select permission"
                {...input}
                {...props}
              />
            )}
          </FieldProvider>
        </LevelItem>
      </Level>
    </div>
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
