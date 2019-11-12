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
  DropdownSeparator,
  GalleryItem,
  KebabToggle,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import PortfolioCardHeader from './portfolio-card-header';

import './portfolio-card.scss';
import { createModifiedLabel } from '../../helpers/shared/helpers';

const TO_DISPLAY = [ 'description' ];

const createToolbarActions = (portfolioId, isOpen, setOpen) => [
  <Dropdown
    key="portfolio-dropdown"
    isOpen={ isOpen }
    isPlain
    onSelect={ () => setOpen(false) }
    position={ DropdownPosition.right }
    toggle={ <KebabToggle onToggle={ setOpen }/> }
    dropdownItems={ [
      <DropdownItem key="share-portfolio-action" component={ Link } to={ `/portfolios/share/${portfolioId}` }>
          Share
      </DropdownItem>,
      <DropdownSeparator key="workflow-portfolio-separator"/>,
      <DropdownItem key="workflow-portfolio-action" component={ Link } to={ `/portfolios/edit-workflow/${portfolioId}` }>
          Edit approval
      </DropdownItem>,
      <DropdownSeparator key="share-portfolio-separator"/>,
      <DropdownItem key="edit-portfolio-action" component={ Link } to={ `/portfolios/edit/${portfolioId}` }>
          Edit
      </DropdownItem>,
      <DropdownItem
        key="remove-portfolio-action"
        component={ Link }
        to={ `/portfolios/remove/${portfolioId}` }
        className="pf-c-dropdown__menu-item destructive-color"
      >
          Delete
      </DropdownItem>
    ] }/>
];

const PortfolioCard = ({ imageUrl, isDisabled, name, id, ...props }) => {
  const [ isOpen, setOpen ] = useState(false);
  const route = `/portfolios/detail/${id}`;
  return (
    <GalleryItem>
      <div className={ isDisabled ? 'portfolio-item-progress' : '' }>
        { isDisabled && (
          <Card className="content-gallery-card progress-overlay" />
        ) }
        <Card className="content-gallery-card">
          <CardHeader>
            <PortfolioCardHeader
              route={ route }
              portfolioName={ name }
              headerActions={ createToolbarActions(id, isOpen, setOpen) }
            />
          </CardHeader>
          <CardBody className="pf-u-pl-0 pf-u-pr-0 pf-u-pb-0">
            <Link className="card-link pf-u-display-block pf-u-pl-lg pf-u-pr-lg" to={ route }>
              <TextContent>
                <Text component={ TextVariants.small }>
                  { createModifiedLabel(new Date(props.updated_at || props.created_at), props.owner) }
                </Text>
              </TextContent>
              <ItemDetails { ...{ name, imageUrl, ...props } } toDisplay={ TO_DISPLAY } />
            </Link>
          </CardBody>
          <CardFooter/>
        </Card>
      </div>
    </GalleryItem>
  );};

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
