import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  GridItem,
  TextContent,
  Text,
  Level
} from '@patternfly/react-core';
import ReactJsonView from 'react-json-view';
import { Section } from '@redhat-cloud-services/frontend-components/components/Section';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';

import useQuery from '../../../utilities/use-query';
import { fetchServiceOffering } from '../../../redux/actions/platform-actions';
import { ProductLoaderPlaceholder } from '../../../presentational-components/shared/loader-placeholders';
import CardIcon from '../../../presentational-components/shared/card-icon';
import CatalogBreadcrumbs from '../../common/catalog-breadcrumbs';
import EllipsisTextContainer from '../../../presentational-components/styled-components/ellipsis-text-container';
import { StyledLevelItem } from '../../../presentational-components/styled-components/level';

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
      <Section className="global-primary-background full-height pf-u-p-lg">
        <ProductLoaderPlaceholder />
      </Section>
    );
  }

  return (
    <Section className="global-primary-background full-height">
      <Grid className="pf-u-p-lg">
        <div className="pf-u-mb-sm">
          <CatalogBreadcrumbs />
        </div>
        <GridItem sm={12} className="pf-u-mb-md">
          <Level>
            <StyledLevelItem alignEnd className="pf-l-flex">
              <CardIcon src={source.icon_url} height={64} />
              <TextContent>
                <Text component="h1">{service.name}</Text>
                <Text component="small">Service offering</Text>
              </TextContent>
            </StyledLevelItem>
          </Level>
        </GridItem>
        <GridItem md={2}>
          <TextContent>
            <Text id="source" component="h6">
              <span>Platform</span>
              <br />
              <EllipsisTextContainer>
                <span>{source.name}</span>
              </EllipsisTextContainer>
            </Text>
            <Text id="created_at" component="h6">
              <span>Created</span>
              <br />
              <EllipsisTextContainer>
                <DateFormat type="relative" date={service.created_at} />
              </EllipsisTextContainer>
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
