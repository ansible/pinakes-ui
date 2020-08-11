import emptyDataMiddleware from '../../utilities/empty-data-middleware';

describe('emptyDataMiddleware', () => {
  let middleware = emptyDataMiddleware();
  it('should not change pending input action', () => {
    const dispatch = jest.fn();
    const action = { type: 'FOO_PENDING' };
    middleware(dispatch)(action);
    expect(dispatch).toHaveBeenCalledWith({ ...action });
  });

  it('should not changed fulfilled action witouth required meta data', () => {
    const dispatch = jest.fn();
    const action = { type: 'FOO_FULFILLED' };
    middleware(dispatch)(action);
    expect(dispatch).toHaveBeenCalledWith({ ...action });
  });

  it('should add notData = false to non empty action', () => {
    const dispatch = jest.fn();
    const action = {
      type: 'FOO_FULFILLED',
      payload: { data: ['1'], meta: { count: 1 } },
      meta: {}
    };
    const expectedAction = {
      ...action,
      payload: {
        ...action.payload,
        meta: { count: 1, noData: false }
      }
    };
    middleware(dispatch)(action);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should add notData = false to empty action but with filter', () => {
    const dispatch = jest.fn();
    const action = {
      type: 'FOO_FULFILLED',
      payload: { data: [], meta: { count: 0 } },
      meta: { filter: 'foo' }
    };
    const expectedAction = {
      ...action,
      payload: {
        ...action.payload,
        meta: { count: 0, noData: false }
      }
    };
    middleware(dispatch)(action);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should add notData = false to empty action with composite filter', () => {
    const dispatch = jest.fn();
    const action = {
      type: 'FOO_FULFILLED',
      payload: { data: [], meta: { count: 0 } },
      meta: { filters: { foo: 'bar' } }
    };
    const expectedAction = {
      ...action,
      payload: {
        ...action.payload,
        meta: { count: 0, noData: false }
      }
    };
    middleware(dispatch)(action);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should add notData = true to empty action with undefined composite filter key', () => {
    const dispatch = jest.fn();
    const action = {
      type: 'FOO_FULFILLED',
      payload: { data: [], meta: { count: 0 } },
      meta: { filters: undefined }
    };
    const expectedAction = {
      ...action,
      payload: {
        ...action.payload,
        meta: { count: 0, noData: true }
      }
    };
    middleware(dispatch)(action);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should add notData = true to empty action with empty simple filter', () => {
    const dispatch = jest.fn();
    const action = {
      type: 'FOO_FULFILLED',
      payload: { data: [], meta: { count: 0 } },
      meta: { filter: '' }
    };
    const expectedAction = {
      ...action,
      payload: {
        ...action.payload,
        meta: { count: 0, noData: true }
      }
    };
    middleware(dispatch)(action);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should add notData = true to empty action with empty composite filter', () => {
    const dispatch = jest.fn();
    const action = {
      type: 'FOO_FULFILLED',
      payload: { data: [], meta: { count: 0 } },
      meta: { filters: {} }
    };
    const expectedAction = {
      ...action,
      payload: {
        ...action.payload,
        meta: { count: 0, noData: true }
      }
    };
    middleware(dispatch)(action);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
