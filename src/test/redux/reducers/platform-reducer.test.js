import platformReducer from '../../../redux/reducers/platform-reducer';
import { callReducer } from '../redux-helpers';

import {
  FETCH_PLATFORM,
  FETCH_PLATFORMS,
  FETCH_PLATFORM_ITEMS,
  FETCH_PLATFORM_ITEM,
  FILTER_PLATFORM_ITEMS,
  FETCH_MULTIPLE_PLATFORM_ITEMS,
  FETCH_SERVICE_OFFERING
} from '../../../redux/action-types';

describe('Platform reducer', () => {
  let initialState;
  const reducer = callReducer(platformReducer);

  beforeEach(() => {
    initialState = {
      sourceTypeIcons: { 3: '/foo/bar' }
    };
  });

  it('should set loading state to true', () => {
    const expectedState = expect.objectContaining({
      isPlatformDataLoading: true
    });
    expect(
      reducer(initialState, { type: `${FETCH_PLATFORMS}_PENDING` })
    ).toEqual(expectedState);

    expect(
      reducer(initialState, { type: `${FETCH_PLATFORM_ITEMS}_PENDING` })
    ).toEqual(expectedState);

    expect(
      reducer(initialState, { type: `${FETCH_PLATFORM_ITEM}_PENDING` })
    ).toEqual(expectedState);

    expect(
      reducer(initialState, { type: `${FETCH_PLATFORM}_PENDING` })
    ).toEqual(expectedState);
  });

  it('should store platforms data and set loading state to false', () => {
    const payload = [{ id: '123', source_type_id: '3' }];
    const expectedState = expect.objectContaining({
      isPlatformDataLoading: false,
      platforms: [
        {
          id: '123',
          source_type_id: '3'
        }
      ],
      sourceTypeIcons: {
        3: '/foo/bar'
      }
    });
    expect(
      reducer(initialState, { type: `${FETCH_PLATFORMS}_FULFILLED`, payload })
    ).toEqual(expectedState);
  });

  it('should store platform items data and set loading state to false', () => {
    const payload = { data: [] };
    const expectedState = expect.objectContaining({
      isPlatformDataLoading: false,
      platformItems: { 1: payload, 2: 'Bar' }
    });
    expect(
      reducer(
        {
          platformItems: { 2: 'Bar' }
        },
        {
          type: `${FETCH_PLATFORM_ITEMS}_FULFILLED`,
          payload,
          meta: { platformId: 1 }
        }
      )
    ).toEqual(expectedState);
  });

  it('should store portfolio items data and set loading state to false', () => {
    const payload = { data: 'Foo' };
    const expectedState = expect.objectContaining({
      isPlatformDataLoading: false,
      portfolioItem: payload
    });
    expect(
      reducer(initialState, {
        type: `${FETCH_PLATFORM_ITEM}_FULFILLED`,
        payload
      })
    ).toEqual(expectedState);
  });

  it('should store platform data and set loading state to false', () => {
    const payload = { data: 'Foo' };
    const expectedState = expect.objectContaining({
      isLoading: false,
      selectedPlatform: payload
    });
    expect(
      reducer(initialState, {
        type: `${FETCH_PLATFORM}_FULFILLED`,
        payload
      })
    ).toEqual(expectedState);
  });

  it('should set platform filter', () => {
    const payload = 'Foo';
    const expectedState = expect.objectContaining({ filterValue: payload });
    expect(
      reducer(initialState, {
        type: `${FILTER_PLATFORM_ITEMS}_FULFILLED`,
        payload
      })
    ).toEqual(expectedState);
  });

  it('should store multiple platform items data and set loading state to false', () => {
    const payload = { 1: { data: 'Foo' }, 3: { data: 'Quux' } };
    const expectedState = expect.objectContaining({
      isPlatformDataLoading: false,
      platformItems: { ...payload, 2: 'Bar' }
    });
    expect(
      reducer(
        {
          platformItems: { 2: 'Bar' }
        },
        {
          type: `${FETCH_MULTIPLE_PLATFORM_ITEMS}_FULFILLED`,
          payload
        }
      )
    ).toEqual(expectedState);
  });

  it('should set serviceOffering', () => {
    expect(
      reducer(
        {},
        { type: `${FETCH_SERVICE_OFFERING}_FULFILLED`, payload: 'foo' }
      )
    ).toEqual({
      serviceOffering: 'foo'
    });
  });
});
