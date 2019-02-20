import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CatItemSvg from '../../assets/images/vendor-openshift.svg';
import ImageWithDefault from '../../PresentationalComponents/Shared/ImageWithDefault';
import { GridItem, Card, CardHeader, CardFooter } from '@patternfly/react-core';
import ServiceOfferingCardBody from '../../PresentationalComponents/Shared/service-offering-body';
import CardCheckbox from '../../PresentationalComponents/Shared/CardCheckbox';
import './portfolioitem.scss';

const PortfolioItem = props => {
  const renderCardContent = () => (
    <Fragment>
      <CardHeader className="card_header">
        { props.isSelectable && <CardCheckbox
          handleCheck={ () => props.onSelect(props.id) }
          isChecked={ props.isSelected }
          id={ props.id } />
        }
        <ImageWithDefault src={ props.imageUrl || CatItemSvg } width="30" height="20" />
      </CardHeader>
      <ServiceOfferingCardBody { ...props }/>
      <CardFooter>
      </CardFooter>
    </Fragment>
  );
  return (
    <GridItem sm={ 6 } md={ 4 } lg={ 4 } xl={ 3 }>
      <Card>
        { props.isSelectable ? renderCardContent() : (
          <Link to={ props.orderUrl } className="card-link" >
            { renderCardContent() }
          </Link>
        ) }
      </Card>
    </GridItem>
  );};

PortfolioItem.propTypes = {
  history: PropTypes.object,
  showModal: PropTypes.func,
  hideModal: PropTypes.func,
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  isSelectable: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  orderUrl: PropTypes.string.isRequired
};

export default PortfolioItem;
