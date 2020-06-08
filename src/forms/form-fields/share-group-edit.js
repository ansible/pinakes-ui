import React from 'react';
import PropTypes from 'prop-types';
import { InternalSelect } from '@data-driven-forms/pf4-component-mapper/dist/cjs/select';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';
import {
  Text,
  TextContent,
  TextVariants,
  GridItem,
  Grid
} from '@patternfly/react-core';

const ShareGroupEdit = (props) => {
  const { input, label, ...rest } = useFieldApi(props);
  return (
    <Grid hasGutter className="share-column">
      <GridItem span={7}>
        <TextContent>
          <Text component={TextVariants.h4}>{label}</Text>
        </TextContent>
      </GridItem>
      <GridItem span={5}>
        <InternalSelect menuIsPortal {...input} {...rest} />
      </GridItem>
    </Grid>
  );
};

ShareGroupEdit.propTypes = {
  label: PropTypes.string.isRequired
};

export default ShareGroupEdit;
