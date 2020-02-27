import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import {
  Alert,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
  LevelItem
} from '@patternfly/react-core';
import ButtonWithSpinner from '../../../presentational-components/shared/button-with-spinner';
import CatalogLink from '../../common/catalog-link';

const DetailToolbarActions = ({
  copyUrl,
  orderUrl,
  editUrl,
  workflowUrl,
  editSurveyUrl,
  isOpen,
  setOpen,
  isFetching,
  availability
}) => (
  <Fragment>
    <LevelItem>
      {availability === 'available' ? (
        <CatalogLink disabled={isFetching} pathname={orderUrl} preserveSearch>
          <ButtonWithSpinner
            isDisabled={isFetching}
            showSpinner={isFetching}
            variant="primary"
            id="order-portfolio-item"
          >
            Order
          </ButtonWithSpinner>
        </CatalogLink>
      ) : (
        <Alert
          id="unavailable-alert-info"
          variant="info"
          isInline
          title="Source for this product is no longer available"
        />
      )}
    </LevelItem>
    {
      <LevelItem style={{ marginLeft: 16 }}>
        <Dropdown
          isPlain
          onToggle={setOpen}
          onSelect={() => setOpen(false)}
          position={DropdownPosition.right}
          toggle={<KebabToggle onToggle={(isOpen) => setOpen(isOpen)} />}
          isOpen={isOpen}
          dropdownItems={[
            <DropdownItem
              aria-label="Edit Portfolio"
              key="edit-portfolio"
              component={
                <CatalogLink pathname={editUrl} preserveSearch>
                  Edit
                </CatalogLink>
              }
              role="link"
            />,
            <DropdownItem
              aria-label="Copy Portfolio"
              key="copy-portfolio"
              component={
                <CatalogLink pathname={copyUrl} preserveSearch>
                  Copy
                </CatalogLink>
              }
              role="link"
            />,
            <DropdownItem
              aria-label="Set approval"
              key="edit-approval_workflow"
              component={
                <CatalogLink pathname={workflowUrl} preserveSearch>
                  Set approval
                </CatalogLink>
              }
              role="link"
            />,
            <DropdownItem
              aria-label="Edit survey"
              key="edit-survey"
              component={
                <CatalogLink pathname={editSurveyUrl} preserveSearch>
                  Edit survey
                </CatalogLink>
              }
              role="link"
            />
          ]}
        />
      </LevelItem>
    }
  </Fragment>
);

DetailToolbarActions.propTypes = {
  orderUrl: PropTypes.string.isRequired,
  editUrl: PropTypes.string.isRequired,
  copyUrl: PropTypes.string.isRequired,
  editSurveyUrl: PropTypes.string.isRequired,
  workflowUrl: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  availability: PropTypes.oneOf(['available', 'unavailable']).isRequired
};

DetailToolbarActions.defaultProps = {
  isFetching: false
};

export default DetailToolbarActions;
