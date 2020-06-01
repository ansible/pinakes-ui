import React, { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { INVENTORY_RESOURCE_TYPE } from '../../utilities/constants';
import useQuery from '../../utilities/use-query';
import { useSelector } from 'react-redux';

const EditApprovalWorkflow = lazy(() =>
  import(
    /* webpackChunkName: "edit-approval-workflow" */ '../common/edit-approval-workflow'
  )
);

const PlatformRoutes = () => {
  const [{ platform: id }] = useQuery(['platform']);
  const { objectName } = useSelector((state) => {
    const data = state?.platformReducer?.platformInventories?.data;
    return {
      objectName: data ? data.find((obj) => obj.id === id)?.name : 'inventory'
    };
  });
  return (
    <div>
      <Switch>
        <Route path="/platform/platform-inventories/edit-workflow">
          <EditApprovalWorkflow
            pushParam={{
              pathname: '/platform/platform-inventories',
              search: `?platform=${id}`
            }}
            objectType={INVENTORY_RESOURCE_TYPE}
            objectName={objectName}
            querySelector="inventory"
          />
        </Route>
      </Switch>
    </div>
  );
};

export default PlatformRoutes;
