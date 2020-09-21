import { AnyObject } from '../types/common-types';
import { decodeState } from './uri-state-manager';

const useInitialUriHash = (): AnyObject | undefined =>
  decodeState(window.location.hash.substring(1));

export default useInitialUriHash;
