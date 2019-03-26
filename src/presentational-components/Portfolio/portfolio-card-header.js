import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextVariants, Toolbar, ToolbarGroup } from '@patternfly/react-core';
import DefaultPortfolioImg from '../../assets/images/default-portfolio.jpg';

import './portfoliocard.scss';

const PortfolioCardHeader = ({ backgroundSrc, portfolioName, headerActions }) => (
  <div className="portfolio-card-header" style={ { backgroundImage: `url(${backgroundSrc})` } }>
    <Toolbar>
      <ToolbarGroup style={ {
        marginLeft: 'auto',
        paddingBottom: 16
      } }>
        { headerActions }
      </ToolbarGroup>
    </Toolbar>
    <Text className="elipsis-text-overflow" component={ TextVariants.h4 }>{ portfolioName }</Text>
  </div>
);

PortfolioCardHeader.propTypes = {
  backgroundSrc: PropTypes.string,
  portfolioName: PropTypes.string.isRequired,
  headerActions: PropTypes.arrayOf(PropTypes.node)
};

PortfolioCardHeader.defaultProps = {
  backgroundSrc: DefaultPortfolioImg,
  headerActions: []
};

export default PortfolioCardHeader;
