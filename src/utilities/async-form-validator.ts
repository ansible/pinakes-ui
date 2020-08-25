import awesomeDebouncePromise, {
  AwesomeDebounceOptions
} from 'awesome-debounce-promise';

const asyncFormValidator = (
  asyncFunction: (...args: any[]) => any,
  debounceTime = 250,
  options: Partial<AwesomeDebounceOptions> = { onlyResolvesLast: false }
): any => awesomeDebouncePromise(asyncFunction, debounceTime, options);

export default asyncFormValidator;
