import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  GridItem,
  TextContent,
  Text,
  Level,
  LevelItem
} from '@patternfly/react-core';
import ReactJsonView from 'react-json-view';
import { Section } from '@redhat-cloud-services/frontend-components';
import { DateFormat } from '@redhat-cloud-services/frontend-components';

import useQuery from '../../../utilities/use-query';
import { fetchServiceOffering } from '../../../redux/actions/platform-actions';
import { ProductLoaderPlaceholder } from '../../../presentational-components/shared/loader-placeholders';
import CardIcon from '../../../presentational-components/shared/card-icon';
import CatalogBreadcrumbs from '../../common/catalog-bread-crumbs';

const requiredParams = ['service', 'platform'];

const ServiceOfferingDetail = () => {
  const [queryValues] = useQuery(requiredParams);
  const [isFetching, setIsFetching] = useState(true);
  const dispatch = useDispatch();
  const { service, source } = useSelector(
    ({ platformReducer: { serviceOffering } }) => serviceOffering
  );

  useEffect(() => {
    setIsFetching(true);
    dispatch(fetchServiceOffering(queryValues.service, queryValues.platform))
      .then(() => setIsFetching(false))
      .catch(() => setIsFetching(false));
  }, [queryValues.service, queryValues.platform]);
  if (isFetching) {
    return (
      <Section
        style={{ backgroundColor: 'white', minHeight: '100%', padding: 32 }}
      >
        <ProductLoaderPlaceholder />
      </Section>
    );
  }

  return (
    <Section style={{ backgroundColor: 'white', minHeight: '100%' }}>
      <Grid className="pf-u-p-lg">
        <div className="pf-u-mb-sm">
          <CatalogBreadcrumbs />
        </div>
        <GridItem sm={12} className="pf-u-mb-md">
          <div style={{ float: 'left' }} className="pf-u-mr-sm">
            <CardIcon src={source.icon_url} height={64} />
          </div>
          <Level>
            <LevelItem>
              <TextContent>
                <Text component="h1">{service.name}</Text>
                <Text component="small">Service offering</Text>
              </TextContent>
            </LevelItem>
          </Level>
        </GridItem>
        <GridItem md={2}>
          <TextContent>
            <Text id="source" component="h6">
              <span>Platform</span>
              <br />
              <div className="elipsis-text-overflow">
                <span>{source.name}</span>
              </div>
            </Text>
            <Text id="created_at" component="h6">
              <span>Created at</span>
              <br />
              <div className="elipsis-text-overflow">
                <DateFormat type="relative" date={service.created_at} />
              </div>
            </Text>
          </TextContent>
        </GridItem>
        <GridItem md={10}>
          <TextContent>
            <Text component="h6">Name</Text>
            <Text id="description" component="p">
              {service.name}
            </Text>
            <Text component="h6">Description</Text>
            <Text id="long_description" component="p">
              {service.description}
            </Text>
            <hr className="pf-c-divider" />
            <Text component="h2">Extra parameters</Text>
            <ReactJsonView src={service.extra} />
          </TextContent>
        </GridItem>
      </Grid>
    </Section>
  );
};

export default ServiceOfferingDetail;
