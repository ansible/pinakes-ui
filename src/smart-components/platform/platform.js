import React, { Fragment, useEffect } from 'react';
import { Route, Switch, Redirect, useParams } from 'react-router-dom';
import { scrollToTop } from '../../helpers/shared/helpers';
import { fetchSelectedPlatform } from '../../redux/actions/platform-actions';
import PlatformTemplates from './platform-templates';
import PlatformInventories from './platform-inventories';

const Platform = () => {
  let { id } = useParams();

  useEffect(() => {
    fetchSelectedPlatform(id);
    scrollToTop();
  }, [ id ]);

  return (
    <Fragment>
      <Switch>
        <Route path={ `/platforms/detail/:id/platform-templates` }>
          <PlatformTemplates/>
        </Route>
        <Route path={ `/platforms/detail/:id/platform-inventories` }>
          <PlatformInventories/>
        </Route>
        <Route render={ () => <Redirect to={ `/platforms/detail/${id}/platform-templates` } /> } />
      </Switch>
    </Fragment>
  );
};

export default Platform;
