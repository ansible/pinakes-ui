import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';
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
  TextVariants,
  ActionGroup,
  Button
} from '@patternfly/react-core';
import styled, { keyframes } from 'styled-components';
import { StyledToolbar } from '../styled-components/toolbars';

const wave = keyframes`
  0% {
    transform: translateX(-100%);
  }
  60% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const Skeleton = ({ component: Component = 'span', ...props }) => {
  return (
    <SkeletonContainer {...props}>
      <Component />
    </SkeletonContainer>
  );
};

Skeleton.propTypes = {
  component: PropTypes.string
};

const SkeletonContainer = styled.div`
  & > * {
    position: relative;
    overflow: hidden;
    width: ${({ width }) =>
      width ? `${width}${typeof width === 'number' ? 'px' : ''}` : '100%'};
    height: ${({ height }) =>
      height ? `${height}${typeof height === 'number' ? 'px' : ''}` : '20px'};
    display: block;
    border-radius: 3px;
    background-color: ${({ secondaryColor }) =>
      secondaryColor ? secondaryColor : '#f3f3f3'};
    &:after {
      animation: 2s ${wave} linear 0.5s infinite;
      background: linear-gradient(90deg, transparent, #ecebeb, transparent);
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
      transform: translateX(-100%);
      z-index: 1;
    }
  }
`;

export const CardLoader = ({ items }) => (
  <Grid gutter="md">
    <GridItem sm={12} className="pf-u-p-md">
      <Gallery gutter="md">
        {[...Array(items)].map((_item, index) => (
          <GalleryItem key={index}>
            <Card style={{ height: 350 }}>
              <CardBody>
                <Skeleton height={70} width="85%" className="pf-u-mb-lg" />
                <Skeleton height={5} width="90%" className="pf-u-mb-sm" />
                <Skeleton height={5} width="100%" className="pf-u-mb-sm" />
                <Skeleton height={5} width="76%" className="pf-u-mb-sm" />
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

export const AppPlaceholder = () => (
  <section className="pf-u-m-0 pf-u-p-0 pf-l-page__main-section pf-c-page__main-section">
    <Skeleton height={32} className="pf-u-p-lg global-primary-background" />
    <div className="pf-u-mt-lg">
      <Bullseye>
        <Spinner />
      </Bullseye>
    </div>
  </section>
);

export const ToolbarTitlePlaceholder = () => <Skeleton height={30} />;

const ProducLoaderColumn = styled.div`
  width: 100%;
  max-width: 250px;
`;

export const ProductLoaderPlaceholder = () => (
  <Fragment>
    <Skeleton height={70} className="pf-u-mb-xl" />
    <ProducLoaderColumn>
      {[...Array(3)].map((_, index) => (
        <Fragment key={index}>
          <Skeleton height={8} className="pf-u-mb-sm" />
          <Skeleton height={8} className="pf-u-ml-md pf-u-mb-sm" width="60%" />
          <Skeleton height={8} className="pf-u-ml-md pf-u-mb-sm" width="50%" />
          <Skeleton height={8} className="pf-u-mb-sm" width="80%" />
          <Skeleton height={8} className="pf-u-ml-md pf-u-mb-lg" width="40%" />
        </Fragment>
      ))}
    </ProducLoaderColumn>
  </Fragment>
);

export const IconPlaceholder = ({ height }) => (
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

const FormItemLoader = () => <Skeleton height={38} className="pf-u-mb-lg" />;

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
    <FormGroup fieldId="2" label="Select workflow">
      <FormItemLoader />
    </FormGroup>
    <ActionGroup>
      <Button variant="primary" isDisabled>
        Save
      </Button>
    </ActionGroup>
  </Form>
);

export const ListLoader = ({ items }) => (
  <DataList aria-label="list-loader" aria-labelledby="datalist-placeholder">
    {[...Array(items)].map((_item, index) => (
      <DataListItem key={index} aria-labelledby="datalist-item-placeholder">
        <DataListItemRow aria-label="datalist-item-placeholder-row">
          <DataListItemCells
            dataListCells={[
              <DataListCell key="1">
                <Skeleton height={67} />
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

export const OrderDetailToolbarPlaceholder = () => <Skeleton height={70} />;

export const PlatformToolbarPlaceholder = () => (
  <StyledToolbar className="pf-u-pr-lg pf-u-pl-lg pf-u-pb-md pf-u-pt-md">
    <Skeleton height={36} width={300} />
  </StyledToolbar>
);
