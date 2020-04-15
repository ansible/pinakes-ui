import { decodeState } from './uri-state-manager';

const useInitialUriHash = () => decodeState(window.location.hash.substring(1));

export default useInitialUriHash;
