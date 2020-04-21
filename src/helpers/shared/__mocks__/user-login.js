import MockAdapter from 'axios-mock-adapter';
import { getAxiosInstance, getGraphqlInstance } from '../user-login';

export const mockApi = new MockAdapter(getAxiosInstance());
export const mockGraphql = new MockAdapter(getGraphqlInstance());
