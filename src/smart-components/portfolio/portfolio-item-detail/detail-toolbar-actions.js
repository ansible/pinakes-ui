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
import actionMessages from '../../../messages/actions.messages';
import portfolioMessages from '../../../messages/portfolio.messages';
import useFormatMessage from '../../../utilities/use-format-message';
import orderProcessesMessages from '../../../messages/order-processes.messages';
import { PORTFOLIO_ITEM_EDIT_ORDER_PROCESS_ROUTE } from '../../../constants/routes';

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
  orderable,
  userCapabilities,
  canLinkOrderProcesses
}) => {
  const formatMessage = useFormatMessage();
  const dropdownItems = [];

  if (userCapabilities?.update) {
    dropdownItems.push(
      <DropdownItem
        aria-label="Edit Portfolio"
        key="edit-portfolio-item"
        id="edit-portfolio-item"
        component={
          <CatalogLink pathname={editUrl} preserveSearch>
            {formatMessage(actionMessages.edit)}
          </CatalogLink>
        }
        role="link"
      />
    );
  }

  if (userCapabilities?.copy) {
    dropdownItems.push(
      <DropdownItem
        aria-label="Copy Portfolio"
        key="copy-portfolio-item"
        id="copy-portfolio-item"
        component={
          <CatalogLink pathname={copyUrl} preserveSearch>
            {formatMessage(actionMessages.copy)}
          </CatalogLink>
        }
        role="link"
      />
    );
  }

  if (userCapabilities?.tags) {
    dropdownItems.push(
      <DropdownItem
        aria-label="Set approval"
        key="set-approval_workflow"
        id="set-approval_workflow"
        component={
          <CatalogLink pathname={workflowUrl} preserveSearch>
            {formatMessage(actionMessages.setApproval)}
          </CatalogLink>
        }
        role="link"
      />
    );
  }

  if (userCapabilities?.update && canLinkOrderProcesses) {
    const orderProcessAction = formatMessage(
      orderProcessesMessages.setOrderProcess
    );
    dropdownItems.push(
      <DropdownItem
        aria-label={orderProcessAction}
        key="attach-order-processes"
        id="attach-order-processes"
        component={
          <CatalogLink
            preserveSearch
            pathname={PORTFOLIO_ITEM_EDIT_ORDER_PROCESS_ROUTE}
          >
            {orderProcessAction}
          </CatalogLink>
        }
        role="link"
      />
    );
  }

  if (userCapabilities?.update) {
    dropdownItems.push(
      <DropdownItem
        aria-label="Edit survey"
        key="edit-survey"
        id="edit-survey"
        component={
          <CatalogLink pathname={editSurveyUrl} preserveSearch>
            {formatMessage(portfolioMessages.portfolioItemSurvey)}
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
          isDisabled={isFetching || !orderable}
          pathname={orderUrl}
          preserveSearch
        >
          <ButtonWithSpinner
            isDisabled={isFetching || !orderable}
            showSpinner={isFetching}
            variant="primary"
            id="order-portfolio-item"
            ouiaId="order-portfolio-item"
          >
            {formatMessage(portfolioMessages.portfolioItemOrder)}
          </ButtonWithSpinner>
        </CatalogLink>
      </LevelItem>
      <LevelItem style={{ marginLeft: 16 }}>
        {availability !== 'unavailable' && dropdownItems.length > 0 && (
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
            dropdownItems={dropdownItems}
          />
        )}
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
  orderable: PropTypes.bool,
  userCapabilities: PropTypes.shape({
    update: PropTypes.bool,
    copy: PropTypes.bool,
    tags: PropTypes.bool
  }).isRequired,
  canLinkOrderProcesses: PropTypes.bool
};

DetailToolbarActions.defaultProps = {
  isFetching: false,
  orderable: true,
  canLinkOrderProcesses: false
};

export default DetailToolbarActions;
