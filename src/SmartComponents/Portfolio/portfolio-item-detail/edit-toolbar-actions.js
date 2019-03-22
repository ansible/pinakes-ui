import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { LevelItem, Button } from '@patternfly/react-core';

const EditToolbarActions = ({ detailUrl, onSave, resetWorkflow }) => (
  <Fragment>
    <LevelItem>
      <Link to={ detailUrl }>
        <Button variant="link" onClick={ resetWorkflow }>
          Cancel
        </Button>
      </Link>
    </LevelItem>
    <LevelItem>
      <Button variant="primary" onClick={ onSave }>
        Save
      </Button>
    </LevelItem>
  </Fragment>
);

EditToolbarActions.propTypes = {
  detailUrl: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  resetWorkflow: PropTypes.func.isRequired
};

export default EditToolbarActions;
