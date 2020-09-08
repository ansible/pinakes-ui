import { useLocation } from 'react-router-dom';
import { StringObject } from '../types/common-types';

type UseQueryValue = [StringObject, string | undefined, URLSearchParams];
type UseQuery = (requiredParams: string[]) => UseQueryValue;

const useQuery: UseQuery = (requiredParams = []) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  return [
    requiredParams.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: query.get(curr)
      }),
      {}
    ),
    search,
    query
  ];
};

export default useQuery;
