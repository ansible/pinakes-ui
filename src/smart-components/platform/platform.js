import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';
import { scrollToTop } from '../../helpers/shared/helpers';
import { fetchSelectedPlatform } from '../../redux/actions/platform-actions';
import PlatformTemplates from './platform_templates';
import PlatformInventories from './platform_inventories';
import AppTabs from './../../presentational-components/shared/app-tabs';

const Platform = (props) => {

  const tabItems = [{ eventKey: 0, title: 'Templates', name: `/platforms/detail/${props.match.params.id}/platform-templates` },
    { eventKey: 1, title: 'Inventories', name: `/platforms/detail/${props.match.params.id}/platform-inventories` }];

  useEffect(() => {
    this.fetchData(props.match.params.id, defaultSettings);
    scrollToTop();
  }, [ props.match.params.id ]);

  return (
    <Fragment>
      <AppTabs tabItems={ tabItems }/>
      <Switch>
        <Route path={ `/platforms/detail/:id/platform-templates` } component={ PlatformTemplates }/>
        <Route path={ `/platforms/detail/:id/platform-inventories` } component={ PlatformInventories }/>
      </Switch>
    </Fragment>
  );
};

const mapStateToProps = ({ platformReducer: { selectedPlatform }}) => {
  return {
    platform: selectedPlatform,
    isPlatformDataLoading: selectedPlatform
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSelectedPlatform
}, dispatch);

Platform.propTypes = {
  match: PropTypes.object,
  fetchSelectedPlatform: PropTypes.func,
  platform: PropTypes.shape({
    name: PropTypes.string
  })
};

export default connect(mapStateToProps, mapDispatchToProps)(Platform);
