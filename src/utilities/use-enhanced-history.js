import { useHistory } from 'react-router-dom';

const removeSearchQuery = (target) => {
  if (typeof target === 'string') {
    return target.split('?')[0];
  }

  if (typeof target === 'object') {
    return {
      ...target,
      search: undefined
    };
  }

  return target;
};

/**
 * Wrapper around useHistory hook which adds aditional settings to standard history methods
 * @param {Boolean} removeSearch if true, using history navigation methods will remove search string from path
 */
const useEnhancedHistory = (removeSearch) => {
  const history = useHistory();
  return {
    ...history,
    push: (target) => {
      if (removeSearch) {
        return history.push(removeSearchQuery(target));
      }

      return history.push(target);
    }
  };
};

export default useEnhancedHistory;
