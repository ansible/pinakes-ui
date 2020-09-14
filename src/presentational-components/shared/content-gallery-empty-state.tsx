/* eslint-disable react/prop-types */
import React, { ReactNode } from 'react';
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

export interface ContentGalleryEmptyStateProps {
  title: string;
  Icon: React.ComponentType;
  description?: ReactNode;
  PrimaryAction?: React.ComponentType;
  renderDescription?: () => ReactNode;
}

const ContentGalleryEmptyState: React.ComponentType<ContentGalleryEmptyStateProps> = ({
  title,
  Icon,
  description,
  PrimaryAction,
  renderDescription = () => null
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

export default ContentGalleryEmptyState;

export interface EmptyStatePrimaryAction {
  url: string;
  label: string;
  hasPermission?: boolean;
  id?: string;
}
export const EmptyStatePrimaryAction: React.ComponentType<EmptyStatePrimaryAction> = ({
  url,
  label,
  hasPermission = false,
  id
}) =>
  hasPermission ? (
    <CatalogLink id={id} pathname={url} preserveSearch>
      <Button variant="primary">{label}</Button>
    </CatalogLink>
  ) : null;
