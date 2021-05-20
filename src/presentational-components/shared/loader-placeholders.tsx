/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';
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
import actionMessages from '../../messages/actions.messages';
import formsMessages from '../../messages/forms.messages';
import useFormatMessage from '../../utilities/use-format-message';

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

const SkeletonContainer = styled.div<{
  width?: number | string;
  height?: number | string;
  secondaryColor?: string;
}>`
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

export interface CardLoaderProps {
  items?: number;
}
export const CardLoader: React.ComponentType<CardLoaderProps> = ({
  items = 13
}) => (
  <Grid hasGutter>
    <GridItem sm={12}>
      <Section type="content">
        <Gallery hasGutter>
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
      </Section>
    </GridItem>
  </Grid>
);

export const AppPlaceholder: React.ElementType = () => (
  <section className="pf-u-m-0 pf-u-p-0 pf-l-page__main-section pf-c-page__main-section">
    <Skeleton height={32} className="pf-u-p-lg global-primary-background" />
    <div className="pf-u-mt-lg">
      <Bullseye>
        <Spinner />
      </Bullseye>
    </div>
  </section>
);

export const ToolbarTitlePlaceholder: React.ElementType = () => (
  <Skeleton height={30} />
);

const ProducLoaderColumn = styled.div`
  width: 100%;
  max-width: 250px;
`;

export const ProductLoaderPlaceholder: React.ElementType = () => (
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

export interface IconPlaceholderProps {
  height: number;
}
export const IconPlaceholder: React.ElementType<IconPlaceholderProps> = ({
  height
}) => (
  <svg height={height} width={height}>
    <circle cx={height / 2} cy={height / 2} r={height / 2} fill="#ecebeb" />
  </svg>
);

export const FormItemLoader: React.ElementType = () => (
  <Skeleton height={38} className="pf-u-mb-lg" />
);

export const ShareLoader: React.ElementType = () => {
  const formatMessage = useFormatMessage();
  return (
    <Form>
      <TextContent>
        <Text component={TextVariants.small}>
          {formatMessage(formsMessages.inviteGroup)}
        </Text>
      </TextContent>
      <FormGroup fieldId="1">
        <FormItemLoader />
      </FormGroup>
      <TextContent>
        <Text component={TextVariants.small}>
          {formatMessage(formsMessages.groupsAccess)}
        </Text>
      </TextContent>
      <FormGroup fieldId="3">
        <FormItemLoader />
      </FormGroup>
      <FormGroup fieldId="4">
        <FormItemLoader />
      </FormGroup>
    </Form>
  );
};

export const WorkflowLoader: React.ElementType = () => {
  const formatMessage = useFormatMessage();
  return (
    <Form>
      <FormGroup fieldId="2">
        <FormItemLoader />
      </FormGroup>
      <ActionGroup>
        <Button variant="primary" isDisabled>
          {formatMessage(actionMessages.save)}
        </Button>
      </ActionGroup>
    </Form>
  );
};

export interface ListLoaderProps {
  items?: number;
}
export const ListLoader: React.ElementType<ListLoaderProps> = ({
  items = 5
}) => (
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

export const OrderDetailToolbarPlaceholder: React.ElementType = () => (
  <Skeleton height={70} />
);

export const PlatformToolbarPlaceholder: React.ElementType = () => (
  <StyledToolbar className="pf-u-pr-lg pf-u-pl-lg pf-u-pb-md pf-u-pt-md">
    <Skeleton height={36} width={300} />
  </StyledToolbar>
);
