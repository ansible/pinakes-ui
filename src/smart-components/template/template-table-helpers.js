import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Label, Flex, FlexItem, Checkbox } from '@patternfly/react-core';

import TemplateTableContext from './template-table-context';
import { timeAgo } from '../../helpers/shared/approval-helpers';

export const GroupsLabels = ({ group_refs, id }) => (
  <Flex key={id} className="pf-u-mt-sm">
    {group_refs.map(({ name, uuid }) => (
      <FlexItem key={uuid}>
        <Label className="group-label pf-u-mb-sm">{name}</Label>
      </FlexItem>
    ))}
  </Flex>
);

GroupsLabels.propTypes = {
  id: PropTypes.string,
  group_refs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired
    })
  )
};

export const SelectBox = ({ id }) => {
  const { selectedTemplates, setSelectedTemplates } = useContext(
    TemplateTableContext
  );

  return (
    <Checkbox
      id={`select-${id}`}
      isChecked={selectedTemplates.includes(id)}
      onChange={() => setSelectedTemplates(id)}
    />
  );
};

SelectBox.propTypes = {
  id: PropTypes.string.isRequired
};

export const createRows = (data) =>
  data.map(({ id, title, description, created_at, updated_at }) => ({
    id,
    cells: [
      <React.Fragment key={`${id}-checkbox`}>
        <SelectBox id={id} />
      </React.Fragment>,
      title,
      description,
      updated_at ? timeAgo(updated_at) : timeAgo(created_at)
    ]
  }));
