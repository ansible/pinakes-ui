/* eslint-disable react/prop-types */
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Level,
  LevelItem,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import EllipsisTextContainer from '../styled-components/ellipsis-text-container';
import styled from 'styled-components';
import { CatalogLinkTo } from '../../smart-components/common/catalog-link';

const HeaderTitle = styled(LevelItem)`
  max-width: calc(100% - 80px);
  width: calc(100% - 80px);
`;

const HeaderLevel = styled(Level)`
  width: 100%;
`;

export interface PortfolioCardHeaderProps {
  id: string;
  to: CatalogLinkTo;
  portfolioName?: string;
  portfolio_items: number;
  headerActions: ReactNode;
}
const PortfolioCardHeader: React.ComponentType<PortfolioCardHeaderProps> = ({
  id,
  to,
  portfolioName,
  portfolio_items,
  headerActions = []
}) => (
  <HeaderLevel>
    <HeaderTitle>
      <TextContent>
        <Link to={to} id={`portfolio-link-${id}`}>
          <Text
            title={portfolioName}
            className="pf-u-mb-0"
            component={TextVariants.h3}
          >
            <EllipsisTextContainer>{portfolioName}</EllipsisTextContainer>
          </Text>
        </Link>
      </TextContent>
    </HeaderTitle>
    <Badge isRead>{portfolio_items}</Badge>
    <div onClick={(event) => event.preventDefault()}>{headerActions}</div>
  </HeaderLevel>
);

export default PortfolioCardHeader;
