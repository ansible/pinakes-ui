import React, { Fragment } from 'react';
import ContentLoader, { List } from 'react-content-loader';
import PropTypes from 'prop-types';
import { Main, Spinner } from '@red-hat-insights/insights-frontend-components';
import {
  Bullseye,
  Card,
  CardBody,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  Grid,
  GridItem,
  Gallery,
  GalleryItem
} from '@patternfly/react-core';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import createOrdersToolbarSchema from '../../toolbar/schemas/orders-toolbar.schema';

export const CardLoader = ({ items, ...props }) => (
  <Grid  gutter="md">
    <GridItem sm={ 12 } style={ { padding: 24 } }>
      <Gallery gutter="md">
        { [ ...Array(items) ].map((_item, index) =>
          <GalleryItem key={ index }>
            <Card style={ { height: 350 } }>
              <CardBody>
                <ContentLoader
                  height={ 160 }
                  width={ 300 }
                  speed={ 2 }
                  primaryColor="#f3f3f3"
                  secondaryColor="#ecebeb"
                  { ...props }
                >
                  <rect x="2" y="99" rx="3" ry="3" width="300" height="6.4" />
                  <rect x="2" y="119.72" rx="3" ry="3" width="290" height="5.76" />
                  <rect x="2" y="139" rx="3" ry="3" width="201" height="6.4" />
                  <rect x="-2.16" y="0.67" rx="0" ry="0" width="271.6" height="82.74" />
                  <rect x="136.84" y="37.67" rx="0" ry="0" width="6" height="3" />
                </ContentLoader>
              </CardBody>
            </Card>
          </GalleryItem>) }
      </Gallery>
    </GridItem>
  </Grid>
);

CardLoader.propTypes = {
  items: PropTypes.number
};

CardLoader.defaultProps = {
  items: 13
};

export const PortfolioLoader = ({ items, ...props }) => (
  <Grid gutter="md">
    <GridItem sm={ 12 }>
      <ContentLoader
        height={ 16 }
        width={ 300 }
        speed={ 2 }
        primaryColor="#FFFFFF"
        secondaryColor="#FFFFFF"
        { ...props }>
        <rect x="0" y="0" rx="0" ry="0" width="420" height="16" />
      </ContentLoader>
    </GridItem>
    <GridItem sm={ 12 } style={ { paddingLeft: 16, paddingRight: 16 } }>
      <CardLoader items={ items } />
    </GridItem>
  </Grid>
);

PortfolioLoader.propTypes = {
  items: PropTypes.number
};

PortfolioLoader.defaultProps = {
  items: 5
};

export const AppPlaceholder = props => (
  <Main style={ { marginLeft: 0, padding: 0 } }>
    <ContentLoader
      height={ 16 }
      width={ 300 }
      speed={ 2 }
      primaryColor="#FFFFFF"
      secondaryColor="#FFFFFF"
      { ...props }>
      <rect x="0" y="0" rx="0" ry="0" width="420" height="10" />
    </ContentLoader>
    <div>
      <Bullseye>
        <Spinner />
      </Bullseye>
    </div>
  </Main>
);

export const ToolbarTitlePlaceholder = props => (
  <ContentLoader
    height={ 21 }
    width={ 200 }
    speed={ 2 }
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    { ...props }
  >
    <rect x="0" y="0" rx="0" ry="0" width="200" height="21" />
  </ContentLoader>
);

export const ProductLoaderPlaceholder = props => (
  <Fragment>
    <ContentLoader
      height={ 15 }
      width={ 200 }
      speed={ 2 }
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb"
      { ...props }
    >
      <rect x="0" y="0" rx="0" ry="0" width="200" height="10" />
    </ContentLoader>
    <div style={ { width: 300 } }>
      <List />
      <List speed={ 3 } />
      <List />
    </div>
  </Fragment>
);

export const IconPlaceholder = props => (
  <div { ...props }>
    <svg height="40" width="40">
      <circle cx="20" cy="20" r="20" fill="#ecebeb" />
    </svg>
  </div>
);

export const ShareLoader = () => (
  <ContentLoader
    height={ 800 }
    width={ 600 }
    speed={ 2 }
    primaryColor="#ffffff"
    secondaryColor="#ecebeb"
  >
    <rect x="290" y="225" rx="0" ry="0" width="0" height="0" />
    <rect x="168" y="187" rx="0" ry="0" width="0" height="0" />
    <rect x="368" y="280" rx="0" ry="0" width="0" height="0" />
    <rect x="28" y="19" rx="0" ry="0" width="518" height="413" />
    <rect x="392" y="380" rx="0" ry="0" width="1" height="60" />
  </ContentLoader>
);

export const OrderLoader = ({ items, ...props }) => (
  <Fragment>
    <ToolbarRenderer schema={ createOrdersToolbarSchema() } />
    <DataList aria-label="orders-placeholder" style={ { margin: 32 } }>
      { [ ...Array(items) ].map((_item, index) => (
        <DataListItem key={ index } aria-label="order-item-placeholder">
          <DataListItemRow>
            <DataListItemCells dataListCells={ [
              <DataListCell key="1">
                <ContentLoader
                  height={ 12 }
                  width={ 300 }
                  speed={ 2 }
                  primaryColor="#FFFFFF"
                  secondaryColor="#ecebeb"
                  { ...props }>
                  <rect x="0" y="0" rx="0" ry="0" width="300" height="12" />
                </ContentLoader>
              </DataListCell>
            ] }
            />
          </DataListItemRow>

        </DataListItem>
      )) }
    </DataList>
  </Fragment>
);

OrderLoader.propTypes = {
  items: PropTypes.number
};

OrderLoader.defaultProps = {
  items: 5
};
