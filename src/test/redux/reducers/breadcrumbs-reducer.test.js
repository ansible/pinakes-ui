import breadcrumbsReducer, {
  initialBreadcrumbsState
} from '../../../redux/reducers/breadcrumbs-reducer';
import { callReducer } from '../redux-helpers';
import { INITIALIZE_BREADCRUMBS } from '../../../redux/action-types';

describe('breadcrumbs reducer', () => {
  const reducer = callReducer(breadcrumbsReducer);
  it('should initialize fragments', () => {
    expect(
      reducer(initialBreadcrumbsState, {
        type: INITIALIZE_BREADCRUMBS,
        payload: 'foo'
      })
    ).toEqual({ fragments: 'foo' });
  });
});
