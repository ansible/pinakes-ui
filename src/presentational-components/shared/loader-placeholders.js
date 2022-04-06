import React from 'react';
import PropTypes from 'prop-types';
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  Grid,
  GridItem,
  Form,
  FormGroup,
  Stack,
  StackItem,
  Card,
  CardBody, PageSection, EmptyStatePrimary, Button, Skeleton, Bullseye, EmptyState, EmptyStateIcon, Title, EmptyStateBody
} from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

import clsx from 'clsx';

import './loader.scss';
import { TopToolbar, TopToolbarTitle } from './top-toolbar';
import { Link } from 'react-router-dom';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

const Loader = ({ width = '100%', height = '100%', className, ...props }) => (
  <span
    { ...props }
    className={ clsx('ins__approval__loader', className) }
    style={ { width, height } }
  />
);

Loader.propTypes = {
  width: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  height: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  className: PropTypes.string
};

export const DataListLoader = ({ items }) => (
  <DataList aria-label="data-list-loader" aria-labelledby="datalist-placeholder">
    { [ ...Array(items) ].map((_item, index) => (
      <DataListItem key={ index } aria-labelledby="datalist-item-placeholder">
        <DataListItemRow aria-label="datalist-item-placeholder-row">
          <DataListItemCells dataListCells={ [
            <DataListCell key="1">
              <Loader height={ 64 } width='100%' />
            </DataListCell>
          ] }
          />
        </DataListItemRow>
      </DataListItem>
    )) }
  </DataList>
);

DataListLoader.propTypes = {
  items: PropTypes.number
};

DataListLoader.defaultProps = {
  items: 5
};

export const RequestLoader = () => (
  <div className="ins__approval__request_loader">
    <Grid hasGutter>
      <GridItem md={ 4 } lg={ 3 } className="info-bar">
        <Stack hasGutter>
          <StackItem>
            <Card>
              <CardBody>
                <Loader className="pf-u-mb-sm ins__approval__request_loader-card" />
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </GridItem>
      <GridItem md={ 8 } lg={ 9 } className="detail-pane pf-u-p-lg">
        <DataListLoader/>
      </GridItem>
    </Grid>
  </div>
);

export const AppPlaceholder = () => (
  <PageSection className="pf-u-p-0 pf-u-ml-0">
    <TopToolbar className="ins__approval__placeholder_toolbar">
      <TopToolbarTitle/>
    </TopToolbar>
    <Section type="content">
      <DataListLoader />
    </Section>
  </PageSection>
);

export const FormItemLoader = () => <Loader height={ 64 } width='100%' />;

export const WorkflowInfoFormLoader = () => (
  <Form>
    <FormGroup fieldId="1">
      <FormItemLoader />
    </FormGroup>
    <FormGroup fieldId="2">
      <FormItemLoader />
    </FormGroup>
  </Form>
);

export const ToolbarTitlePlaceholder = () => <Loader height={ 32 } width={ 200 } className="pf-u-mb-md" />;

export const UnknownErrorPlaceholder = () => (
  <section className="pf-u-m-0 pf-u-p-0 pf-l-page__main-section pf-c-page__main-section">
    <Skeleton height={ 32 } className="pf-u-p-lg global-primary-background" />
    <div className="pf-u-mt-lg">
      <Bullseye className="chr-c-error-component">
        <EmptyState>
          <EmptyStateIcon
            color="var(--pf-global--danger-color--200)"
            icon={ ExclamationCircleIcon }
          />
          <Title size="lg" headingLevel="h1">
            Something went wrong
          </Title>
          <EmptyStateBody>
            <p>
              There was a problem processing the request. Try reloading the
              page. If the problem persists, contact{ ' ' }
              <a
                target="_blank"
                href="https://access.redhat.com/support"
                rel="noreferrer"
              >
                Red Hat support
              </a>{ ' ' }
              or check our{ ' ' }
              <a
                href="https://status.redhat.com/"
                target="_blank"
                rel="noreferrer"
              >
                status page
              </a>{ ' ' }
              for known outages.
            </p>
          </EmptyStateBody>
          <EmptyStatePrimary>
            <Button
              component={ () => <Link to="/">Return to home page</Link> }
              variant="primary"
            />
          </EmptyStatePrimary>
        </EmptyState>
      </Bullseye>
    </div>
  </section>
);

