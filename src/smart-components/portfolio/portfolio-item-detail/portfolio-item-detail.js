import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components/components/Section';

import OrderModal from '../../common/order-modal';
import ItemDetailInfoBar from './item-detail-info-bar';
import ItemDetailDescription from './item-detail-description';
import CopyPortfolioItemModal from './copy-portfolio-item-modal';
import { PortfolioItemDetailToolbar } from './portfolio-item-detail-toolbar';
import TopToolbar from '../../../presentational-components/shared/top-toolbar';
import { getPortfolioItemDetail } from '../../../redux/actions/portfolio-actions';
import { ProductLoaderPlaceholder } from '../../../presentational-components/shared/loader-placeholders';
import { uploadPortfolioItemIcon } from '../../../helpers/portfolio/portfolio-helper';
import useQuery from '../../../utilities/use-query';
import SurveyEditor from '../../survey-editing/survey-editor';
import { PORTFOLIO_ITEM_ROUTE } from '../../../constants/routes';

const requiredParams = ['portfolio', 'source', 'portfolio-item'];

const PortfolioItemDetail = () => {
  const [isOpen, setOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const dispatch = useDispatch();
  const [queryValues, search] = useQuery(requiredParams);
  const { url } = useRouteMatch(PORTFOLIO_ITEM_ROUTE);
  const { portfolioItem, portfolio, source } = useSelector(
    ({ portfolioReducer: { portfolioItem } }) => portfolioItem
  );

  useEffect(() => {
    setIsFetching(true);
    dispatch(
      getPortfolioItemDetail({
        portfolioItem: queryValues['portfolio-item'],
        ...queryValues
      })
    )
      .then(() => setIsFetching(false))
      .catch(() => setIsFetching(false));
  }, [queryValues['portfolio-item']]);

  if (isFetching || Object.keys(portfolioItem).length === 0) {
    return (
      <Section className="global-primary-background full-height">
        <TopToolbar>
          <ProductLoaderPlaceholder />
        </TopToolbar>
      </Section>
    );
  }

  const uploadIcon = (file) => uploadPortfolioItemIcon(portfolioItem.id, file);

  return (
    <Fragment>
      <Switch>
        <Route path={`${url}/edit-survey`}>
          <SurveyEditor
            closeUrl={url}
            search={search}
            uploadIcon={uploadIcon}
            portfolioItem={portfolioItem}
            portfolio={portfolio}
          />
        </Route>
        <Route>
          <Section className="full-height global-primary-background">
            <PortfolioItemDetailToolbar
              uploadIcon={uploadIcon}
              url={url}
              isOpen={isOpen}
              product={portfolioItem}
              setOpen={setOpen}
              isFetching={isFetching}
              availability={source.availability_status}
            />
            <Grid className="pf-u-p-lg">
              <GridItem md={2}>
                <ItemDetailInfoBar
                  product={portfolioItem}
                  portfolio={portfolio}
                  source={source}
                />
              </GridItem>
              <GridItem md={10}>
                <Route path={`${url}/order`}>
                  <OrderModal closeUrl={url} />
                </Route>
                <Route
                  path={`${url}/copy`}
                  render={(props) => (
                    <CopyPortfolioItemModal
                      {...props}
                      search={search}
                      portfolioItemId={portfolioItem.id}
                      portfolioId={portfolio.id}
                      closeUrl={url}
                    />
                  )}
                />
                <ItemDetailDescription
                  product={portfolioItem}
                  url={url}
                  search={search}
                />
              </GridItem>
            </Grid>
          </Section>
        </Route>
      </Switch>
    </Fragment>
  );
};

export default PortfolioItemDetail;
