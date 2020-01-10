import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ItemDetails from '../shared/card-common';
import { Link } from 'react-router-dom';
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
        component={<Link to={`/portfolios/share/${portfolioId}`}>Share</Link>}
      />,
      <DropdownItem
        key="workflow-portfolio-action"
        component={
          <Link to={`/portfolios/edit-workflow/${portfolioId}`}>
            Set approval
          </Link>
        }
      />,
      <DropdownItem
        key="edit-portfolio-action"
        component={<Link to={`/portfolios/edit/${portfolioId}`}>Edit</Link>}
      />,
      <DropdownItem
        key="remove-portfolio-action"
        component={<Link to={`/portfolios/remove/${portfolioId}`}>Delete</Link>}
      />
    ]}
  />
];

const PortfolioCard = ({ imageUrl, isDisabled, name, id, ...props }) => {
  const [isOpen, setOpen] = useState(false);
  const route = `/portfolios/detail/${id}`;
  return (
    <GalleryItem>
      <div className={isDisabled ? 'portfolio-item-progress' : ''}>
        {isDisabled && (
          <Card className="content-gallery-card progress-overlay" />
        )}
        <Card className="content-gallery-card">
          <CardHeader>
            <PortfolioCardHeader
              route={route}
              portfolioName={name}
              headerActions={createToolbarActions(id, isOpen, setOpen)}
            />
          </CardHeader>
          <CardBody className="pf-u-pl-0 pf-u-pr-0 pf-u-pb-0">
            <Link
              className="card-link pf-u-display-block pf-u-pl-lg pf-u-pr-lg"
              to={route}
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
            </Link>
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
