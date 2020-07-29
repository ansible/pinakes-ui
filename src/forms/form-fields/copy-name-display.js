import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';
import { FormGroup, TextContent, Text } from '@patternfly/react-core';
import { useIntl } from 'react-intl';
import labelMessages from '../../messages/labels.messages';

const CopyNameDisplay = ({ label, getName, fieldSpy }) => {
  const { formatMessage } = useIntl();
  const [name, setName] = useState(formatMessage(labelMessages.loading));
  const {
    input: { value },
    meta: { error }
  } = useFieldApi({
    name: fieldSpy
  });
  useEffect(() => {
    getName(value).then((name) => {
      setName(name);
    });
  }, [value]);

  return (
    <FormGroup label={label} helperText={error} fieldId={value}>
      <TextContent>
        <Text component="h6">{name}</Text>
      </TextContent>
    </FormGroup>
  );
};

CopyNameDisplay.propTypes = {
  label: PropTypes.string.isRequired,
  getName: PropTypes.func.isRequired,
  fieldSpy: PropTypes.string.isRequired
};

export default CopyNameDisplay;
