import { shallowEqual, useSelector } from 'react-redux';
import { ApiCollectionResponse } from '../types/common-types';
import { CatalogRootState } from '../types/redux';
import { OrderProcess } from '@redhat-cloud-services/catalog-client';

const useOrderProcess = (id: string): OrderProcess | undefined => {
  const orderProcesses = useSelector<
    CatalogRootState,
    ApiCollectionResponse<OrderProcess>
  >(
    ({ orderProcessReducer: { orderProcesses } }) => orderProcesses,
    shallowEqual
  );

  return orderProcesses?.data?.find((op) => op.id === id);
};

export default useOrderProcess;
