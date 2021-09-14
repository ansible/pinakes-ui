import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Route, Link, Switch, useLocation } from 'react-router-dom';
import {
  Level,
  LevelItem,
  Text,
  TextContent,
  TextVariants,
  Button,
  Flex,
  Dropdown,
  KebabToggle,
  DropdownItem
} from '@patternfly/react-core';

import DetailToolbarActions from './detail-toolbar-actions';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import CardIcon from '../../../presentational-components/shared/card-icon';
import TopToolbar, {
  TopToolbarTitle
} from '../../../presentational-components/shared/top-toolbar';
import ButtonWithSpinner from '../../../presentational-components/shared/button-with-spinner';
import { StyledLevelItem } from '../../../presentational-components/styled-components/level';
import actionMessages from '../../../messages/actions.messages';
import portfolioMessages from '../../../messages/portfolio.messages';
import BackToProducts from '../../../presentational-components/portfolio/back-to-products';
import { PORTFOLIO_ITEM_ROUTE_EDIT } from '../../../constants/routes';
import useFormatMessage from '../../../utilities/use-format-message';
import { useSelector } from 'react-redux';

const PortfolioItemIconItem = ({ id, sourceId }) => (
  <CardIcon
    src={`${CATALOG_API_BASE}/portfolio_items/${id}/icon`}
    sourceId={sourceId}
    height={64}
  />
);

PortfolioItemIconItem.propTypes = {
  id: PropTypes.string.isRequired,
  sourceId: PropTypes.string.isRequired
};

export const PortfolioItemDetailToolbar = ({
  url,
  isOpen,
  product,
  setOpen,
  isFetching,
  availability,
  userCapabilities,
  orderable,
  fromProducts,
  canLinkOrderProcesses,
  breadcrumbfragments
}) => {
  const formatMessage = useFormatMessage();
  const { pathname } = useLocation();

  return (
    <TopToolbar
      paddingBottom={pathname !== PORTFOLIO_ITEM_ROUTE_EDIT}
      breadcrumbs={!fromProducts}
      breadcrumbfragments={breadcrumbfragments}
    >
      {fromProducts && <BackToProducts />}
      <Level className="flex-no-wrap">
        <Switch>
          <Route path={PORTFOLIO_ITEM_ROUTE_EDIT} exact>
            <TopToolbarTitle
              title={formatMessage(portfolioMessages.editProduct)}
              noData
            />
          </Route>
          <Route>
            <StyledLevelItem grow alignStart className="pf-l-flex">
              {userCapabilities.update ? (
                <PortfolioItemIconItem
                  id={product.id}
                  sourceId={product.service_offering_source_ref}
                />
              ) : (
                <CardIcon
                  src={
                    window.catalog?.standalone
                      ? product.icon_url
                      : `${CATALOG_API_BASE}/portfolio_items/${product.id}/icon`
                  }
                  sourceId={product.service_offering_source_ref}
                  height={64}
                />
              )}
              <TextContent className="pf-u-ml-md">
                <Text component={TextVariants.h1}>{product.name}</Text>
              </TextContent>
            </StyledLevelItem>
            <LevelItem style={{ minHeight: 36 }} className="flex-item-no-wrap">
              <Level className="flex-no-wrap">
                <DetailToolbarActions
                  isOpen={isOpen}
                  setOpen={(open) => setOpen(open)}
                  orderUrl={`${url}/order`}
                  editUrl={`${url}/edit`}
                  copyUrl={`${url}/copy`}
                  editSurveyUrl={`${url}/edit-survey`}
                  workflowUrl={`${url}/edit-workflow`}
                  isFetching={isFetching}
                  availability={availability}
                  orderable={orderable}
                  userCapabilities={userCapabilities}
                  canLinkOrderProcesses={canLinkOrderProcesses}
                />
              </Level>
            </LevelItem>
          </Route>
        </Switch>
      </Level>
    </TopToolbar>
  );
};

PortfolioItemDetailToolbar.propTypes = {
  url: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  product: PropTypes.shape({
    distributor: PropTypes.string,
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    service_offering_source_ref: PropTypes.string.isRequired,
    metadata: PropTypes.shape({ orderable: PropTypes.bool }),
    icon_url: PropTypes.string
  }).isRequired,
  setOpen: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  availability: PropTypes.oneOf(['available', 'unavailable']).isRequired,
  userCapabilities: PropTypes.object,
  fromProducts: PropTypes.bool,
  orderable: PropTypes.bool,
  canLinkOrderProcesses: PropTypes.bool
};

PortfolioItemDetailToolbar.defaultProps = {
  isFetching: false,
  orderable: true
};

const SurveyEditorDropdown = ({ handleResetSurvey }) => {
  const formatMessage = useFormatMessage();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown
      isOpen={isOpen}
      isPlain
      onSelect={() => setIsOpen(false)}
      position="right"
      toggle={<KebabToggle onToggle={(isOpen) => setIsOpen(isOpen)} />}
      dropdownItems={[
        <DropdownItem
          onClick={handleResetSurvey}
          component="button"
          key="synchronize"
        >
          {formatMessage(portfolioMessages.restoreSurvey)}
        </DropdownItem>
      ]}
    />
  );
};

SurveyEditorDropdown.propTypes = {
  handleResetSurvey: PropTypes.func.isRequired
};

export const SurveyEditingToolbar = ({
  handleSaveSurvey,
  breadcrumbfragments,
  closeUrl,
  search,
  isFetching,
  isValid,
  modified,
  breadcrumbs,
  handleResetSurvey
}) => {
  const formatMessage = useFormatMessage();
  return (
    <TopToolbar
      breadcrumbs={breadcrumbs}
      breadcrumbfragments={breadcrumbfragments}
    >
      <Level>
        <StyledLevelItem grow alignStart className="pf-l-flex">
          <TextContent>
            <Text component={TextVariants.h1}>
              {formatMessage(portfolioMessages.portfolioItemSurvey)}
            </Text>
          </TextContent>
        </StyledLevelItem>
        <LevelItem>
          <Flex className="align-items-center">
            <ButtonWithSpinner
              variant="primary"
              ouiaId={'save-survey'}
              showSpinner={isFetching}
              isDisabled={isFetching || !isValid}
              onClick={handleSaveSurvey}
            >
              {formatMessage(actionMessages.save)}
            </ButtonWithSpinner>
            <Link
              to={{
                pathname: closeUrl,
                search
              }}
            >
              <Button ouiaId={'cancel'} variant="link">
                Cancel
              </Button>
            </Link>
            {modified && (
              <SurveyEditorDropdown handleResetSurvey={handleResetSurvey} />
            )}
          </Flex>
        </LevelItem>
      </Level>
    </TopToolbar>
  );
};

SurveyEditingToolbar.propTypes = {
  handleSaveSurvey: PropTypes.func.isRequired,
  closeUrl: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  isFetching: PropTypes.bool,
  isValid: PropTypes.bool,
  modified: PropTypes.bool,
  handleResetSurvey: PropTypes.func,
  fromProducts: PropTypes.bool,
  canLinkOrderProcesses: PropTypes.bool
};
