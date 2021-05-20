/* eslint-disable react/prop-types */
import React, { useReducer } from 'react';
import {
  CardHeader,
  CardFooter,
  GalleryItem,
  Text,
  TextVariants,
  TextContent,
  Label,
  Button,
  Tooltip
} from '@patternfly/react-core';
import ItemDetails, {
  HeaderLevel,
  HeaderTitle,
  ItemDetailsProps
} from '../shared/card-common';

import { PLATFORM_TEMPLATES_ROUTE } from '../../constants/routes';
import EllipsisTextContainer from '../styled-components/ellipsis-text-container';
import CatalogLink from '../../smart-components/common/catalog-link';
import { StyledCard } from '../styled-components/styled-gallery';
import { StyledCardBody } from '../styled-components/card';
import CardIcon from '../shared/card-icon';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import labelMessages from '../../messages/labels.messages';
import useFormatMessage from '../../utilities/use-format-message';
import { SyncAltIcon } from '@patternfly/react-icons';
import { refreshPlatform } from '../../redux/actions/platform-actions';
import platformsMessages from '../../messages/platforms.messages';
import { useDispatch } from 'react-redux';
import { delay } from '../../helpers/shared/helpers';

const TO_DISPLAY = ['description', 'modified'];

export interface PlatformInfo {
  version?: string;
  ansible_version?: string;
}

export interface PlatformCardProps extends ItemDetailsProps {
  name: string;
  id: string;
  availability_status?: string;
  last_successful_refresh_at?: string;
  refresh_started_at?: string;
  refresh_finished_at?: string;
  info?: PlatformInfo;
  source_type_id: string;
  imageUrl: string;
}

const initialState = {
  isFetching: false
};

const platformCardState = (state: any, action: { type: any; payload: any }) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
  }

  return state;
};

const PlatformCard: React.ComponentType<PlatformCardProps> = ({
  name,
  id,
  updateData,
  ...props
}) => {
  const formatMessage = useFormatMessage();
  const dispatch = useDispatch();

  const [{ isFetching }, stateDispatch] = useReducer(
    platformCardState,
    initialState
  );
  const handleRefreshPlatform = (platformId: string) => {
    stateDispatch({ type: 'setFetching', payload: true });
    Promise.resolve(dispatch(refreshPlatform(platformId))).then(async () => {
      await delay(10000);
      stateDispatch({ type: 'setFetching', payload: false });
      updateData();
    });
  };

  return (
    <GalleryItem>
      <StyledCard key={id} ouiaId={`platform-${id}`}>
        <CardHeader>
          <HeaderLevel>
            <HeaderTitle>
              <CardIcon height={40} sourceId={id} />
            </HeaderTitle>
            <Tooltip
              content={
                <Text>{formatMessage(platformsMessages.refreshTooltip)}</Text>
              }
            >
              <Button
                id={`refresh-platform-${id}`}
                ouiaId={`refresh-platform-${id}`}
                variant="link"
                onClick={() => handleRefreshPlatform(id)}
                isDisabled={isFetching}
              >
                {isFetching ? (
                  <SyncAltIcon key={`refresh-${id}`} color="grey" />
                ) : (
                  <SyncAltIcon key={`refresh-${id}`} color="blue" />
                )}
              </Button>
            </Tooltip>
          </HeaderLevel>
        </CardHeader>
        <StyledCardBody>
          <TextContent>
            <CatalogLink
              pathname={PLATFORM_TEMPLATES_ROUTE}
              searchParams={{ platform: id }}
            >
              <Text
                title={name}
                className="pf-u-mb-0"
                component={TextVariants.h3}
              >
                <EllipsisTextContainer>{name}</EllipsisTextContainer>
              </Text>
            </CatalogLink>
            {isFetching ? (
              <TextContent className="pf-u-mb-md">
                <Text component={TextVariants.small} className="pf-u-mb-0">
                  Retrieving data.... &nbsp;
                </Text>
              </TextContent>
            ) : (
              props.last_successful_refresh_at && (
                <TextContent className="pf-u-mb-md">
                  <Text component={TextVariants.small} className="pf-u-mb-0">
                    Last refreshed &nbsp;
                    <DateFormat
                      date={props.last_successful_refresh_at}
                      type="relative"
                    />
                  </Text>
                </TextContent>
              )
            )}
            {props.info && (
              <TextContent className="pf-u-mb-md">
                <Text component={TextVariants.small} className="pf-u-mb-0">
                  {formatMessage(platformsMessages.platformVersion)}
                </Text>
                <Text component={TextVariants.small} className="pf-u-mb-0">
                  {props?.info?.version}
                </Text>
                <Text component={TextVariants.small} className="pf-u-mb-0">
                  {formatMessage(platformsMessages.ansibleVersion)}
                </Text>
                <Text component={TextVariants.small} className="pf-u-mb-0">
                  {props?.info?.ansible_version}
                </Text>
              </TextContent>
            )}
          </TextContent>
          <ItemDetails {...{ name, ...props }} toDisplay={TO_DISPLAY} />
        </StyledCardBody>
        <CardFooter>
          <Label
            variant="filled"
            color={props.availability_status === 'available' ? 'green' : 'red'}
          >
            {props.availability_status === 'available'
              ? formatMessage(labelMessages.available)
              : formatMessage(labelMessages.notAvailable)}
          </Label>
        </CardFooter>
      </StyledCard>
    </GalleryItem>
  );
};

export default PlatformCard;
