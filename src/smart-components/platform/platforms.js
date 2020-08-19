import React, { Fragment, useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

import { scrollToTop } from '../../helpers/shared/helpers';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import ContentGallery from '../content-gallery/content-gallery';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import PlatformCard from '../../presentational-components/platform/platform-card';
import { createPlatformsToolbarSchema } from '../../toolbar/schemas/platforms-toolbar.schema';
import ContentGalleryEmptyState from '../../presentational-components/shared/content-gallery-empty-state';
import UserContext from '../../user-context';
import platformsMessages from '../../messages/platforms.messages';
import useFormatMessage from '../../utilities/use-format-message';

const Platforms = () => {
  const formatMessage = useFormatMessage();
  const [filterValue, setFilterValue] = useState('');
  const { platforms, isLoading } = useSelector(
    ({ platformReducer: { platforms, isPlatformDataLoading } }) => ({
      platforms,
      isLoading: isPlatformDataLoading
    })
  );
  const dispatch = useDispatch();
  const {
    userIdentity: {
      identity: {
        user: { is_org_admin }
      }
    }
  } = useContext(UserContext);

  useEffect(() => {
    dispatch(fetchPlatforms());
    scrollToTop();
    insights.chrome.appNavClick({ id: 'platforms', secondaryNav: true });
  }, []);

  const renderEmptyStateDescription = () => (
    <Fragment>
      <TextContent>
        <Text component={TextVariants.p}>
          {formatMessage(platformsMessages.configureSourceTitle)}
        </Text>
        {is_org_admin ? (
          <Text component={TextVariants.p}>
            {formatMessage(platformsMessages.connectSource, {
              // eslint-disable-next-line react/display-name
              a: (chunks) => (
                <a href={`${document.baseURI}settings/sources`}>{chunks}</a>
              )
            })}
          </Text>
        ) : (
          <Text>{formatMessage(platformsMessages.contactAdmin)}</Text>
        )}
      </TextContent>
    </Fragment>
  );
  const filteredItems = {
    items: platforms
      .filter(({ name }) =>
        name.toLowerCase().includes(filterValue.toLowerCase())
      )
      .map((item) => <PlatformCard key={item.id} {...item} />),
    isLoading: isLoading && platforms.length === 0
  };
  return (
    <Fragment>
      <ToolbarRenderer
        schema={createPlatformsToolbarSchema({
          onFilterChange: (value) => setFilterValue(value),
          searchValue: filterValue,
          title: formatMessage(platformsMessages.title)
        })}
      />
      <ContentGallery
        {...filteredItems}
        renderEmptyState={() => (
          <ContentGalleryEmptyState
            title={formatMessage(platformsMessages.noPlatforms)}
            renderDescription={renderEmptyStateDescription}
            Icon={SearchIcon}
          />
        )}
      />
    </Fragment>
  );
};

export default Platforms;
