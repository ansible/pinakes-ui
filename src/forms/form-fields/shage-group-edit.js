import React from 'react';
import PropTypes from 'prop-types';
import { rawComponents } from '@data-driven-forms/pf4-component-mapper';
import {
  Level,
  LevelItem,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';

const ShareGroupEdit = ({ FieldProvider, label, ...props }) => {
  return (
    <div className="share-group-modal group">
      <Level>
        <LevelItem className="share-column">
          <TextContent>
            <Text component={TextVariants.h4}>{label}</Text>
          </TextContent>
        </LevelItem>
        <LevelItem className="share-column">
          <FieldProvider {...props}>
            {({ input, ...props }) => (
              <rawComponents.Select {...input} {...props} />
            )}
          </FieldProvider>
        </LevelItem>
      </Level>
    </div>
  );
};

ShareGroupEdit.propTypes = {
  FieldProvider: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
    .isRequired,
  label: PropTypes.string.isRequired
};

export default ShareGroupEdit;
