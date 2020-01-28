import React from 'react';
import PropTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import {
  Level,
  LevelItem,
  Text,
  TextContent,
  TextVariants,
  Button
} from '@patternfly/react-core';

import DetailToolbarActions from './detail-toolbar-actions';
import { CATALOG_API_BASE } from '../../../utilities/constants';
import CardIcon from '../../../presentational-components/shared/card-icon';
import TopToolbar from '../../../presentational-components/shared/top-toolbar';
import IconUpload from './icon-upload';

const PortfolioItemIconItem = ({ uploadIcon, id, sourceId }) => (
  <div style={{ float: 'left' }} className="pf-u-mr-sm">
    <IconUpload uploadIcon={uploadIcon}>
      <CardIcon
        src={`${CATALOG_API_BASE}/portfolio_items/${id}/icon`}
        sourceId={sourceId}
        height={64}
      />
    </IconUpload>
  </div>
);

PortfolioItemIconItem.propTypes = {
  uploadIcon: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  sourceId: PropTypes.string.isRequired
};

export const PortfolioItemDetailToolbar = ({
  url,
  isOpen,
  product,
  setOpen,
  isFetching,
  uploadIcon
}) => (
  <TopToolbar breadcrumbsSpacing={false} breadcrumbs={true}>
    <PortfolioItemIconItem
      uploadIcon={uploadIcon}
      id={product.id}
      sourceId={product.service_offering_source_ref}
    />
    <Level>
      <LevelItem>
        <TextContent>
          <Text component={TextVariants.h1}>{product.name}</Text>
        </TextContent>
      </LevelItem>
      <LevelItem style={{ minHeight: 36 }}>
        <Level>
          <Route
            exact
            path={url}
            render={(...args) => (
              <DetailToolbarActions
                isOpen={isOpen}
                setOpen={(open) => setOpen(open)}
                orderUrl={`${url}/order`}
                editUrl={`${url}/edit`}
                copyUrl={`${url}/copy`}
                editSurveyUrl={`${url}/edit-survey`}
                workflowUrl={`${url}/edit-workflow`}
                isFetching={isFetching}
                {...args}
              />
            )}
          />
        </Level>
      </LevelItem>
    </Level>
    <Level>
      <LevelItem>
        <TextContent>
          <Text component={TextVariants.small}>{product.distributor}</Text>
        </TextContent>
      </LevelItem>
    </Level>
  </TopToolbar>
);

PortfolioItemDetailToolbar.propTypes = {
  url: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  product: PropTypes.shape({
    distributor: PropTypes.string,
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    service_offering_source_ref: PropTypes.string.isRequired
  }).isRequired,
  setOpen: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  uploadIcon: PropTypes.func.isRequired
};

PortfolioItemDetailToolbar.defaultProps = {
  isFetching: false
};

export const SurveyEditingToolbar = ({
  uploadIcon,
  product,
  handleSaveSurvey,
  closeUrl,
  search
}) => (
  <TopToolbar breadcrumbsSpacing={false} breadcrumbs={true}>
    <PortfolioItemIconItem
      uploadIcon={uploadIcon}
      id={product.id}
      sourceId={product.service_offering_source_ref}
    />
    <Level>
      <LevelItem>
        <TextContent>
          <Text component={TextVariants.h1}>
            Editing survey: {product.name}
          </Text>
        </TextContent>
      </LevelItem>
      <LevelItem>
        <Button variant="primary" onClick={handleSaveSurvey}>
          Save
        </Button>
        <Link
          to={{
            pathname: closeUrl,
            search
          }}
        >
          <Button variant="link">Cancel</Button>
        </Link>
      </LevelItem>
    </Level>
  </TopToolbar>
);

SurveyEditingToolbar.propTypes = {
  uploadIcon: PropTypes.func.isRequired,
  product: PropTypes.object,
  handleSaveSurvey: PropTypes.func.isRequired,
  closeUrl: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired
};
