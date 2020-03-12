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
  TextVariants
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import PortfolioCardHeader from './portfolio-card-header';

import CatalogLink from '../../smart-components/common/catalog-link';
import {
  SHARE_PORTFOLIO_ROUTE,
  EDIT_PORTFOLIO_WORKFLOW_ROUTE,
  EDIT_PORTFOLIO_ROUTE,
  REMOVE_PORTFOLIO_ROUTE,
  PORTFOLIO_ROUTE
} from '../../constants/routes';
import {
  StyledCard,
  StyledGalleryItem
} from '../styled-components/styled-gallery';
import { StyledCardBody } from '../styled-components/card';

const TO_DISPLAY = ['description'];

const createToolbarActions = (portfolioId, isOpen, setOpen, userPermissions) => [
  <Dropdown
    key="portfolio-dropdown"
    isOpen={isOpen}
    isPlain
    onSelect={() => setOpen(false)}
    position={DropdownPosition.right}
    toggle={<KebabToggle onToggle={(isOpen) => setOpen(isOpen)} />}
    dropdownItems={[
      <DropdownItem
        key="share-portfolio-action"
        component={
          <CatalogLink
            searchParams={{ portfolio: portfolioId }}
            pathname={SHARE_PORTFOLIO_ROUTE}
          >
            Share
          </CatalogLink>
        }
      />,
      <DropdownItem
        key="workflow-portfolio-action"
        component={
          <CatalogLink
            searchParams={{ portfolio: portfolioId }}
            pathname={EDIT_PORTFOLIO_WORKFLOW_ROUTE}
          >
            Set approval
          </CatalogLink>
        }
      />,
      <DropdownItem
        key="edit-portfolio-action"
        component={
          <CatalogLink
            searchParams={{ portfolio: portfolioId }}
            pathname={EDIT_PORTFOLIO_ROUTE}
          >
            Edit
          </CatalogLink>
        }
      />,
      <DropdownItem
        key="remove-portfolio-action"
        component={
          <CatalogLink
            searchParams={{ portfolio: portfolioId }}
            pathname={REMOVE_PORTFOLIO_ROUTE}
            isActive={hasPermission(userPermissions, ['catalog:portfolio:delete'])}
          >
            Delete
          </CatalogLink>
        }
      />
    ]}
  />
];

const PortfolioCard = ({ imageUrl, isDisabled, name, id, userPermissions, ...props }) => {
  const [isOpen, setOpen] = useState(false);
  const to = {
    pathname: PORTFOLIO_ROUTE,
    search: `?portfolio=${id}`
  };
  return (
    <StyledGalleryItem isDisabled={isDisabled}>
      <StyledCard>
        <CardHeader>
          <PortfolioCardHeader
            to={to}
            portfolioName={name}
            headerActions={createToolbarActions(id, isOpen, setOpen, userPermissions)}
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
        <CardFooter />
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
  isDisabled: PropTypes.bool
};

export default PortfolioCard;
