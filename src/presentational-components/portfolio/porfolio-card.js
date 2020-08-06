import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ItemDetails from '../shared/card-common';
import {
  CardHeader,
  CardFooter,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
  Text,
  TextContent,
  TextVariants,
  Label
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';
import PortfolioCardHeader from './portfolio-card-header';

import CatalogLink from '../../smart-components/common/catalog-link';
import {
  SHARE_PORTFOLIO_ROUTE,
  EDIT_PORTFOLIO_WORKFLOW_ROUTE,
  EDIT_PORTFOLIO_ROUTE,
  REMOVE_PORTFOLIO_ROUTE,
  PORTFOLIO_ROUTE,
  EDIT_ORDER_PROCESS_ROUTE
} from '../../constants/routes';
import {
  StyledCard,
  StyledGalleryItem
} from '../styled-components/styled-gallery';
import { StyledCardBody } from '../styled-components/card';
import actionMessages from '../../messages/actions.messages';
import labelMessages from '../../messages/labels.messages';
import useFormatMessage from '../../utilities/use-format-message';
import orderProcessesMessages from '../../messages/order-processes.messages';

const TO_DISPLAY = ['description'];

const HeaderActions = ({
  portfolioId,
  handleCopyPortfolio,
  userCapabilities: { share, copy, unshare, update, destroy, set_approval }
}) => {
  const formatMessage = useFormatMessage();
  const [isOpen, setOpen] = useState(false);
  const dropdownItems = [];
  if (share || unshare) {
    dropdownItems.push(
      <DropdownItem
        key="share-portfolio-action"
        id="share-portfolio-action"
        component={
          <CatalogLink
            searchParams={{ portfolio: portfolioId }}
            pathname={SHARE_PORTFOLIO_ROUTE}
            preserveHash
          >
            {formatMessage(actionMessages.share)}
          </CatalogLink>
        }
      />
    );
  }

  if (copy) {
    dropdownItems.push(
      <DropdownItem
        key="copy-portfolio-action"
        id="copy-portfolio-action"
        onClick={() => handleCopyPortfolio(portfolioId)}
      >
        {formatMessage(actionMessages.copy)}
      </DropdownItem>
    );
  }

  if (set_approval) {
    dropdownItems.push(
      <DropdownItem
        key="workflow-portfolio-action"
        id="workflow-portfolio-action"
        component={
          <CatalogLink
            searchParams={{ portfolio: portfolioId }}
            pathname={EDIT_PORTFOLIO_WORKFLOW_ROUTE}
            preserveHash
          >
            {formatMessage(actionMessages.setApproval)}
          </CatalogLink>
        }
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
            pathname={EDIT_ORDER_PROCESS_ROUTE}
            searchParams={{ portfolio: portfolioId }}
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
        key="edit-portfolio-action"
        id="edit-portfolio-action"
        component={
          <CatalogLink
            searchParams={{ portfolio: portfolioId }}
            pathname={EDIT_PORTFOLIO_ROUTE}
            preserveHash
          >
            {formatMessage(actionMessages.edit)}
          </CatalogLink>
        }
      />
    );
  }

  if (destroy) {
    dropdownItems.push(
      <DropdownItem
        key="remove-portfolio-action"
        id="remove-portfolio-action"
        component={
          <CatalogLink
            searchParams={{ portfolio: portfolioId }}
            pathname={REMOVE_PORTFOLIO_ROUTE}
            preserveHash
          >
            {formatMessage(actionMessages.delete)}
          </CatalogLink>
        }
      />
    );
  }

  return dropdownItems.length === 0 ? null : (
    <Dropdown
      key="portfolio-dropdown"
      id={`portfolio-${portfolioId}-dropdown`}
      isOpen={isOpen}
      isPlain
      onSelect={() => setOpen(false)}
      position={DropdownPosition.right}
      toggle={
        <KebabToggle
          id={`portfolio-${portfolioId}-toggle`}
          onToggle={(isOpen) => setOpen(isOpen)}
        />
      }
      dropdownItems={dropdownItems}
    />
  );
};

HeaderActions.propTypes = {
  portfolioId: PropTypes.string.isRequired,
  userCapabilities: PropTypes.shape({
    destroy: PropTypes.bool,
    update: PropTypes.bool,
    share: PropTypes.bool,
    unshare: PropTypes.bool,
    set_approval: PropTypes.bool,
    copy: PropTypes.bool
  }).isRequired,
  handleCopyPortfolio: PropTypes.func.isRequired
};

const PortfolioCard = ({
  imageUrl,
  isDisabled,
  name,
  id,
  handleCopyPortfolio,
  metadata: {
    user_capabilities,
    statistics: { shared_groups, portfolio_items }
  },
  ...props
}) => {
  const formatMessage = useFormatMessage();
  const to = {
    pathname: PORTFOLIO_ROUTE,
    search: `?portfolio=${id}`
  };
  return (
    <StyledGalleryItem isDisabled={isDisabled}>
      <StyledCard>
        <CardHeader>
          <PortfolioCardHeader
            id={id}
            to={to}
            portfolioName={name}
            portfolio_items={portfolio_items || 0}
            headerActions={
              <HeaderActions
                portfolioId={id}
                userCapabilities={user_capabilities}
                handleCopyPortfolio={handleCopyPortfolio}
              />
            }
          />
        </CardHeader>
        <StyledCardBody>
          <TextContent className="pf-u-mb-md">
            <Text component={TextVariants.small} className="pf-i-mb-sm">
              Last updated&nbsp;
              <DateFormat
                date={props.updated_at || props.created_at}
                type="relative"
              />
            </Text>
            <Text component={TextVariants.small}>{props.owner}</Text>
          </TextContent>
          <ItemDetails
            {...{ name, imageUrl, ...props }}
            toDisplay={TO_DISPLAY}
          />
        </StyledCardBody>
        <CardFooter>
          {shared_groups > 0 && (
            <Label variant="filled" color="blue">
              {formatMessage(labelMessages.shared)}
            </Label>
          )}
        </CardFooter>
      </StyledCard>
    </StyledGalleryItem>
  );
};

PortfolioCard.propTypes = {
  history: PropTypes.object,
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string.isRequired,
  updated_at: PropTypes.string,
  created_at: PropTypes.string.isRequired,
  owner: PropTypes.string,
  isDisabled: PropTypes.bool,
  metadata: PropTypes.shape({
    user_capabilities: PropTypes.object.isRequired,
    statistics: PropTypes.shape({
      shared_groups: PropTypes.number,
      portfolio_items: PropTypes.number
    }).isRequired
  }).isRequired,
  handleCopyPortfolio: PropTypes.func.isRequired
};

export default PortfolioCard;
