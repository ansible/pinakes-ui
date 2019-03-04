import React from 'react';
import propTypes from 'prop-types';
import ItemDetails from '../Shared/CardCommon';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Button, GalleryItem } from '@patternfly/react-core';
import { EditAltIcon, TrashIcon } from '@patternfly/react-icons';
import PortfolioCardHeader from './portfolio-card-header';
import './portfoliocard.scss';

const TO_DISPLAY = [ 'description', 'modified' ];
const ICON_FILL = 'white';

const createToolbarActions = (portfolioName, portfolioId) => [
  <Link key="edit-portfolio-action" to={ `/portfolios/edit/${portfolioId}` }>
    <Button
      variant="plain"
      aria-label={ `edit-portfolio-${portfolioName}` }
    >
      <EditAltIcon fill={ ICON_FILL } />
    </Button>
  </Link>,
  <Link key="remove-portfolio-action" to={ `/portfolios/remove/${portfolioId}` }>
    <Button
      key="remove-portfolio-action"
      variant="plain"
      aria-label={ `remove-portfolio-${portfolioName}` }
    >
      <TrashIcon fill={ ICON_FILL } />
    </Button>
  </Link>
];

const PortfolioCard = ({ imageUrl, name, id, ...props }) => (
  <GalleryItem>
    <Card className="content-gallery-card">
      <Link className="card-link" to={ `/portfolios/detail/${id}` }>
        <CardHeader className="card-image-header">
          <PortfolioCardHeader
            portfolioName={ name }
            headerActions={ createToolbarActions(name, id) }
          />
        </CardHeader>
        <CardBody>
          <ItemDetails { ...{ name, imageUrl, ...props } } toDisplay={ TO_DISPLAY } />
        </CardBody>
        <CardFooter/>
      </Link>
    </Card>
  </GalleryItem>
);

PortfolioCard.propTypes = {
  history: propTypes.object,
  imageUrl: propTypes.string,
  name: propTypes.string,
  id: propTypes.string
};

export default PortfolioCard;
