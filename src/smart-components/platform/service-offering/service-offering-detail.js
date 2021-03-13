import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  GridItem,
  TextContent,
  Text,
  TextVariants,
  Level
} from '@patternfly/react-core';
import ReactJsonView from 'react-json-view';
import { Section } from '@redhat-cloud-services/frontend-components/Section';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import useQuery from '../../../utilities/use-query';
import { fetchServiceOffering } from '../../../redux/actions/platform-actions';
import { ProductLoaderPlaceholder } from '../../../presentational-components/shared/loader-placeholders';
import CardIcon from '../../../presentational-components/shared/card-icon';
import CatalogBreadcrumbs from '../../common/catalog-breadcrumbs';
import { StyledLevelItem } from '../../../presentational-components/styled-components/level';
import labelMessages from '../../../messages/labels.messages';
import platformsMessages from '../../../messages/platforms.messages';
import useFormatMessage from '../../../utilities/use-format-message';

const requiredParams = ['service', 'platform'];

const ServiceOfferingDetail = () => {
  const formatMessage = useFormatMessage();
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
      <Grid hasGutter className="pf-u-p-lg">
        <div className="pf-u-mb-sm">
          <CatalogBreadcrumbs />
        </div>
        <GridItem sm={12} className="pf-u-mb-md">
          <Level>
            <StyledLevelItem grow alignStart className="pf-l-flex">
              <CardIcon src={source.icon_url} height={64} />
              <TextContent>
                <Text component="h1">{service.name}</Text>
                <Text component="small">
                  {formatMessage(platformsMessages.offeringTitle)}
                </Text>
              </TextContent>
            </StyledLevelItem>
          </Level>
        </GridItem>
        <GridItem md={3} lg={2}>
          <TextContent>
            <Text className="font-14">
              {formatMessage(labelMessages.platform)}
            </Text>
            <Text
              id="source"
              className="overflow-wrap"
              component={TextVariants.p}
            >
              {source.name}
            </Text>
            <Text className="font-14">
              {formatMessage(labelMessages.created)}
            </Text>
            <Text
              id="created_at"
              className="overflow-wrap"
              component={TextVariants.p}
            >
              <DateFormat type="relative" date={service.created_at} />
            </Text>
          </TextContent>
        </GridItem>
        <GridItem md={9} lg={10}>
          <TextContent>
            <Text className="font-14">{formatMessage(labelMessages.name)}</Text>
            <Text id="description" component={TextVariants.p}>
              {service.name}
            </Text>
            <Text className="font-14">
              {formatMessage(labelMessages.description)}
            </Text>
            <Text id="long_description" component={TextVariants.p}>
              {service.description}
            </Text>
            <hr className="pf-c-divider" />
            <Text component="h2">
              {formatMessage(platformsMessages.offeringParameters)}
            </Text>
            <ReactJsonView src={service.extra} />
          </TextContent>
        </GridItem>
      </Grid>
    </Section>
  );
};

export default ServiceOfferingDetail;
