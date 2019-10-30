import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { scrollToTop } from '../../helpers/shared/helpers';
import { fetchSelectedPlatform } from '../../redux/actions/platform-actions';
import PlatformTemplates from './platform_templates';
import PlatformInventories from './platform_inventories';

const Platform = (props) => {

  useEffect(() => {
    fetchSelectedPlatform(props.match.params.id);
    scrollToTop();
  }, [ props.match.params.id ]);

  return (
    <Fragment>
      <Switch>
        <Route path={ `/platforms/detail/:id/platform-templates` } component={ PlatformTemplates }/>
        <Route path={ `/platforms/detail/:id/platform-inventories` } component={ PlatformInventories }/>
        <Route render={ () => <Redirect to={ `/platforms/detail/${props.match.params.id}/platform-templates` } /> } />
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
