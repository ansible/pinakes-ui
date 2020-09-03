/* eslint-disable react/prop-types */
import React, { Fragment, ComponentType } from 'react';
import { InternalSelect } from '@data-driven-forms/pf4-component-mapper/dist/cjs/select';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';
import FieldArray from '@data-driven-forms/react-form-renderer/dist/cjs/field-array';
import {
  Text,
  TextContent,
  TextVariants,
  GridItem,
  Grid,
  Button,
  Level
} from '@patternfly/react-core';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';
import { StyledLevelItem } from '../../presentational-components/styled-components/level';
import styled from 'styled-components';
import portfolioMessages from '../../messages/portfolio.messages';
import useFormatMessage from '../../utilities/use-format-message';
import { SelectOptions } from '../../types/common-types';

const StyledText = styled(Text)`
  line-height: 36px !important;
`;

export interface SharedGroupProps {
  name: string;
  remove: (index: number) => void;
  index: number;
  permissionVerbs: SelectOptions;
}

const SharedGroup: ComponentType<SharedGroupProps> = ({
  name,
  remove,
  index,
  permissionVerbs
}) => {
  const { input } = useFieldApi({ name });
  return (
    <Level>
      <StyledLevelItem grow>
        <Grid hasGutter className="share-column">
          <GridItem span={7}>
            <TextContent>
              <StyledText component={TextVariants.h4}>
                {input.value.groupName}
              </StyledText>
            </TextContent>
          </GridItem>
          <GridItem span={5}>
            <InternalSelect
              name={name}
              menuIsPortal
              options={permissionVerbs}
              value={input.value.permissions}
              onChange={(permissions) =>
                input.onChange({
                  ...input.value,
                  permissions
                })
              }
            />
          </GridItem>
        </Grid>
      </StyledLevelItem>
      <StyledLevelItem>
        <Button
          id={`remove-share-${index}`}
          variant="plain"
          onClick={() => remove(index)}
        >
          <TrashIcon />
        </Button>
      </StyledLevelItem>
    </Level>
  );
};

export interface ShareGroupEditProps {
  name: string;
  permissionVerbs: SelectOptions;
}

const ShareGroupEdit: ComponentType<ShareGroupEditProps> = ({
  name,
  permissionVerbs
}) => {
  const formatMessage = useFormatMessage();
  return (
    <FieldArray name={name}>
      {({ fields: { map, remove, length } }) => (
        <Fragment>
          {length === 0 && (
            <TextContent>
              <Text>{formatMessage(portfolioMessages.noShares)}</Text>
            </TextContent>
          )}
          {length && length > 0 && (
            <TextContent>
              <Text component="small">
                {formatMessage(portfolioMessages.shareGroupsAccess)}
              </Text>
            </TextContent>
          )}
          {map((name, index) => (
            <SharedGroup
              key={name}
              name={name}
              remove={remove}
              index={index}
              permissionVerbs={permissionVerbs}
            />
          ))}
        </Fragment>
      )}
    </FieldArray>
  );
};

export default ShareGroupEdit;
