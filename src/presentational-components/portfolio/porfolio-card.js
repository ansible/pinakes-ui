import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ItemDetails from '../shared/card-common';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  GalleryItem,
  KebabToggle,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components';
import PortfolioCardHeader from './portfolio-card-header';

import './portfolio-card.scss';
import CatalogLink from '../../smart-components/common/catalog-link';

const TO_DISPLAY = ['description'];

const createToolbarActions = (portfolioId, isOpen, setOpen) => [
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
            pathname="/portfolios/share"
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
            pathname="/portfolios/edit-workflow"
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
            pathname="/portfolios/edit"
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
            pathname="/portfolios/remove"
          >
            Delete
          </CatalogLink>
        }
      />
    ]}
  />
];

const PortfolioCard = ({ imageUrl, isDisabled, name, id, ...props }) => {
  const [isOpen, setOpen] = useState(false);
  const to = {
    pathname: '/portfolio',
    search: `?portfolio=${id}`
  };
  return (
    <GalleryItem>
      <div className={isDisabled ? 'portfolio-item-progress' : ''}>
        {isDisabled && (
          <Card className="content-gallery-card progress-overlay" />
        )}
        <Card className="content-gallery-card">
          <CardHeader>
            <PortfolioCardHeader
              to={to}
              portfolioName={name}
              headerActions={createToolbarActions(id, isOpen, setOpen)}
            />
          </CardHeader>
          <CardBody className="pf-u-pl-0 pf-u-pr-0 pf-u-pb-0">
            <CatalogLink
              className="card-link pf-u-display-block pf-u-pl-lg pf-u-pr-lg"
              pathname="/portfolio"
              searchParams={{ portfolio: id }}
            >
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
            </CatalogLink>
          </CardBody>
          <CardFooter />
        </Card>
      </div>
    </GalleryItem>
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
