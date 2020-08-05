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
  userCapabilities: { update, copy, set_approval }
}) => {
  const formatMessage = useFormatMessage();
  const dropdownItems = [];
  if (update) {
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

  if (copy) {
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

  if (set_approval) {
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

  if (window.insights.chrome.isBeta() && update) {
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

  if (update) {
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
            {formatMessage(portfolioMessages.portfolioItemOrder)}
          </ButtonWithSpinner>
        </CatalogLink>
      </LevelItem>
      <LevelItem style={{ marginLeft: 16 }}>
        {dropdownItems.length > 0 && (
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
  userCapabilities: PropTypes.shape({
    update: PropTypes.bool,
    copy: PropTypes.bool,
    set_approval: PropTypes.bool
  }).isRequired
};

DetailToolbarActions.defaultProps = {
  isFetching: false
};

export default DetailToolbarActions;
