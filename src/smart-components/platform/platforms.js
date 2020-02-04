import React, { Fragment, useEffect, useState } from 'react';
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

const Platforms = () => {
  const [filterValue, setFilterValue] = useState('');
  const { platforms, isLoading } = useSelector(
    ({ platformReducer: { platforms, isPlatformDataLoading } }) => ({
      platforms,
      isLoading: isPlatformDataLoading
    })
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPlatforms());
    scrollToTop();
    insights.chrome.appNavClick({ id: 'platforms', secondaryNav: true });
  }, []);

  const renderEmptyStateDescription = () => (
    <Fragment>
      <TextContent>
        <Text component={TextVariants.p}>
          Configure a source in order to add products to portfolios.
        </Text>
        <Text component={TextVariants.p}>
          To connect to a source, go to{' '}
          <a href={`${document.baseURI}settings/sources`}>Catalog sources</a>
          &nbsp;under Settings.
        </Text>
        <Text component={TextVariants.p}>
          <a href="javascript:void(0)">Learn more in the documentation</a>
        </Text>
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
          title: 'Platforms'
        })}
      />
      <ContentGallery
        {...filteredItems}
        renderEmptyState={() => (
          <ContentGalleryEmptyState
            title="No platforms yet"
            renderDescription={renderEmptyStateDescription}
            Icon={SearchIcon}
          />
        )}
      />
    </Fragment>
  );
};

export default Platforms;
