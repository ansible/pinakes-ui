import React, { lazy, Suspense, Fragment } from 'react';
import { Route } from 'react-router-dom';
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
  const { objectName } = useSelector(
    ({
      platformReducer: {
        platformInventories: { data }
      }
    }) => ({
      objectName: data ? data.find((obj) => obj.id === id)?.name : 'inventory'
    })
  );
  return (
    <Suspense fallback={Fragment}>
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
    </Suspense>
  );
};

export default PlatformRoutes;
