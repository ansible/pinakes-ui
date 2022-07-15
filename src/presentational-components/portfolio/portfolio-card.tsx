/* eslint-disable react/prop-types */
import React, { useState } from 'react';
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
  TextVariants
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
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
import { UserCapabilities, PortfolioMetadata } from '../../types/common-types';
import { isStandalone } from '../../helpers/shared/helpers';
import { Tooltip } from '@patternfly/react-core';
import {
  StyledShareIcon,
  StyledClipboardCheckIcon
} from '../styled-components/icons';

const TO_DISPLAY = ['description'];

interface HeaderActionsProps {
  portfolioId: string;
  handleCopyPortfolio: (portfolioId: string) => void;
  userCapabilities: UserCapabilities;
  canLinkOrderProcesses: boolean;
}
const HeaderActions: React.ComponentType<HeaderActionsProps> = ({
  portfolioId,
  handleCopyPortfolio,
  canLinkOrderProcesses,
  userCapabilities: { share, copy, unshare, update, destroy, tags }
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

  if (tags) {
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

  if (update && canLinkOrderProcesses) {
    const orderProcessAction = formatMessage(
      orderProcessesMessages.setOrderProcess
    ) as string;
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

export interface PortfolioCardProps {
  imageUrl?: string;
  name?: string;
  id: string;
  updated_at?: string;
  created_at: string;
  owner?: string;
  isDisabled?: boolean;
  metadata: PortfolioMetadata;
  handleCopyPortfolio: (portfolioId: string) => void;
  canLinkOrderProcesses: boolean;
}
const PortfolioCard: React.ComponentType<PortfolioCardProps> = ({
  imageUrl,
  isDisabled,
  name,
  id,
  handleCopyPortfolio,
  metadata,
  canLinkOrderProcesses,
  ...props
}) => {
  const formatMessage = useFormatMessage();
  const to = {
    pathname: PORTFOLIO_ROUTE,
    search: `?portfolio=${id}`
  };
  const user_capabilities = metadata?.user_capabilities || {};
  const statistics = metadata?.statistics || {};
  const portfolio_items = statistics?.portfolio_items ?? 0;
  const approval_processes = statistics?.approval_processes ?? 0;
  const shared_groups = statistics?.shared_groups ?? 0;
  return (
    <StyledGalleryItem isDisabled={isDisabled}>
      <StyledCard ouiaId={`portfolio-${id}`}>
        <CardHeader>
          <PortfolioCardHeader
            id={id}
            to={to}
            portfolioName={name}
            portfolio_items={portfolio_items}
            headerActions={
              <HeaderActions
                portfolioId={id}
                userCapabilities={user_capabilities}
                handleCopyPortfolio={handleCopyPortfolio}
                canLinkOrderProcesses={canLinkOrderProcesses}
              />
            }
          />
        </CardHeader>
        <StyledCardBody>
          <TextContent className="pf-u-mb-md">
            <Text component={TextVariants.small} className="pf-u-mb-0">
              Last updated&nbsp;
              <DateFormat
                date={props.updated_at || props.created_at}
                type="relative"
              />
            </Text>
            <Text component={TextVariants.small}>by {props.owner}</Text>
          </TextContent>
          <ItemDetails
            {...{ name, imageUrl, ...props }}
            toDisplay={TO_DISPLAY}
          />
        </StyledCardBody>
        <CardFooter>
          {approval_processes > 0 && (
            <Tooltip content={formatMessage(labelMessages.approvalProcessSet)}>
              <StyledClipboardCheckIcon data-testid="approval-set-icon" />
            </Tooltip>
          )}
          &nbsp; &nbsp;
          {shared_groups > 0 && (
            <Tooltip
              content={formatMessage(labelMessages.shared, {
                count: shared_groups
              })}
            >
              <StyledShareIcon data-testid="share-icon" />
            </Tooltip>
          )}
        </CardFooter>
      </StyledCard>
    </StyledGalleryItem>
  );
};

export default PortfolioCard;
