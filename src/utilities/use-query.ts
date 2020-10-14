import { useLocation } from 'react-router-dom';
import { StringObject } from '../types/common-types';

function useQuery<T = StringObject>(
  requiredParams: string[] = []
): [T, string, URLSearchParams] {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  return [
    requiredParams.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: query.get(curr)
      }),
      {}
    ) as T,
    search,
    query
  ];
}

export default useQuery;
