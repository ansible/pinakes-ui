import { SET_LOADING_STATE } from '../../redux/action-types';
import loadingStateMiddleware from '../../utilities/loading-state-middleware';

describe('Loading state middleware', () => {
  it('should dispatch loading state action', () => {
    const dispatch = jest.fn();

    loadingStateMiddleware()(dispatch)({ type: 'FOO_REJECTED' });
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls).toEqual([ [{
      type: SET_LOADING_STATE,
      payload: false
    }], [{
      type: 'FOO_REJECTED'
    }] ]);
  });

  it('should not dispatch loading state action', () => {
    const dispatch = jest.fn();

    loadingStateMiddleware()(dispatch)({ type: 'FOO_SOMETHING' });
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls).toEqual([ [{ type: 'FOO_SOMETHING' }] ]);

  });
});
