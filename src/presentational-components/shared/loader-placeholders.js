import React, { Fragment } from 'react';
import ContentLoader, { List } from 'react-content-loader';
import PropTypes from 'prop-types';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { Spinner } from '@redhat-cloud-services/frontend-components/components/Spinner';
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
  GalleryItem,
  Form,
  FormGroup,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';

export const CardLoader = ({ items, ...props }) => (
  <Grid gutter="md">
    <GridItem sm={12} className="pf-u-p-md">
      <Gallery gutter="md">
        {[...Array(items)].map((_item, index) => (
          <GalleryItem key={index}>
            <Card style={{ height: 350 }}>
              <CardBody>
                <ContentLoader
                  height={160}
                  width={300}
                  speed={2}
                  primaryColor="#f3f3f3"
                  secondaryColor="#ecebeb"
                  {...props}
                >
                  <rect x="2" y="99" rx="3" ry="3" width="300" height="6.4" />
                  <rect
                    x="2"
                    y="119.72"
                    rx="3"
                    ry="3"
                    width="290"
                    height="5.76"
                  />
                  <rect x="2" y="139" rx="3" ry="3" width="201" height="6.4" />
                  <rect
                    x="-2.16"
                    y="0.67"
                    rx="0"
                    ry="0"
                    width="271.6"
                    height="82.74"
                  />
                  <rect
                    x="136.84"
                    y="37.67"
                    rx="0"
                    ry="0"
                    width="6"
                    height="3"
                  />
                </ContentLoader>
              </CardBody>
            </Card>
          </GalleryItem>
        ))}
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
    <GridItem sm={12}>
      <ContentLoader
        height={16}
        width={300}
        speed={2}
        primaryColor="#FFFFFF"
        secondaryColor="#FFFFFF"
        {...props}
      >
        <rect x="0" y="0" rx="0" ry="0" width="420" height="16" />
      </ContentLoader>
    </GridItem>
    <GridItem sm={12} style={{ paddingLeft: 16, paddingRight: 16 }}>
      <CardLoader items={items} />
    </GridItem>
  </Grid>
);

PortfolioLoader.propTypes = {
  items: PropTypes.number
};

PortfolioLoader.defaultProps = {
  items: 5
};

export const AppPlaceholder = (props) => (
  <Main className="pf-u-m-0 pf-u-p-0">
    <ContentLoader
      height={16}
      width={300}
      speed={2}
      primaryColor="#FFFFFF"
      secondaryColor="#FFFFFF"
      {...props}
    >
      <rect x="0" y="0" rx="0" ry="0" width="420" height="10" />
    </ContentLoader>
    <div>
      <Bullseye>
        <Spinner />
      </Bullseye>
    </div>
  </Main>
);

export const ToolbarTitlePlaceholder = (props) => (
  <ContentLoader
    height={21}
    width={200}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="200" height="21" />
  </ContentLoader>
);

export const ProductLoaderPlaceholder = (props) => (
  <Fragment>
    <ContentLoader
      height={15}
      width={200}
      speed={2}
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb"
      {...props}
    >
      <rect x="0" y="0" rx="0" ry="0" width="200" height="10" />
    </ContentLoader>
    <div style={{ width: 300 }}>
      <List />
      <List speed={3} />
      <List />
    </div>
  </Fragment>
);

export const IconPlaceholder = ({ height, ...props }) => (
  <svg height={height} width={height}>
    <circle cx={height / 2} cy={height / 2} r={height / 2} fill="#ecebeb" />
  </svg>
);

IconPlaceholder.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

IconPlaceholder.defaultProps = {
  height: '40'
};

const FormItemLoader = () => (
  <ContentLoader
    height={36}
    width={400}
    speed={2}
    primaryColor="#ffffff"
    secondaryColor="#ecebeb"
  >
    <rect x="0" y="0" rx="0" ry="0" width="400" height="36" />
  </ContentLoader>
);

export const ShareLoader = () => (
  <Form>
    <TextContent>
      <Text component={TextVariants.small}>Invite group</Text>
    </TextContent>
    <FormGroup fieldId="1">
      <FormItemLoader />
    </FormGroup>
    <TextContent>
      <Text component={TextVariants.small}>Groups with access</Text>
    </TextContent>
    <FormGroup fieldId="3">
      <FormItemLoader />
    </FormGroup>
    <FormGroup fieldId="4">
      <FormItemLoader />
    </FormGroup>
  </Form>
);

export const WorkflowLoader = () => (
  <Form>
    <FormGroup fieldId="1">
      <TextContent>
        <Text component={TextVariants.medium}>Approval workflow</Text>
      </TextContent>
    </FormGroup>
    <FormGroup fieldId="2">
      <FormItemLoader />
    </FormGroup>
  </Form>
);

export const ListLoader = ({ items, ...props }) => (
  <DataList aria-label="list-loader" aria-labelledby="datalist-placeholder">
    {[...Array(items)].map((_item, index) => (
      <DataListItem key={index} aria-labelledby="datalist-item-placeholder">
        <DataListItemRow aria-label="datalist-item-placeholder-row">
          <DataListItemCells
            dataListCells={[
              <DataListCell key="1">
                <ContentLoader
                  height={12}
                  width={300}
                  speed={2}
                  primaryColor="#FFFFFF"
                  secondaryColor="#ecebeb"
                  {...props}
                >
                  <rect x="0" y="0" rx="0" ry="0" width="300" height="12" />
                </ContentLoader>
              </DataListCell>
            ]}
          />
        </DataListItemRow>
      </DataListItem>
    ))}
  </DataList>
);

ListLoader.propTypes = {
  items: PropTypes.number
};

ListLoader.defaultProps = {
  items: 5
};

export const OrderDetailToolbarPlaceholder = () => (
  <div>
    <ContentLoader height={20} width={300}>
      <rect x="0" y="0" rx="0" ry="0" width="300" height="12" />
    </ContentLoader>
  </div>
);
