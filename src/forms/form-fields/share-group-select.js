import React from 'react';
import PropTypes from 'prop-types';
import { rawComponents } from '@data-driven-forms/pf4-component-mapper';
import { Level, LevelItem } from '@patternfly/react-core';

export const ShareGroupSelect = ({
  FieldProvider,
  inputName,
  selectName,
  groups,
  permissions
}) => {
  return (
    <div className="share-group-modal">
      <Level>
        <LevelItem className="share-column">
          <FieldProvider name={ inputName } options={ groups }>
            { ({ input, ...props }) => <rawComponents.Select isSearcheable isClearable placeholder="Select group" { ...input } { ...props } /> }
          </FieldProvider>

        </LevelItem>
        <LevelItem className="share-column">
          <FieldProvider name={ selectName } options={ permissions }>
            { ({ input, ...props }) => <rawComponents.Select placeholder="Select permission" { ...input } { ...props } /> }
          </FieldProvider>
        </LevelItem>
      </Level>
    </div>
  );
};

ShareGroupSelect.propTypes = {
  FieldProvider: PropTypes.oneOfType([ PropTypes.node, PropTypes.func ]).isRequired,
  inputName: PropTypes.string.isRequired,
  selectName: PropTypes.string.isRequired,
  groups: PropTypes.any,
  permissions: PropTypes.any
};

export default ShareGroupSelect;

