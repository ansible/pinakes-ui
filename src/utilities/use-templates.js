import { shallowEqual, useSelector } from 'react-redux';

const useTemplate = (id) => {
  const { templates } = useSelector(
    ({ templateReducer: { templates } }) => ({ templates }),
    shallowEqual
  );

  return (
    templates &&
    templates.data &&
    templates.data.find((template) => template.id === id)
  );
};

export default useTemplate;
