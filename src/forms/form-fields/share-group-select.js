import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Button, Level, Tooltip } from '@patternfly/react-core';
import PlusIcon from '@patternfly/react-icons/dist/js/icons/plus-icon';
import { InternalSelect } from '@data-driven-forms/pf4-component-mapper/dist/cjs/select';
import FieldArray from '@data-driven-forms/react-form-renderer/dist/cjs/field-array';

import asyncFormValidator from '../../utilities/async-form-validator';
import { useIntl } from 'react-intl';
import formsMessages from '../../messages/forms.messages';
import portfolioMessages from '../../messages/portfolio.messages';
import { StyledLevelItem } from '../../presentational-components/styled-components/level';

export const NewGroupSelect = ({
  loadOptions,
  permissions,
  addGroup,
  currentGroups
}) => {
  /**
   * This counter will re-initialize select components withouth having to re-initialize the whole form after new group was added
   */
  const [resetGroup, setResetGroup] = useState(0);
  const [group, setGroup] = useState(undefined);
  const [permission, setPermission] = useState(undefined);
  const { formatMessage } = useIntl();

  let tooltipContent;
  if (!group && !permission) {
    tooltipContent = formatMessage(portfolioMessages.shareErrorMissingData);
  } else if (group && !permission) {
    tooltipContent = formatMessage(
      portfolioMessages.shareErrorMissingPermission
    );
  } else if (permission && !group) {
    tooltipContent = formatMessage(portfolioMessages.shareErrorMissingGroup);
  } else {
    tooltipContent = formatMessage(portfolioMessages.shareTooltip);
  }

  const hasError = !!currentGroups.find(
    (item) => item.group_uuid === group?.value
  );

  return (
    <Level>
      <StyledLevelItem grow>
        <Grid hasGutter className="share-column">
          <GridItem span={7}>
            <InternalSelect
              name="select-group"
              key={resetGroup}
              isSearchable
              isClearable
              simpleValue={false}
              menuIsPortal
              loadOptions={asyncFormValidator(loadOptions)}
              placeholder={formatMessage(formsMessages.groupsPlaceholder)}
              onChange={(value) => setGroup(value)}
              validated={hasError ? 'error' : 'default'}
              value={group}
            />
            {hasError && (
              <div
                className="pf-c-form__helper-text pf-m-error"
                id="permission-helper"
                aria-live="polite"
              >
                {formatMessage(portfolioMessages.shareDuplicate)}
              </div>
            )}
          </GridItem>
          <GridItem span={5}>
            <InternalSelect
              name="select-permission"
              options={permissions}
              menuIsPortal
              placeholder={formatMessage(formsMessages.permissionsPlaceholder)}
              onChange={(value) => setPermission(value)}
              value={permission}
            />
          </GridItem>
        </Grid>
      </StyledLevelItem>
      <StyledLevelItem alignSelf="baseline">
        <Tooltip content={<p>{tooltipContent}</p>}>
          <span>
            <Button
              id="add-new-group"
              variant="link"
              isDisabled={!group || !permission}
              onClick={() => {
                addGroup({
                  groupName: group.label,
                  group_uuid: group.value,
                  permissions: permission
                });
                setPermission(undefined);
                setGroup(undefined);
                setResetGroup((prev) => prev + 1);
              }}
            >
              <PlusIcon />
            </Button>
          </span>
        </Tooltip>
      </StyledLevelItem>
    </Level>
  );
};

NewGroupSelect.propTypes = {
  loadOptions: PropTypes.func.isRequired,
  permissions: PropTypes.any,
  addGroup: PropTypes.func.isRequired,
  currentGroups: PropTypes.array
};

const ShareGroupSelect = (props) => (
  <FieldArray name="shared-groups">
    {({ fields: { push, value } }) => (
      <NewGroupSelect {...props} addGroup={push} currentGroups={value} />
    )}
  </FieldArray>
);

export default ShareGroupSelect;
