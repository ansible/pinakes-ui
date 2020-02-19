import React from 'react';
import PropTypes from 'prop-types';
import { rawComponents } from '@data-driven-forms/pf4-component-mapper';
import {
  Text,
  TextContent,
  TextVariants,
  GridItem,
  Grid
} from '@patternfly/react-core';

const ShareGroupEdit = ({ FieldProvider, label, ...props }) => {
  return (
    <Grid gutter="md" className="share-column">
      <GridItem span={7}>
        <TextContent>
          <Text component={TextVariants.h4}>{label}</Text>
        </TextContent>
      </GridItem>
      <GridItem span={5}>
        <FieldProvider
          {...props}
          menuIsPortal
          render={({ input, ...props }) => (
            <rawComponents.Select {...input} {...props} />
          )}
        />
      </GridItem>
    </Grid>
  );
};

ShareGroupEdit.propTypes = {
  FieldProvider: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
    .isRequired,
  label: PropTypes.string.isRequired
};

export default ShareGroupEdit;
