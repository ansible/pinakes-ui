import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardFooter,
  GalleryItem
} from '@patternfly/react-core';

import { CATALOG_API_BASE } from '../../utilities/constants';
import CardIcon from '../../presentational-components/shared/card-icon';
import CardCheckbox from '../../presentational-components/shared/card-checkbox';
import ServiceOfferingCardBody from '../../presentational-components/shared/service-offering-body';

const PortfolioItem = (props) => (
  <GalleryItem>
    <div
      className={`${
        props.removeInProgress && props.isSelected
          ? 'portfolio-item-progress'
          : ''
      } `}
    >
      {props.removeInProgress && props.isSelected && (
        <Card className="content-gallery-card progress-overlay" />
      )}
      <Card className="content-gallery-card">
        <CardHeader className="card_header">
          {props.isSelectable && (
            <CardCheckbox
              handleCheck={() => props.onSelect(props.id)}
              isChecked={props.isSelected}
              id={props.id}
            />
          )}
          <CardIcon
            src={`${CATALOG_API_BASE}/portfolio_items/${props.id}/icon`}
            platformId={props.service_offering_source_ref}
          />
        </CardHeader>
        <ServiceOfferingCardBody
          to={{
            pathname: props.orderUrl,
            search: `portfolio=${props.portfolio_id}&source=${props.service_offering_source_ref}`
          }}
          {...props}
        />
        <CardFooter></CardFooter>
      </Card>
    </div>
  </GalleryItem>
);

PortfolioItem.propTypes = {
  id: PropTypes.string,
  platformId: PropTypes.string,
  service_offering_source_ref: PropTypes.string,
  isSelectable: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  orderUrl: PropTypes.string,
  removeInProgress: PropTypes.bool,
  portfolio_id: PropTypes.string
};

export default PortfolioItem;
