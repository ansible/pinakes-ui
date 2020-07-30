import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
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

const StyledText = styled(Text)`
  line-height: 36px !important;
`;

const SharedGroup = ({ name, remove, index, permissionVerbs }) => {
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

SharedGroup.propTypes = {
  name: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  permissionVerbs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired
};

const ShareGroupEdit = ({ name, permissionVerbs }) => {
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
          {length > 0 && (
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

ShareGroupEdit.propTypes = {
  permissionVerbs: PropTypes.array,
  name: PropTypes.string.isRequired
};

export default ShareGroupEdit;
