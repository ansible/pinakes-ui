import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, TextContent, Text, TextVariants, Level, LevelItem  } from '@patternfly/react-core';
import { SimpleTableFilter } from '@red-hat-insights/insights-frontend-components';
import TopToolbar from '../../PresentationalComponents/Shared/top-toolbar';
import OrderToolbarItem from '../../PresentationalComponents/Shared/OrderToolbarItem';
import './removeportfolioitems.scss';

const RemovePortfolioItems = ({ portfolioRoute, onRemove, portfolioName }) => (
  <TopToolbar paddingBottom>
    <Level>
      <LevelItem>
        <TextContent>
          <Text component={ TextVariants.h2 }>Remove products: { portfolioName }</Text>
        </TextContent>
      </LevelItem>
      <LevelItem>
        <OrderToolbarItem />
      </LevelItem>
    </Level>
    <Level>
      <LevelItem>
        <SimpleTableFilter buttonTitle="" />
      </LevelItem>
      <LevelItem>
        <Link to={ portfolioRoute }>
          <Button variant="link" aria-label="Cancel removing portfolio items">Cancel</Button>
        </Link>
        <Button variant="danger" aria-label="Remove selected portfolio items" onClick={ onRemove }>Remove</Button>
      </LevelItem>
    </Level>
  </TopToolbar>
);

RemovePortfolioItems.propTypes = {
  onCancel: propTypes.func,
  onRemove: propTypes.func,
  portfolioRoute: propTypes.string,
  portfolioName: propTypes.string
};

export default RemovePortfolioItems;
