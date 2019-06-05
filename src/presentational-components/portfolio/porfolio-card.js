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
      <DropdownItem key="share-portfolio-action">
        <Link to={ `/portfolios/share/${portfolioId}` } className="pf-c-dropdown__menu-item" >
          Share
        </Link>
      </DropdownItem>,
      <DropdownSeparator key="share-portfolio-separator"/>,
      <DropdownItem key="edit-portfolio-action">
        <Link to={ `/portfolios/edit/${portfolioId}` } className="pf-c-dropdown__menu-item" >
          Edit
        </Link>
      </DropdownItem>,
      <DropdownItem key="remove-portfolio-action">
        <Link to={ `/portfolios/remove/${portfolioId}` } className="pf-c-dropdown__menu-item destructive-color">
          Delete
        </Link>
      </DropdownItem>
    ] }/>
];

const PortfolioCard = ({ imageUrl, name, id, ...props }) => {
  const [ isOpen, setOpen ] = useState(false);
  return (
    <GalleryItem>
      <Card className="content-gallery-card">
        <CardHeader>
          <PortfolioCardHeader
            portfolioName={ name }
            headerActions={ createToolbarActions(id, isOpen, setOpen) }
          />
        </CardHeader>
        <CardBody className="pf-u-pl-0 pf-u-pr-0 pf-u-pb-0">
          <Link className="card-link pf-u-display-block pf-u-pl-lg pf-u-pr-lg" to={ `/portfolios/detail/${id}` }>
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
    </GalleryItem>
  );};

PortfolioCard.propTypes = {
  history: PropTypes.object,
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string.isRequired,
  updated_at: PropTypes.string,
  created_at: PropTypes.string.isRequired,
  owner: PropTypes.string
};

export default PortfolioCard;
