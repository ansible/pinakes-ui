import { createContext } from 'react';
import { AnyObject } from './types/common-types';

export type UserContextValue = AnyObject;

const UserContext: React.Context<UserContextValue> = createContext({});

export default UserContext;
