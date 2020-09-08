import awesomeDebouncePromise, {
  AwesomeDebounceOptions
} from 'awesome-debounce-promise';

const asyncFormValidator = <T = any>(
  asyncFunction: (...args: any[]) => T,
  debounceTime = 250,
  options: Partial<AwesomeDebounceOptions> = { onlyResolvesLast: false }
): any => awesomeDebouncePromise(asyncFunction, debounceTime, options);

export default asyncFormValidator;
