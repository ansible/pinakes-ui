import React from 'react';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';
import platformsMessages from '../../messages/platforms.messages';
import statesMessages from '../../messages/states.messages';
import useFormatMessage from '../../utilities/use-format-message';
import { useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  TextVariants
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';

const platformDetails = () => {
  const formatMessage = useFormatMessage();
  const platform = useSelector(
    ({ platformReducer: { selectedPlatform } }) => selectedPlatform
  );

  return (
    <Section type="content">
      <Card>
        <CardBody>
          <TextContent>
            <Text className="pf-u-mb-md" component={TextVariants.h2}>
              {formatMessage(platformsMessages.platformSummary)}
            </Text>
            <TextList component={TextListVariants.dl}>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(platformsMessages.platformVersion)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                {platform?.info?.version}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(platformsMessages.ansibleVersion)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                {platform?.info?.ansible_version}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(platformsMessages.dateAdded)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                <DateFormat date={platform?.created_at} />
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(platformsMessages.mqttClientId)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                {platform?.mqtt_client_id}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(platformsMessages.refreshState)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                {platform?.refresh_state}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(platformsMessages.refreshStarted)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                <DateFormat
                  date={platform?.refresh_started_at}
                  variant="relative"
                />
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(platformsMessages.refreshFinished)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                <DateFormat
                  date={platform.refresh_finished_at}
                  variant="relative"
                />
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(platformsMessages.lastSuccessfulRefresh)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                <DateFormat
                  date={platform?.last_successful_refresh_at}
                  variant="relative"
                />
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(platformsMessages.lastChecked)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                <DateFormat
                  date={platform?.last_checked_at}
                  variant="relative"
                />
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(platformsMessages.lastAvailable)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                <DateFormat
                  date={platform?.last_available_at}
                  variant="relative"
                />
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(platformsMessages.enabled)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                {platform?.enabled}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {formatMessage(platformsMessages.availabilityStatus)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                {platform?.availability_status}
              </TextListItem>
            </TextList>
          </TextContent>
        </CardBody>
      </Card>{' '}
    </Section>
  );
};

export default platformDetails;
