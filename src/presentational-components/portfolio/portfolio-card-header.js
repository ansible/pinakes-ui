import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Level, LevelItem, Text, TextContent, TextVariants } from '@patternfly/react-core';

import './portfolio-card.scss';

const PortfolioCardHeader = ({ route, portfolioName, headerActions }) => (
  <Level>
    <LevelItem className="portfolio-card-header-title" style={ { flexGrow: 1 } }>
      <Link to={ route }>
        <TextContent>
          <Text title={ portfolioName } className="elipsis-text-overflow pf-u-mb-0" component={ TextVariants.h3 }>{ portfolioName }</Text>
        </TextContent>
      </Link>
    </LevelItem>
    <LevelItem onClick={ event => event.preventDefault() }>
      { headerActions }
    </LevelItem>
  </Level>
);

PortfolioCardHeader.propTypes = {
  portfolioName: PropTypes.string.isRequired,
  headerActions: PropTypes.arrayOf(PropTypes.node),
  route: PropTypes.string.isRequired
};

PortfolioCardHeader.defaultProps = {
  headerActions: []
};

export default PortfolioCardHeader;
