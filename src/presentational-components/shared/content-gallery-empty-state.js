import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';

const ContentGalleryEmptyState = ({
  title,
  Icon,
  description,
  PrimaryAction,
  renderDescription
}) => (
  <Bullseye className="pf-u-mt-xl">
    <EmptyState>
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
  </Bullseye>
);

ContentGalleryEmptyState.defaultProps = {
  renderDescription: () => null
};

ContentGalleryEmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  Icon: PropTypes.any.isRequired,
  description: PropTypes.string.isRequired,
  PrimaryAction: PropTypes.any,
  renderDescription: PropTypes.func
};

export default ContentGalleryEmptyState;

export const EmptyStatePrimaryAction = ({ url, label }) => (
  <Link to={url}>
    <Button variant="secondary">{label}</Button>
  </Link>
);

EmptyStatePrimaryAction.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};
