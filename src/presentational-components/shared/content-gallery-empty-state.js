import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import CatalogLink from '../../smart-components/common/catalog-link';

const ContentGalleryEmptyState = ({
  title,
  Icon,
  description,
  PrimaryAction,
  renderDescription
}) => (
  <div className="pf-u-mt-xl">
    <EmptyState className="pf-u-ml-auto pf-u-mr-auto">
      <EmptyStateIcon icon={Icon} />
      <TextContent>
        <Text component={TextVariants.h1}>{title}</Text>
      </TextContent>
      <EmptyStateBody>
        {description}
        {renderDescription()}
      </EmptyStateBody>
      <EmptyStateSecondaryActions>
        {PrimaryAction && <PrimaryAction />}
      </EmptyStateSecondaryActions>
    </EmptyState>
  </div>
);

ContentGalleryEmptyState.defaultProps = {
  renderDescription: () => null
};

ContentGalleryEmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  Icon: PropTypes.any.isRequired,
  description: PropTypes.string,
  PrimaryAction: PropTypes.any,
  renderDescription: PropTypes.func
};

export default ContentGalleryEmptyState;

export const EmptyStatePrimaryAction = ({
  url,
  label,
  hasPermission = false,
  id
}) =>
  hasPermission && (
    <CatalogLink id={id} pathname={url} preserveSearch>
      <Button variant="primary">{label}</Button>
    </CatalogLink>
  );

EmptyStatePrimaryAction.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string,
  hasPermission: PropTypes.bool
};
