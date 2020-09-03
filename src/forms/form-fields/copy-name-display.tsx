/* eslint-disable react/prop-types */
import React, { useEffect, useState, ReactNode } from 'react';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';
import { FormGroup, TextContent, Text } from '@patternfly/react-core';
import labelMessages from '../../messages/labels.messages';
import useFormatMessage from '../../utilities/use-format-message';

export interface CopyNameDisplayProps {
  label: ReactNode;
  getName: (value: any) => Promise<string>;
  fieldSpy: string;
}

const CopyNameDisplay: React.ComponentType<CopyNameDisplayProps> = ({
  label,
  getName,
  fieldSpy
}) => {
  const formatMessage = useFormatMessage();
  const [name, setName] = useState(formatMessage(labelMessages.loading));
  const {
    input: { value },
    meta: { error }
  } = useFieldApi({
    name: fieldSpy
  });
  useEffect(() => {
    getName(value).then((name: string) => {
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

export default CopyNameDisplay;
