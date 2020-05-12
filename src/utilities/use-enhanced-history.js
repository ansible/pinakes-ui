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
 * @param {Boolean} keepHash if true, using history navigation methods will not remove hash from URL
 */
const useEnhancedHistory = ({ removeSearch, keepHash } = {}) => {
  const history = useHistory();
  return {
    ...history,
    push: (target) => {
      let internalTarget = target;
      if (keepHash && history.location.hash.length > 0) {
        internalTarget =
          typeof internalTarget === 'object'
            ? { ...internalTarget, hash: history.location.hash }
            : `${internalTarget}${history.location.hash}`;
      }

      if (removeSearch) {
        return history.push(removeSearchQuery(internalTarget));
      }

      return history.push(internalTarget);
    }
  };
};

export default useEnhancedHistory;
