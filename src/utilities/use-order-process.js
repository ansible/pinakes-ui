import { shallowEqual, useSelector } from 'react-redux';

const useOrderProcess = (id) => {
  const { orderProcesses } = useSelector(
    ({ orderProcessReducer: { orderProcesses } }) => ({ orderProcesses }),
    shallowEqual
  );

  return orderProcesses?.data?.find((op) => op.id === id);
};

export default useOrderProcess;
