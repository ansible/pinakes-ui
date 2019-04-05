import { callReducer } from '../redux-helpers';
import shareReducer from '../../../redux/reducers/share-reducer';
import { QUERY_PORTFOLIO } from '../../../redux/action-types';

describe('Share reducer', () => {
  let initialState;
  const reducer = callReducer(shareReducer);

  beforeEach(() => {
    initialState = {};
  });

  it('should set loading state to true', () => {
    const expectedState = expect.objectContaining({ isLoading: true });
    expect(reducer(initialState, { type: `${QUERY_PORTFOLIO}_PENDING` })).toEqual(expectedState);
  });

  it('should set the share info data and set loading state to false', () => {
    const payload = { data: 'Foo' };
    const expectedState = { isLoading: false, shareInfo: payload };
    expect(reducer(initialState, { type: `${QUERY_PORTFOLIO}_FULFILLED`, payload })).toEqual(expectedState);
  });
});
