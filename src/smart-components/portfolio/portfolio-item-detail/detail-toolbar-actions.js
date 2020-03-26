import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import {
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
  availability,
  userCapabilities: { update, copy }
}) => {
  const dropdownItems = [];
  if (update) {
    dropdownItems.push(
      <DropdownItem
        aria-label="Edit Portfolio"
        key="edit-portfolio-item"
        id="edit-portfolio-item"
        component={
          <CatalogLink pathname={editUrl} preserveSearch>
            Edit
          </CatalogLink>
        }
        role="link"
      />
    );
  }

  if (copy) {
    dropdownItems.push(
      <DropdownItem
        aria-label="Copy Portfolio"
        key="copy-portfolio-item"
        id="copy-portfolio-item"
        component={
          <CatalogLink pathname={copyUrl} preserveSearch>
            Copy
          </CatalogLink>
        }
        role="link"
      />
    );
  }

  return (
    <Fragment>
      <LevelItem>
        <CatalogLink
          isDisabled={isFetching || availability === 'unavailable'}
          pathname={orderUrl}
          preserveSearch
        >
          <ButtonWithSpinner
            isDisabled={isFetching || availability === 'unavailable'}
            showSpinner={isFetching}
            variant="primary"
            id="order-portfolio-item"
          >
            Order
          </ButtonWithSpinner>
        </CatalogLink>
      </LevelItem>
      <LevelItem style={{ marginLeft: 16 }}>
        <Dropdown
          isPlain
          onToggle={setOpen}
          onSelect={() => setOpen(false)}
          position={DropdownPosition.right}
          toggle={
            <KebabToggle
              id="portfolio-item-actions-toggle"
              onToggle={(isOpen) => setOpen(isOpen)}
            />
          }
          isOpen={isOpen}
          dropdownItems={[
            ...dropdownItems,
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
    </Fragment>
  );
};

DetailToolbarActions.propTypes = {
  orderUrl: PropTypes.string.isRequired,
  editUrl: PropTypes.string.isRequired,
  copyUrl: PropTypes.string.isRequired,
  editSurveyUrl: PropTypes.string.isRequired,
  workflowUrl: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  availability: PropTypes.oneOf(['available', 'unavailable']).isRequired,
  userCapabilities: PropTypes.shape({
    update: PropTypes.bool,
    copy: PropTypes.bool
  }).isRequired
};

DetailToolbarActions.defaultProps = {
  isFetching: false
};

export default DetailToolbarActions;
